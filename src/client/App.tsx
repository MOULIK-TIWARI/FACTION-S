import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { FactionSelection } from './components/FactionSelection';
import { VotingPanel } from './components/VotingPanel';
import { Leaderboard } from './components/Leaderboard';
import { TurnSummary } from './components/TurnSummary';
import { AdminPanel } from './components/AdminPanel';
import { TurnTimer } from './components/TurnTimer';
import { FactionHeader } from './components/FactionHeader';

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
    checkAndProcessTurn,
    clearError,
  } = useGame();

  const [showAdmin, setShowAdmin] = useState(false);


  // Auto-refresh game state every 15 seconds and check for turn processing
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!loading) {
        // First check if a turn should be processed
        const turnProcessed = await checkAndProcessTurn();
        
        // Always refresh game state (either after turn processing or for regular updates)
        if (!turnProcessed) {
          refreshGameState();
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loading, refreshGameState, checkAndProcessTurn]);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Reddit Factions: The Great Subreddit War
          </h1>
          <p className="text-gray-600 text-sm">
            Hundreds of Redditors. Four Factions. One Epic Battle.
          </p>
        </div>
      </div>

      {/* Faction Header Bar */}
      <FactionHeader gameState={gameState} currentTurn={gameState.currentTurn} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Battle Updates */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Latest Battle Update:</h3>
              <TurnSummary
                results={gameState.lastTurnResults}
                currentTurn={gameState.currentTurn}
                compact={true}
              />
            </div>

            {/* Voting Section */}
            {!playerFaction ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <FactionSelection onJoinFaction={joinFaction} loading={loading} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-4">
                  Daily Faction Orders - Round {gameState.currentTurn}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Vote for your team's action below! (Your faction: {playerFaction})
                </p>
                <VotingPanel
                  playerFaction={playerFaction}
                  hasVoted={hasVoted}
                  onSubmitVote={submitVote}
                  loading={loading}
                  compact={true}
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Comments</h3>
              
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-sm">
                      <span className="font-medium text-blue-600">u/Player123:</span>
                      <span className="text-gray-700 ml-2">This cool! Voted attack!</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">u/DevvitMod:</span>
                      <span className="text-gray-700 ml-2">Reminder: One vote per player! Attack day. Choose wisely!</span>
                    </div>
                  </div>
                </div>

                {username && (
                  <div className="pt-2">
                    <div className="flex items-start gap-3">
                      <div className="text-sm">
                        <span className="font-medium text-orange-600">u/{username}:</span>
                        <span className="text-gray-700 ml-2">
                          {playerFaction ? `Fighting for ${playerFaction}! 🎯` : 'Still choosing my faction...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-4">
            {/* Turn Timer */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <TurnTimer 
                currentTurn={gameState.currentTurn} 
                onTurnProcessed={refreshGameState}
                compact={true}
              />
            </div>

            {/* Rankings */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <Leaderboard gameState={gameState} playerFaction={playerFaction} compact={true} />
            </div>

            {/* Game Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">Game Info</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>👥 {Object.keys(gameState.players).length} total players</p>
                <p className={`${loading ? 'text-orange-600' : 'text-green-600'}`}>
                  {loading ? '🔄 Updating...' : '✅ Connected'}
                </p>
                <button 
                  onClick={refreshGameState}
                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  Full Game Rules & FAQ
                </button>
              </div>
            </div>

            {/* Admin Panel */}
            {showAdmin && (
              <AdminPanel 
                onRestartGame={restartGame} 
                onForceTurn={refreshGameState}
                loading={loading}
                compact={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
