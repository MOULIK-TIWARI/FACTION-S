import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { FactionSelection } from './components/FactionSelection';
import { VotingPanel } from './components/VotingPanel';
import { Leaderboard } from './components/Leaderboard';
import { TurnSummary } from './components/TurnSummary';

import { TurnTimer } from './components/TurnTimer';
import { FactionHeader } from './components/FactionHeader';
import { DynamicComments } from './components/DynamicComments';

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
    addComment,
    getComments,
    clearError,
  } = useGame();

  const [showAdmin, setShowAdmin] = useState(false);


  // Auto-refresh game state every 30 seconds and check for turn processing
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
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshGameState, checkAndProcessTurn]);

  // Check if user might be a moderator (simple heuristic)
  useEffect(() => {
    // Show admin panel if username suggests moderator status
    // In a real app, this would be determined server-side
    // For now, show to all users for testing
    if (username) {
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Reddit Factions: The Great Subreddit War
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Hundreds of Redditors. Four Factions. One Epic Battle.
              </p>
            </div>
            
            {/* Quick Restart Button */}
            {/* <button
              onClick={async () => {
                if (window.confirm('🔄 Quick Restart Game?\n\nThis will reset everything and start a new 50-round battle!')) {
                  try {
                    await restartGame();
                    alert('🎉 New game started!');
                  } catch (error) {
                    alert('❌ Restart failed. Try again.');
                  }
                }
              }}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md text-sm sm:text-base w-full sm:w-auto"
            >
              {loading ? '🔄 Restarting...' : '🔄 New Game'}
            </button> */}
          </div>
        </div>
      </div>

      {/* Faction Header Bar */}
      <FactionHeader gameState={gameState} currentTurn={gameState.currentTurn} />

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Game Ended Message */}
        {!gameState.gameActive && (
          <div className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-2">🏆 Game Completed!</h2>
            <p className="text-yellow-700 mb-4 text-sm sm:text-base">
              The battle has ended after 50 rounds! Here are the final standings:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {Object.entries(gameState.factions)
                .sort(([,a], [,b]) => b.score - a.score || b.hp - a.hp)
                .map(([faction, stats], index) => (
                  <div key={faction} className="bg-white rounded-lg p-2 sm:p-3 border">
                    <div className="text-base sm:text-lg font-bold">#{index + 1}</div>
                    <div className="text-xs sm:text-sm">{faction}</div>
                    <div className="text-xs text-gray-600">{stats.score} pts • {stats.hp} HP</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Game Area - Left Side */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Battle Updates */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Latest Battle Update:</h3>
              <TurnSummary
                results={gameState.lastTurnResults}
                currentTurn={gameState.currentTurn}
                compact={true}
              />
            </div>

            {/* Voting Section */}
            {!playerFaction ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <FactionSelection onJoinFaction={joinFaction} loading={loading} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Daily Faction Orders - Round {gameState.currentTurn}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
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

            {/* Dynamic Comments Section */}
            <DynamicComments
              onAddComment={addComment}
              onGetComments={getComments}
              username={username}
              playerFaction={playerFaction}
            />

            {/* Main Restart Button - Always Visible */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-3 sm:p-4">
              <h3 className="font-bold text-red-800 mb-2 sm:mb-3 text-sm sm:text-base">🔄 Game Controls</h3>
              <p className="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4">
                Reset the entire game to start fresh with new rounds
              </p>
              {/* <button
                onClick={async () => {
                  console.log('Restart button clicked');
                  if (window.confirm('Are you sure you want to restart the game?\n\nThis will:\n• Reset turn counter to 1\n• Reset all faction HP to 100\n• Reset all faction scores to 0\n• Clear all player data\n• Clear all comments\n• Start a new 50-round game')) {
                    console.log('User confirmed restart');
                    try {
                      console.log('Calling restartGame function...');
                      const success = await restartGame();
                      console.log('RestartGame result:', success);
                      
                      if (success) {
                        alert('🎉 Game has been successfully restarted!\n\nNew 50-round battle begins now!');
                        // Force a page refresh to ensure clean state
                        window.location.reload();
                      } else {
                        alert('❌ Failed to restart game. Please check the console for errors.');
                      }
                    } catch (error) {
                      console.error('Restart error:', error);
                      alert('❌ Failed to restart game. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                    }
                  }
                }}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-colors shadow-lg"
              >
                {loading ? '🔄 Restarting Game...' : '🔄 Restart Game (New 50 Rounds)'}
              </button> */}
              {/* Test Button for Debugging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <button
                  onClick={async () => {
                    console.log('Test hook function');
                    try {
                      const result = await restartGame();
                      console.log('Hook function result:', result);
                      alert('Hook function result: ' + result);
                    } catch (error) {
                      console.error('Hook function error:', error);
                      alert('Hook function error: ' + error);
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
                >
                  🔧 RESTART GAME 
                </button>

                {/* <button
                  onClick={async () => {
                    console.log('Test direct API call');
                    try {
                      const response = await fetch('/api/restart-game', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                      });
                      console.log('Response status:', response.status);
                      const data = await response.json();
                      console.log('Response data:', data);
                      alert('Direct API result: ' + JSON.stringify(data));
                    } catch (error) {
                      console.error('Direct API error:', error);
                      alert('Direct API error: ' + error);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
                >
                  🧪 Test API
                </button> */}
              </div>

              {/* <div className="mt-3 text-xs text-red-500 bg-red-100 rounded p-2">
                <p className="font-medium mb-1">⚠️ This will completely reset:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                  <p>• Turn counter → 1</p>
                  <p>• All HP → 100</p>
                  <p>• All scores → 0</p>
                  <p>• All comments</p>
                  <p>• Player factions</p>
                  <p>• Vote history</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
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

            {/* Moderator Restart Button */}
            {/* {showAdmin && (
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <h4 className="font-bold text-red-800 mb-2 text-sm">🛠️ Moderator Controls</h4>
                <p className="text-xs text-red-600 mb-3">
                  Reset the game to starting conditions
                </p>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to restart the game? This will reset turn counter to 1, all faction HP to 100, all scores to 0, and clear all player data.')) {
                      try {
                        await restartGame();
                        alert('Game has been successfully restarted!');
                      } catch (error) {
                        alert('Failed to restart game. Please try again.');
                      }
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded text-sm transition-colors"
                >
                  {loading ? 'Restarting...' : '🔄 Restart Game'}
                </button>
                <div className="text-xs text-red-500 mt-2 space-y-1">
                  <p>• Resets turn counter to 1</p>
                  <p>• Resets all faction HP to 100</p>
                  <p>• Resets all faction scores to 0</p>
                  <p>• Clears all player data</p>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
