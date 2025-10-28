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
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reddit Factions</h1>
        <p className="text-lg text-gray-600 mb-6">
          Choose your faction and join the battle!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {(Object.entries(FACTION_INFO) as [FactionType, typeof FACTION_INFO[FactionType]][]).map(
          ([faction, info]) => (
            <button
              key={faction}
              onClick={() => onJoinFaction(faction)}
              disabled={loading}
              className={`
                ${info.color} text-white p-6 rounded-lg shadow-lg
                transition-all duration-200 transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex flex-col items-center gap-3
              `}
            >
              <div className="text-4xl">{info.emoji}</div>
              <div className="text-xl font-bold">{faction}</div>
              <div className="text-sm text-center opacity-90">{info.description}</div>
            </button>
          )
        )}
      </div>

      <div className="text-center text-sm text-gray-500 max-w-md">
        Once you join a faction, you cannot change. Choose wisely!
      </div>
    </div>
  );
};
