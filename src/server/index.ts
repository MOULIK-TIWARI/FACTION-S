import express from 'express';
import {
  InitResponse,
  JoinFactionResponse,
  VoteResponse,
  GameStateResponse,
  RestartGameResponse,
  FactionType,
  ActionType,
} from '../shared/types/api';
import { reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { GameLogic } from './core/gameLogic';
import { TurnScheduler } from './core/scheduler';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const gameState = await GameLogic.getGameState();
      const playerFaction = await GameLogic.getPlayerFaction(username ?? '');
      const hasVoted = await GameLogic.hasPlayerVoted(username ?? '');

      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
        gameState,
        playerFaction,
        hasVoted,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<
  {},
  JoinFactionResponse | { status: string; message: string },
  { faction: FactionType }
>('/api/join-faction', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const { faction } = req.body;
    if (!faction || !['Fire', 'Water', 'Earth', 'Air'].includes(faction)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid faction',
      });
      return;
    }

    const success = await GameLogic.joinFaction(username, faction);

    if (success) {
      res.json({
        type: 'join-faction',
        success: true,
        faction,
        message: `Successfully joined ${faction} faction!`,
      });
    } else {
      res.json({
        type: 'join-faction',
        success: false,
        message: 'You are already in a faction!',
      });
    }
  } catch (error) {
    console.error('Join faction error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to join faction',
    });
  }
});

router.post<
  {},
  VoteResponse | { status: string; message: string },
  { action: ActionType; target?: FactionType }
>('/api/vote', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const { action, target } = req.body;
    if (!action || !['Attack', 'Defend', 'Train'].includes(action)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid action',
      });
      return;
    }

    const success = await GameLogic.submitVote(username, action, target);

    if (success) {
      res.json({
        type: 'vote',
        success: true,
        message: `Vote submitted: ${action}${target ? ` on ${target}` : ''}`,
      });
    } else {
      res.json({
        type: 'vote',
        success: false,
        message: 'Unable to submit vote. You may have already voted or are not in a faction.',
      });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit vote',
    });
  }
});

router.get<{}, GameStateResponse | { status: string; message: string }>(
  '/api/game-state',
  async (_req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      const gameState = await GameLogic.getGameState();
      const playerFaction = await GameLogic.getPlayerFaction(username ?? '');
      const hasVoted = await GameLogic.hasPlayerVoted(username ?? '');

      res.json({
        type: 'game-state',
        gameState,
        playerFaction,
        hasVoted,
      });
    } catch (error) {
      console.error('Game state error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get game state',
      });
    }
  }
);

router.post<{}, RestartGameResponse | { status: string; message: string }>(
  '/api/restart-game',
  async (_req, res): Promise<void> => {
    try {
      // Check if user is a moderator
      const user = await reddit.getCurrentUser();
      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // For now, allow any authenticated user to restart (in production, implement proper mod check)
      const isModerator = true; // TODO: Implement proper moderator check

      if (!isModerator) {
        res.status(403).json({
          status: 'error',
          message: 'Only moderators can restart the game',
        });
        return;
      }

      await GameLogic.resetGame();

      res.json({
        type: 'restart-game',
        success: true,
        message: 'Game has been reset successfully!',
      });
    } catch (error) {
      console.error('Restart game error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to restart game',
      });
    }
  }
);

router.post<{}, { success: boolean; message: string; processed?: boolean; nextTurnIn?: number }>(
  '/api/process-turn',
  async (_req, res): Promise<void> => {
    try {
      const result = await TurnScheduler.processTurnIfReady();

      if (result.processed) {
        res.json({
          success: true,
          message: 'Turn processed successfully!',
          processed: true,
        });
      } else {
        const minutesRemaining = Math.ceil((result.nextTurnIn || 0) / (1000 * 60));
        res.json({
          success: true,
          message: `Next turn in approximately ${minutesRemaining} minutes`,
          processed: false,
          nextTurnIn: result.nextTurnIn || 0,
        });
      }
    } catch (error) {
      console.error('Process turn error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process turn',
      });
    }
  }
);

router.get<{}, { timeUntilNext: number; minutesRemaining: number; shouldProcess: boolean }>(
  '/api/turn-status',
  async (_req, res): Promise<void> => {
    try {
      const timeUntilNext = await TurnScheduler.getTimeUntilNextTurn();
      const minutesRemaining = Math.ceil(timeUntilNext / (1000 * 60));
      const shouldProcess = await TurnScheduler.shouldProcessTurn();

      res.json({
        timeUntilNext,
        minutesRemaining,
        shouldProcess,
      });
    } catch (error) {
      console.error('Turn status error:', error);
      res.status(500).json({
        timeUntilNext: 0,
        minutesRemaining: 0,
        shouldProcess: false,
      });
    }
  }
);

router.post<{}, { success: boolean; message: string; forced?: boolean }>(
  '/api/force-turn',
  async (_req, res): Promise<void> => {
    try {
      // Force process turn regardless of timer (for debugging)
      const results = await GameLogic.processTurn();
      await TurnScheduler.markTurnProcessed();

      res.json({
        success: true,
        message: `Turn force-processed with ${results.length} faction actions`,
        forced: true,
      });
    } catch (error) {
      console.error('Force turn error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to force process turn',
      });
    }
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
