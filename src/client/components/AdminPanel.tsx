interface AdminPanelProps {
  onRestartGame: () => void;
  onForceTurn: () => void;
  loading: boolean;
  compact?: boolean;
}

export const AdminPanel = ({ onRestartGame, onForceTurn, loading, compact = false }: AdminPanelProps) => {
  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the game? This will reset all faction stats and player data.')) {
      onRestartGame();
    }
  };

  if (compact) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <h4 className="font-bold text-red-800 mb-2 text-sm">🛠️ Admin</h4>
        <div className="space-y-2">
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/force-turn', { method: 'POST' });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                  onForceTurn();
                }
              } catch (error) {
                alert('Failed to force turn processing');
              }
            }}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-xs py-1 px-2 rounded"
          >
            ⚡ Force Turn
          </button>
          <button
            onClick={handleRestart}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-xs py-1 px-2 rounded"
          >
            🔄 Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-lg font-bold text-red-800 mb-2">
        🛠️ Moderator Controls
      </h3>
      
      <p className="text-sm text-red-600 mb-4">
        Only moderators can see and use these controls.
      </p>
      
      <div className="space-y-3">
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/force-turn', { method: 'POST' });
              const data = await res.json();
              alert(data.message);
              if (data.success) {
                onForceTurn();
              }
            } catch (error) {
              alert('Failed to force turn processing');
            }
          }}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Processing...' : '⚡ Force Process Turn'}
        </button>

        <button
          onClick={handleRestart}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Restarting...' : '🔄 Restart Game'}
        </button>
      </div>
      
      <div className="text-xs text-red-500 mt-2 space-y-1">
        <p>• Force Turn: Immediately processes the current turn</p>
        <p>• Restart: Resets all faction HP, scores, and player data</p>
      </div>
    </div>
  );
};
