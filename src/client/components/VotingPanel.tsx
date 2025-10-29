import { useState } from 'react';
import { FactionType, ActionType } from '../../shared/types/api';

interface VotingPanelProps {
  playerFaction: FactionType;
  hasVoted: boolean;
  onSubmitVote: (action: ActionType, target?: FactionType) => void;
  loading: boolean;
  compact?: boolean;
}

const FACTIONS: FactionType[] = ['Fire', 'Water', 'Earth', 'Air'];

const FACTION_COLORS = {
  Fire: 'text-red-500',
  Water: 'text-blue-500',
  Earth: 'text-green-500',
  Air: 'text-gray-500',
};

export const VotingPanel = ({ playerFaction, hasVoted, onSubmitVote, loading, compact = false }: VotingPanelProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>('Defend');
  const [selectedTarget, setSelectedTarget] = useState<FactionType | undefined>();

  const availableTargets = FACTIONS.filter(f => f !== playerFaction);

  const handleSubmit = () => {
    if (selectedAction === 'Attack' && !selectedTarget) {
      alert('Please select a target for your attack!');
      return;
    }
    onSubmitVote(selectedAction, selectedTarget);
  };

  if (hasVoted) {
    return (
      <div className={`text-center ${compact ? 'p-4' : 'p-6'}`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className={`font-bold text-green-800 mb-2 ${compact ? 'text-lg' : 'text-2xl'}`}>
            ✅ Vote Submitted!
          </h3>
          <p className="text-green-700 text-sm">
            You have voted this turn. Wait for turn processing.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Action Buttons - Matching the image design */}
        <div className="grid grid-cols-4 gap-3">
          {/* Attack Button */}
          <button
            onClick={() => setSelectedAction('Attack')}
            className={`p-4 rounded-lg transition-all ${
              selectedAction === 'Attack' 
                ? 'bg-gray-700 text-white border-2 border-gray-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-sm font-bold">Attack</div>
              <div className="text-xs text-gray-300">Vote count: 58</div>
            </div>
          </button>

          {/* Defend Button */}
          <button
            onClick={() => setSelectedAction('Defend')}
            className={`p-4 rounded-lg transition-all ${
              selectedAction === 'Defend' 
                ? 'bg-gray-700 text-white border-2 border-gray-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-sm font-bold">Defend</div>
              <div className="text-xs text-gray-300">Vote count: 124</div>
            </div>
          </button>

          {/* Heal Button */}
          <button
            onClick={() => setSelectedAction('Train')}
            className={`p-4 rounded-lg transition-all ${
              selectedAction === 'Train' 
                ? 'bg-gray-700 text-white border-2 border-gray-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🩹</div>
              <div className="text-sm font-bold">Heal</div>
              <div className="text-xs text-gray-300">Vote count: 36</div>
            </div>
          </button>

          {/* Train Button - Highlighted as selected */}
          <button
            onClick={() => setSelectedAction('Train')}
            className="p-4 rounded-lg bg-teal-500 text-white border-2 border-teal-400 relative"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">💪</div>
              <div className="text-sm font-bold">Train</div>
              <div className="text-xs text-teal-100">Vote count: 87</div>
            </div>
            {/* Checkmark for selected */}
            <div className="absolute top-1 right-1 text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        {/* Target Selection for Attack */}
        {selectedAction === 'Attack' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Target:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTargets.map(faction => (
                <button
                  key={faction}
                  onClick={() => setSelectedTarget(faction)}
                  className={`p-2 rounded border-2 transition-all ${
                    selectedTarget === faction
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium">{faction}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || (selectedAction === 'Attack' && !selectedTarget)}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Submitting...' : `Vote ${selectedAction}${selectedTarget ? ` on ${selectedTarget}` : ''}`}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cast Your Vote</h2>
        <p className="text-gray-600 mb-2">
          Faction: <span className={`font-bold ${FACTION_COLORS[playerFaction]}`}>
            {playerFaction}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          Choose your faction's action for this turn
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Action Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action
          </label>
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value as ActionType);
              if (e.target.value !== 'Attack') {
                setSelectedTarget(undefined);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Attack">⚔️ Attack - Deal damage to another faction</option>
            <option value="Defend">🛡️ Defend - Reduce incoming damage</option>
            <option value="Train">💪 Train - Gain score points</option>
          </select>
        </div>

        {/* Target Selection (only for Attack) */}
        {selectedAction === 'Attack' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Faction
            </label>
            <select
              value={selectedTarget || ''}
              onChange={(e) => setSelectedTarget(e.target.value as FactionType)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a target...</option>
              {availableTargets.map(faction => (
                <option key={faction} value={faction}>
                  {faction}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Descriptions */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h4 className="font-medium text-gray-900 mb-2">Action Effects:</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• <strong>Attack:</strong> Deal 20 damage (5 if target defends)</li>
            <li>• <strong>Defend:</strong> Reduce incoming damage to 5</li>
            <li>• <strong>Train:</strong> Gain 10 score points (vulnerable to attacks)</li>
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || (selectedAction === 'Attack' && !selectedTarget)}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </button>
      </div>
    </div>
  );
};
