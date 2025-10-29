import { GameState } from '../../shared/types/api';

interface FactionHeaderProps {
  gameState: GameState;
  currentTurn: number;
}

export const FactionHeader = ({ gameState, currentTurn }: FactionHeaderProps) => {
  return (
    <div className="bg-gray-800 text-white px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Faction HP Display */}
          <div className="flex items-center space-x-8">
            {/* Fire */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔥</span>
              <span className="text-white font-medium">Fire:</span>
              <span className="text-white font-bold">{gameState.factions.Fire.hp} HP</span>
            </div>

            {/* Water */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">💧</span>
              <span className="text-blue-300 font-medium">Water</span>
              <span className="text-white font-bold">{gameState.factions.Water.hp} HP</span>
            </div>

            {/* Earth */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌍</span>
              <span className="text-green-300 font-medium">Earth:</span>
              <span className="text-white font-bold">{gameState.factions.Earth.hp} HP</span>
            </div>

            {/* Air */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">💨</span>
              <span className="text-gray-300 font-medium">Air:</span>
              <span className="text-white font-bold">{gameState.factions.Air.hp} HP</span>
            </div>
          </div>

          {/* Round Info */}
          <div className="text-right">
            <div className="text-sm text-white font-medium">Round {currentTurn} / Day 1: Vote now!</div>
            {/* <div className="text-xs text-gray-400">(Ends in 1m 34s)</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
