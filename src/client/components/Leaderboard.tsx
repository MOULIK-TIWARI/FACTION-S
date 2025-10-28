import { GameState, FactionType } from '../../shared/types/api';

interface LeaderboardProps {
  gameState: GameState;
  playerFaction?: FactionType | undefined;
}

const FACTION_COLORS = {
  Fire: 'bg-red-100 border-red-300 text-red-800',
  Water: 'bg-blue-100 border-blue-300 text-blue-800',
  Earth: 'bg-green-100 border-green-300 text-green-800',
  Air: 'bg-gray-100 border-gray-300 text-gray-800',
};

const FACTION_EMOJIS = {
  Fire: '🔥',
  Water: '💧',
  Earth: '🌍',
  Air: '💨',
};

export const Leaderboard = ({ gameState, playerFaction }: LeaderboardProps) => {
  const factionEntries = Object.entries(gameState.factions) as [FactionType, typeof gameState.factions[FactionType]][];
  
  // Sort by score (descending), then by HP (descending)
  const sortedFactions = factionEntries.sort(([, a], [, b]) => {
    if (a.score !== b.score) return b.score - a.score;
    return b.hp - a.hp;
  });

  const getPlayerCount = (faction: FactionType): number => {
    return Object.values(gameState.players).filter(p => p.faction === faction).length;
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Faction Standings</h3>
        <p className="text-sm text-gray-600">Turn {gameState.currentTurn}</p>
      </div>

      <div className="space-y-3">
        {sortedFactions.map(([faction, stats], index) => {
          const isPlayerFaction = faction === playerFaction;
          const playerCount = getPlayerCount(faction);
          
          return (
            <div
              key={faction}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${isPlayerFaction ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                ${FACTION_COLORS[faction]}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{FACTION_EMOJIS[faction]}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{faction}</span>
                      {isPlayerFaction && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          YOUR FACTION
                        </span>
                      )}
                    </div>
                    <div className="text-sm opacity-75">
                      {playerCount} player{playerCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {stats.score} pts
                  </div>
                  <div className="text-sm">
                    {stats.hp}/100 HP
                  </div>
                </div>
              </div>
              
              {/* HP Bar */}
              <div className="mt-3">
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, stats.hp)}%` }}
                  />
                </div>
              </div>
              
              {index === 0 && stats.score > 0 && (
                <div className="mt-2 text-center">
                  <span className="text-xs bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full font-medium">
                    👑 LEADING
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
