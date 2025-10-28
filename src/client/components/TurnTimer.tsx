import { useEffect, useState } from 'react';

interface TurnTimerProps {
  currentTurn: number;
}

export const TurnTimer = ({ currentTurn }: TurnTimerProps) => {
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnStatus = async () => {
      try {
        const res = await fetch('/api/turn-status');
        if (res.ok) {
          const data = await res.json();
          setTimeUntilNext(data.timeUntilNext);
        }
      } catch (error) {
        console.error('Failed to fetch turn status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnStatus();
    
    // Update every minute
    const interval = setInterval(fetchTurnStatus, 60000);
    return () => clearInterval(interval);
  }, [currentTurn]);

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

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <h4 className="font-bold text-blue-800 mb-2">⏰ Turn {currentTurn}</h4>
      <p className="text-blue-600">
        {timeUntilNext <= 0 ? (
          <span className="font-bold text-green-600">Ready for next turn processing!</span>
        ) : (
          <>Next turn in: <span className="font-mono font-bold">{formatTime(timeUntilNext)}</span></>
        )}
      </p>
      <p className="text-xs text-blue-500 mt-2">
        Turns process automatically every 24 hours
      </p>
    </div>
  );
};
