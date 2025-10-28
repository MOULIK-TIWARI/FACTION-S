import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { FactionSelection } from './components/FactionSelection';
import { VotingPanel } from './components/VotingPanel';
import { Leaderboard } from './components/Leaderboard';
import { TurnSummary } from './components/TurnSummary';
import { AdminPanel } from './components/AdminPanel';
import { TurnTimer } from './components/TurnTimer';

export const App = () => {
  const {
    gameState,
    username,
    playerFaction,
    hasVoted,
    loading,
    error,
    joinFaction,
    submitVote,
    restartGame,
    refreshGameState,
    clearError,
  } = useGame();

  const [showAdmin, setShowAdmin] = useState(false);

  // Auto-refresh game state every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        refreshGameState();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshGameState]);

  // Check if user might be a moderator (simple heuristic)
  useEffect(() => {
    // Show admin panel if username suggests moderator status
    // In a real app, this would be determined server-side
    if (username && (username.includes('mod') || username.includes('admin'))) {
      setShowAdmin(true);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Reddit Factions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Game state not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚔️ Reddit Factions</h1>
          {username && (
            <p className="text-lg text-gray-600">
              Welcome, <span className="font-semibold">{username}</span>!
            </p>
          )}
        </div>

        <div className="space-y-8">
          {/* Main Game Area */}
          {!playerFaction ? (
            <div className="flex justify-center">
              <FactionSelection onJoinFaction={joinFaction} loading={loading} />
            </div>
          ) : (
            <div className="flex justify-center">
              <VotingPanel
                playerFaction={playerFaction}
                hasVoted={hasVoted}
                onSubmitVote={submitVote}
                loading={loading}
              />
            </div>
          )}

          {/* Turn Timer */}
          <div className="flex justify-center">
            <TurnTimer currentTurn={gameState.currentTurn} />
          </div>

          {/* Leaderboard */}
          <div className="flex justify-center">
            <Leaderboard gameState={gameState} playerFaction={playerFaction} />
          </div>

          {/* Turn Summary */}
          <div className="flex justify-center">
            <TurnSummary
              results={gameState.lastTurnResults}
              currentTurn={gameState.currentTurn}
            />
          </div>

          {/* Admin Panel (conditionally shown) */}
          {showAdmin && (
            <div className="flex justify-center">
              <AdminPanel onRestartGame={restartGame} loading={loading} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={refreshGameState}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Game State'}
            </button>
            
            {showAdmin && (
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/process-turn', { method: 'POST' });
                    const data = await res.json();
                    alert(data.message);
                    if (data.processed) {
                      refreshGameState();
                    }
                  } catch (error) {
                    alert('Failed to process turn');
                  }
                }}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
              >
                ⚡ Process Turn (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            A Reddit Devvit game • Turn {gameState.currentTurn} • 
            {Object.keys(gameState.players).length} total players
          </p>
        </footer>
      </div>
    </div>
  );
};
