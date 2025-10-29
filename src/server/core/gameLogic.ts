import { redis } from '@devvit/web/server';
import type {
  FactionType,
  ActionType,
  GameState,
  Vote,
  TurnResult,
  FactionStats,
} from '../../shared/types/api';

const FACTIONS: FactionType[] = ['Fire', 'Water', 'Earth', 'Air'];

export class GameLogic {
  private static readonly GAME_STATE_KEY = 'game_state';
  private static readonly VOTES_KEY = 'current_votes';
  private static readonly INITIAL_HP = 100;
  private static readonly INITIAL_SCORE = 0;
  private static readonly MAX_ROUNDS = 50;

  static async initializeGame(): Promise<GameState> {
    const initialState: GameState = {
      factions: {
        Fire: { hp: this.INITIAL_HP, score: this.INITIAL_SCORE },
        Water: { hp: this.INITIAL_HP, score: this.INITIAL_SCORE },
        Earth: { hp: this.INITIAL_HP, score: this.INITIAL_SCORE },
        Air: { hp: this.INITIAL_HP, score: this.INITIAL_SCORE },
      },
      players: {},
      currentTurn: 1,
      lastTurnResults: [],
      gameActive: true,
    };

    await redis.set(this.GAME_STATE_KEY, JSON.stringify(initialState));
    await redis.del(this.VOTES_KEY);
    return initialState;
  }

  static async getGameState(): Promise<GameState> {
    const stateStr = await redis.get(this.GAME_STATE_KEY);
    if (!stateStr) {
      return await this.initializeGame();
    }
    return JSON.parse(stateStr);
  }

  static async saveGameState(state: GameState): Promise<void> {
    await redis.set(this.GAME_STATE_KEY, JSON.stringify(state));
  }

  static async joinFaction(username: string, faction: FactionType): Promise<boolean> {
    const gameState = await this.getGameState();

    // Check if player is already in a faction
    if (gameState.players[username]) {
      return false;
    }

    gameState.players[username] = {
      username,
      faction,
      hasVoted: false,
    };

    await this.saveGameState(gameState);
    return true;
  }

  static async submitVote(
    username: string,
    action: ActionType,
    target?: FactionType
  ): Promise<boolean> {
    const gameState = await this.getGameState();
    const player = gameState.players[username];

    if (!player || player.hasVoted) {
      return false;
    }

    // Validate target for attack actions
    if (action === 'Attack' && (!target || target === player.faction)) {
      return false;
    }

    const vote: Vote = {
      username,
      faction: player.faction,
      action,
      target: target || undefined,
    };

    // Store vote
    const votesStr = (await redis.get(this.VOTES_KEY)) || '[]';
    const votes: Vote[] = JSON.parse(votesStr);
    votes.push(vote);
    await redis.set(this.VOTES_KEY, JSON.stringify(votes));

    // Mark player as voted
    player.hasVoted = true;
    await this.saveGameState(gameState);

    return true;
  }

  static async processTurn(): Promise<TurnResult[]> {
    const gameState = await this.getGameState();
    
    // Check if game has reached maximum rounds
    if (gameState.currentTurn >= this.MAX_ROUNDS) {
      gameState.gameActive = false;
      await this.saveGameState(gameState);
      return [{
        faction: 'Fire',
        action: 'Train',
        result: `Game has ended after ${this.MAX_ROUNDS} rounds! Final standings determined.`,
      }];
    }
    
    const votesStr = (await redis.get(this.VOTES_KEY)) || '[]';
    const votes: Vote[] = JSON.parse(votesStr);

    // Count votes by faction
    const factionActions: Record<
      FactionType,
      { action: ActionType; target?: FactionType | undefined; votes: number }
    > = {
      Fire: { action: 'Defend', votes: 0 },
      Water: { action: 'Defend', votes: 0 },
      Earth: { action: 'Defend', votes: 0 },
      Air: { action: 'Defend', votes: 0 },
    };

    // Tally votes for each faction
    for (const faction of FACTIONS) {
      const factionVotes = votes.filter((v) => v.faction === faction);
      const actionCounts: Record<string, { count: number; target?: FactionType | undefined }> = {};

      for (const vote of factionVotes) {
        const key = vote.action + (vote.target ? `_${vote.target}` : '');
        if (!actionCounts[key]) {
          actionCounts[key] = { count: 0, target: vote.target || undefined };
        }
        actionCounts[key]!.count++;
      }

      // Find most popular action
      let maxVotes = 0;
      let chosenAction: ActionType = 'Defend';
      let chosenTarget: FactionType | undefined;

      for (const [key, data] of Object.entries(actionCounts)) {
        if (data.count > maxVotes) {
          maxVotes = data.count;
          chosenAction = key.split('_')[0] as ActionType;
          chosenTarget = data.target;
        }
      }

      factionActions[faction] = {
        action: chosenAction,
        target: chosenTarget || undefined,
        votes: maxVotes,
      };
    }

    // Execute actions and calculate results
    const results: TurnResult[] = [];
    const newStats: Record<FactionType, FactionStats> = { ...gameState.factions };

    for (const faction of FACTIONS) {
      const factionAction = factionActions[faction];
      const result = this.executeAction(faction, factionAction, factionActions, newStats);
      results.push(result);
    }

    // Update game state
    gameState.factions = newStats;
    gameState.currentTurn++;
    gameState.lastTurnResults = results;

    // Reset player votes
    for (const player of Object.values(gameState.players)) {
      player.hasVoted = false;
    }

    await this.saveGameState(gameState);
    await redis.del(this.VOTES_KEY);

    return results;
  }

