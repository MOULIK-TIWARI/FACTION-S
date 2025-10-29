import { useEffect, useState } from 'react';

interface TurnTimerProps {
  currentTurn: number;
  onTurnProcessed?: () => void;
  compact?: boolean;
}

export const TurnTimer = ({ currentTurn, onTurnProcessed, compact = false }: TurnTimerProps) => {
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastCheckedTurn, setLastCheckedTurn] = useState<number>(currentTurn);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchTurnStatus = async () => {
      try {
        const res = await fetch('/api/turn-status');
        if (res.ok) {
          const data = await res.json();
          setTimeUntilNext(data.timeUntilNext);
          
          // If timer shows ready and we haven't checked this turn yet, try to process
          if (data.timeUntilNext <= 0 && lastCheckedTurn === currentTurn) {
            setIsProcessing(true);
            try {
              const processRes = await fetch('/api/process-turn', { method: 'POST' });
              if (processRes.ok) {
                const processData = await processRes.json();
                if (processData.processed && onTurnProcessed) {
                  setLastCheckedTurn(currentTurn + 1);
                  onTurnProcessed();
                }
              }
            } finally {
              setIsProcessing(false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch turn status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnStatus();

    // Update every 5 seconds for faster feedback
    const interval = setInterval(fetchTurnStatus, 5000);
    return () => clearInterval(interval);
  }, [currentTurn, lastCheckedTurn, onTurnProcessed]);

  // Update countdown every second
  useEffect(() => {
    if (timeUntilNext <= 0) return;

    const interval = setInterval(() => {
      setTimeUntilNext(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeUntilNext]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-600">Loading turn information...</p>
      </div>
    );
  }

  const formatTime = (ms: number): string => {
    if (ms <= 0) return 'Ready for next turn!';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (compact) {
    return (
      <div className="text-center">
        <h4 className="font-bold text-blue-800 mb-2">⏰ Round {currentTurn}</h4>
        <div className="text-sm text-blue-600">
          {isProcessing ? (
            <span className="font-bold text-orange-600 flex items-center justify-center gap-1">
              <span className="animate-spin">⚡</span>
              Processing...
            </span>
          ) : timeUntilNext <= 0 ? (
            <span className="font-bold text-green-600">Ready!</span>
          ) : (
            <div>
              <div className="font-mono font-bold">{formatTime(timeUntilNext)}</div>
              <div className="text-xs text-gray-500">until next turn</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <h4 className="font-bold text-blue-800 mb-2">⏰ Turn {currentTurn}</h4>
      <p className="text-blue-600">
        {isProcessing ? (
          <span className="font-bold text-orange-600 flex items-center justify-center gap-2">
            <span className="animate-spin">⚡</span>
            Processing turn...
          </span>
        ) : timeUntilNext <= 0 ? (
          <span className="font-bold text-green-600">Ready for next turn processing!</span>
        ) : (
          <>Next turn in: <span className="font-mono font-bold">{formatTime(timeUntilNext)}</span></>
        )}
      </p>
      <p className="text-xs text-blue-500 mt-2">
        Turns process automatically every 2 minutes
      </p>
      {timeUntilNext <= 5000 && timeUntilNext > 0 && (
        <p className="text-xs text-orange-600 mt-1 font-medium">
          🔥 Turn processing soon!
        </p>
      )}
    </div>
  );
};
