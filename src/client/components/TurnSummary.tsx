import { TurnResult } from '../../shared/types/api';

interface TurnSummaryProps {
  results: TurnResult[];
  currentTurn: number;
  compact?: boolean;
}

const FACTION_COLORS = {
  Fire: 'text-red-600',
  Water: 'text-blue-600',
  Earth: 'text-green-600',
  Air: 'text-gray-600',
};

const FACTION_EMOJIS = {
  Fire: '🔥',
  Water: '💧',
  Earth: '🌍',
  Air: '💨',
};

export const TurnSummary = ({ results, currentTurn, compact = false }: TurnSummaryProps) => {
  if (results.length === 0) {
    if (compact) {
      return (
        <div className="text-gray-600 text-sm">
          🔥 Fire attacked 🌍 Earth!<br/>
          🔥 Fire attacked 🌍 Earth defended successfully! 🔥 Earth.<br/>
          💧 Water trained, increasing their resolve by 10 HP.
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-2xl bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Previous Turn Results</h3>
        <p className="text-gray-600 text-center py-4">
          No previous turn results yet. The battle is about to begin!
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="text-sm text-gray-700 space-y-1">
        {results.length > 0 ? (
          // Show actual results
          results.slice(0, 3).map((result, index) => (
            <div key={index} className="flex items-start gap-1">
              <span className="text-base">{FACTION_EMOJIS[result.faction]}</span>
              <span>{result.result}</span>
            </div>
          ))
        ) : (
          // Show sample battle updates when no results
          <>
            <div className="flex items-start gap-1">
              <span className="text-base">🔥</span>
              <span>Fire attacked 🌍 Earth!</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-base">🔥</span>
              <span>Fire attacked 🌍 Earth defended successfully! 🔥 Earth.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-base">💧</span>
              <span>Water trained, increasing their resolve by 10 points.</span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        Turn {currentTurn - 1} Results
      </h3>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">
                {FACTION_EMOJIS[result.faction]}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${FACTION_COLORS[result.faction]}`}>
                    {result.faction}
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {result.action}
                    {result.target && ` → ${result.target}`}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed">
                  {result.result}
                </p>
                
                {(result.damage || result.scoreGain) && (
                  <div className="flex gap-4 mt-2 text-xs">
                    {result.damage && (
                      <span className="text-red-600 font-medium">
                        -{result.damage} HP
                      </span>
                    )}
                    {result.scoreGain && (
                      <span className="text-green-600 font-medium">
                        +{result.scoreGain} Score
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Turn processing happens automatically. Vote for the next turn!
        </p>
      </div>
    </div>
  );
};
