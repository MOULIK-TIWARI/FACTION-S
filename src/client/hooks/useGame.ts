import { useCallback, useEffect, useState } from 'react';
import type { 
  InitResponse, 
  GameState, 
  FactionType, 
  ActionType,
  JoinFactionResponse,
  VoteResponse,
  GameStateResponse,
  RestartGameResponse
} from '../../shared/types/api';

interface GameHookState {
  gameState: GameState | null;
  username: string | null;
  playerFaction: FactionType | undefined;
  hasVoted: boolean;
  loading: boolean;
  error: string | null;
}

export const useGame = () => {
  const [state, setState] = useState<GameHookState>({
    gameState: null,
    username: null,
    playerFaction: undefined,
    hasVoted: false,
    loading: true,
    error: null,
  });

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        
        setState({
          gameState: data.gameState,
          username: data.username,
          playerFaction: data.playerFaction,
          hasVoted: data.hasVoted,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Failed to init game', err);
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: err instanceof Error ? err.message : 'Failed to load game'
        }));
      }
    };
    void init();
  }, []);

  const refreshGameState = useCallback(async () => {
    try {
      const res = await fetch('/api/game-state');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GameStateResponse = await res.json();
      
      setState(prev => ({
        ...prev,
        gameState: data.gameState,
        playerFaction: data.playerFaction,
        hasVoted: data.hasVoted,
        error: null,
      }));
    } catch (err) {
      console.error('Failed to refresh game state', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to refresh game state'
      }));
    }
  }, []);

  const joinFaction = useCallback(async (faction: FactionType): Promise<boolean> => {
    try {
      const res = await fetch('/api/join-faction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faction }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JoinFactionResponse = await res.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          playerFaction: faction,
          error: null,
        }));
        await refreshGameState();
      } else {
        setState(prev => ({ ...prev, error: data.message }));
      }
      
      return data.success;
    } catch (err) {
      console.error('Failed to join faction', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to join faction'
      }));
      return false;
    }
  }, [refreshGameState]);

  const submitVote = useCallback(async (action: ActionType, target?: FactionType): Promise<boolean> => {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, target }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VoteResponse = await res.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          hasVoted: true,
          error: null,
        }));
        await refreshGameState();
      } else {
        setState(prev => ({ ...prev, error: data.message }));
      }
      
      return data.success;
    } catch (err) {
      console.error('Failed to submit vote', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to submit vote'
      }));
      return false;
    }
  }, [refreshGameState]);

  const restartGame = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/restart-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RestartGameResponse = await res.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          playerFaction: undefined,
          hasVoted: false,
          error: null,
        }));
        await refreshGameState();
      } else {
        setState(prev => ({ ...prev, error: data.message }));
      }
      
      return data.success;
    } catch (err) {
      console.error('Failed to restart game', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to restart game'
      }));
      return false;
    }
  }, [refreshGameState]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    joinFaction,
    submitVote,
    restartGame,
    refreshGameState,
    clearError,
  } as const;
};
