import { useState } from 'react';
import { FactionType, ActionType } from '../../shared/types/api';

interface VotingPanelProps {
  playerFaction: FactionType;
  hasVoted: boolean;
  onSubmitVote: (action: ActionType, target?: FactionType) => void;
  loading: boolean;
}

const FACTIONS: FactionType[] = ['Fire', 'Water', 'Earth', 'Air'];

const FACTION_COLORS = {
  Fire: 'text-red-500',
  Water: 'text-blue-500',
  Earth: 'text-green-500',
  Air: 'text-gray-500',
};

export const VotingPanel = ({ playerFaction, hasVoted, onSubmitVote, loading }: VotingPanelProps) => {
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
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted!</h2>
          <p className="text-gray-600">
            You have already voted this turn. Wait for the next turn to vote again.
          </p>
        </div>
        <div className="text-lg">
          Your faction: <span className={`font-bold ${FACTION_COLORS[playerFaction]}`}>
            {playerFaction}
          </span>
        </div>
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
