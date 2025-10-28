interface AdminPanelProps {
  onRestartGame: () => void;
  loading: boolean;
}

export const AdminPanel = ({ onRestartGame, loading }: AdminPanelProps) => {
  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the game? This will reset all faction stats and player data.')) {
      onRestartGame();
    }
  };

  return (
    <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-lg font-bold text-red-800 mb-2">
        🛠️ Moderator Controls
      </h3>
      
      <p className="text-sm text-red-600 mb-4">
        Only moderators can see and use these controls.
      </p>
      
      <button
        onClick={handleRestart}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {loading ? 'Restarting...' : 'Restart Game'}
      </button>
      
      <p className="text-xs text-red-500 mt-2">
        This will reset all faction HP, scores, and player memberships.
      </p>
    </div>
  );
};
