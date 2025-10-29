import { GameState } from '../../shared/types/api';

interface FactionHeaderProps {
  gameState: GameState;
  currentTurn: number;
}

export const FactionHeader = ({ gameState, currentTurn }: FactionHeaderProps) => {
  return (
    <div className="bg-gray-800 text-white px-2 sm:px-4 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Faction HP Display */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 lg:gap-8">
            {/* Fire */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-xl">🔥</span>
              <span className="text-white font-medium text-xs sm:text-sm">Fire:</span>
              <span className="text-white font-bold text-xs sm:text-sm">{gameState.factions.Fire.hp} HP</span>
            </div>

            {/* Water */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-xl">💧</span>
              <span className="text-blue-300 font-medium text-xs sm:text-sm">Water:</span>
              <span className="text-white font-bold text-xs sm:text-sm">{gameState.factions.Water.hp} HP</span>
            </div>

            {/* Earth */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-xl">🌍</span>
              <span className="text-green-300 font-medium text-xs sm:text-sm">Earth:</span>
              <span className="text-white font-bold text-xs sm:text-sm">{gameState.factions.Earth.hp} HP</span>
            </div>

            {/* Air */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-xl">💨</span>
              <span className="text-gray-300 font-medium text-xs sm:text-sm">Air:</span>
              <span className="text-white font-bold text-xs sm:text-sm">{gameState.factions.Air.hp} HP</span>
            </div>
          </div>

          {/* Round Info */}
          <div className="text-center sm:text-right">
            <div className="text-xs sm:text-sm text-white font-medium">Round {currentTurn} / Day 1: Vote now!</div>
            <div className="text-xs text-gray-400">(Ends in 30s)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
