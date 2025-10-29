import { redis } from '@devvit/web/server';
import { GameLogic } from './gameLogic';

export class TurnScheduler {
  private static readonly LAST_TURN_KEY = 'last_turn_processed';
  private static readonly TURN_INTERVAL_SECONDS = 30; // 30 seconds between turns

  static async shouldProcessTurn(): Promise<boolean> {
    const lastTurnStr = await redis.get(this.LAST_TURN_KEY);
    if (!lastTurnStr) {
      return true; // First turn
    }

    const lastTurn = parseInt(lastTurnStr);
    const now = Date.now();
    const timeSinceLastTurn = now - lastTurn;
    const intervalMs = this.TURN_INTERVAL_SECONDS * 1000;

    return timeSinceLastTurn >= intervalMs;
  }

  static async processTurnIfReady(): Promise<{ processed: boolean; nextTurnIn?: number }> {
    const shouldProcess = await this.shouldProcessTurn();
    
    if (!shouldProcess) {
      const lastTurnStr = await redis.get(this.LAST_TURN_KEY);
      const lastTurn = lastTurnStr ? parseInt(lastTurnStr) : Date.now();
      const intervalMs = this.TURN_INTERVAL_SECONDS * 1000;
      const nextTurnIn = intervalMs - (Date.now() - lastTurn);
      
      return { processed: false, nextTurnIn };
    }

    // Process the turn
    await GameLogic.processTurn();
    await redis.set(this.LAST_TURN_KEY, Date.now().toString());

    return { processed: true };
  }

  static async getTimeUntilNextTurn(): Promise<number> {
    const lastTurnStr = await redis.get(this.LAST_TURN_KEY);
    if (!lastTurnStr) {
      return 0; // Ready for first turn
    }

    const lastTurn = parseInt(lastTurnStr);
    const intervalMs = this.TURN_INTERVAL_SECONDS * 1000;
    const nextTurnIn = intervalMs - (Date.now() - lastTurn);

    return Math.max(0, nextTurnIn);
  }

  static async markTurnProcessed(): Promise<void> {
    await redis.set(this.LAST_TURN_KEY, Date.now().toString());
  }
}
