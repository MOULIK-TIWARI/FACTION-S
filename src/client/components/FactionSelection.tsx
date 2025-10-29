import { FactionType } from '../../shared/types/api';

interface FactionSelectionProps {
  onJoinFaction: (faction: FactionType) => void;
  loading: boolean;
}

const FACTION_INFO = {
  Fire: {
    color: 'bg-red-500 hover:bg-red-600',
    emoji: '🔥',
    description: 'Masters of destruction and raw power',
  },
  Water: {
    color: 'bg-blue-500 hover:bg-blue-600',
    emoji: '💧',
    description: 'Fluid and adaptable warriors',
  },
  Earth: {
    color: 'bg-green-500 hover:bg-green-600',
    emoji: '🌍',
    description: 'Steadfast defenders of the realm',
  },
  Air: {
    color: 'bg-gray-400 hover:bg-gray-500',
    emoji: '💨',
    description: 'Swift and unpredictable fighters',
  },
};

export const FactionSelection = ({ onJoinFaction, loading }: FactionSelectionProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Faction</h2>
      <p className="text-gray-600 mb-6">
        Join one of the four elemental factions and fight for supremacy!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(Object.entries(FACTION_INFO) as [FactionType, typeof FACTION_INFO[FactionType]][]).map(
          ([faction, info]) => (
            <button
              key={faction}
              onClick={() => onJoinFaction(faction)}
              disabled={loading}
              className={`
                ${info.color} text-white p-4 rounded-lg shadow-lg
                transition-all duration-200 transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex flex-col items-center gap-2
              `}
            >
              <div className="text-3xl">{info.emoji}</div>
              <div className="text-lg font-bold">{faction}</div>
              <div className="text-xs text-center opacity-90 leading-tight">{info.description}</div>
            </button>
          )
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Warning:</strong> Once you join a faction, you cannot change. Choose wisely!
        </p>
      </div>
    </div>
  );
};