  private static executeAction(
    faction: FactionType,
    factionAction: { action: ActionType; target?: FactionType | undefined; votes: number },
    allActions: Record<
      FactionType,
      { action: ActionType; target?: FactionType | undefined; votes: number }
    >,
    stats: Record<FactionType, FactionStats>
  ): TurnResult {
    const { action, target } = factionAction;

    switch (action) {
      case 'Attack':
        if (!target) {
          return {
            faction,
            action,
            result: `${faction} attempted to attack but had no valid target!`,
          };
        }
        return this.executeAttack(faction, target, allActions, stats);

      case 'Defend':
        return {
          faction,
          action,
          result: `${faction} chose to defend and is ready to block incoming attacks.`,
        };

      case 'Train':
        return this.executeTrain(faction, allActions, stats);

      default:
        return {
          faction,
          action,
          result: `${faction} took no action this turn.`,
        };
    }
  }

  private static executeAttack(
    attacker: FactionType,
    target: FactionType,
    allActions: Record<
      FactionType,
      { action: ActionType; target?: FactionType | undefined; votes: number }
    >,
    stats: Record<FactionType, FactionStats>
  ): TurnResult {
    const targetAction = allActions[target].action;
    let damage = 0;
    let result = '';

    if (targetAction === 'Defend') {
      // Attack vs Defend: Defender wins, reduced damage
      damage = 5;
      stats[target].hp = Math.max(0, stats[target].hp - damage);
      result = `${attacker} attacked ${target}, but ${target} defended and only took ${damage} damage!`;
    } else if (targetAction === 'Train') {
      // Attack vs Train: Attacker wins, full damage
      damage = 20;
      stats[target].hp = Math.max(0, stats[target].hp - damage);
      // Target still gets training bonus
      stats[target].score += 10;
      result = `${attacker} attacked ${target} while they were training, dealing ${damage} damage! ${target} still gained 10 score from training.`;
    } else if (targetAction === 'Attack' && allActions[target].target === attacker) {
      // Mutual attack: Both take damage
      damage = 15;
      stats[attacker].hp = Math.max(0, stats[attacker].hp - damage);
      stats[target].hp = Math.max(0, stats[target].hp - damage);
      result = `${attacker} and ${target} attacked each other simultaneously, both taking ${damage} damage!`;
    } else {
      // Attack vs other action: Normal damage
      damage = 20;
      stats[target].hp = Math.max(0, stats[target].hp - damage);
      result = `${attacker} attacked ${target}, dealing ${damage} damage!`;
    }

    return {
      faction: attacker,
      action: 'Attack',
      target,
      damage,
      result,
    };
  }

  private static executeTrain(
    faction: FactionType,
    allActions: Record<
      FactionType,
      { action: ActionType; target?: FactionType | undefined; votes: number }
    >,
    stats: Record<FactionType, FactionStats>
  ): TurnResult {
    const scoreGain = 10;
    stats[faction].score += scoreGain;

    // Check if being attacked
    const attackers = FACTIONS.filter(
      (f) => allActions[f].action === 'Attack' && allActions[f].target === faction
    );

    if (attackers.length > 0) {
      return {
        faction,
        action: 'Train',
        scoreGain,
        result: `${faction} trained and gained ${scoreGain} score, but was vulnerable to attacks!`,
      };
    }

    return {
      faction,
      action: 'Train',
      scoreGain,
      result: `${faction} trained safely and gained ${scoreGain} score!`,
    };
  }

  static async resetGame(): Promise<void> {
    await this.initializeGame();
    // Also reset the turn timer by clearing the last turn processed timestamp
    await redis.del('last_turn_processed');
    // Clear comments when game restarts
    await redis.del('game_comments');
  }

  static async getPlayerFaction(username: string): Promise<FactionType | undefined> {
    const gameState = await this.getGameState();
    return gameState.players[username]?.faction;
  }

  static async hasPlayerVoted(username: string): Promise<boolean> {
    const gameState = await this.getGameState();
    return gameState.players[username]?.hasVoted || false;
  }
}
