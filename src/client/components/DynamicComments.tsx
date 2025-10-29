import { useState, useEffect } from 'react';
import { Comment, FactionType } from '../../shared/types/api';

interface DynamicCommentsProps {
  onAddComment: (message: string) => Promise<boolean>;
  onGetComments: () => Promise<Comment[]>;
  username?: string | null;
  playerFaction?: FactionType | undefined;
}

const FACTION_COLORS = {
  Fire: 'text-red-600',
  Water: 'text-blue-600',
  Earth: 'text-green-600',
  Air: 'text-gray-600',
};

export const DynamicComments = ({ onAddComment, onGetComments, username, playerFaction }: DynamicCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Load comments on mount and refresh every 30 seconds
  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await onGetComments();
      setComments(fetchedComments);
    };

    loadComments();
    const interval = setInterval(loadComments, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [onGetComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    const success = await onAddComment(newComment.trim());
    
    if (success) {
      setNewComment('');
      // Refresh comments immediately after adding
      const updatedComments = await onGetComments();
      setComments(updatedComments);
    } else {
      alert('Failed to add comment. Please try again.');
    }
    
    setLoading(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
      <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Live Comments</h3>
      
      {/* Comment Input */}
      {username && (
        <form onSubmit={handleSubmit} className="mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              maxLength={200}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {newComment.length}/200 characters
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.slice().reverse().map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-2 sm:pb-3 last:border-b-0">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-sm flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <span 
                      className={`font-medium text-xs sm:text-sm ${
                        comment.faction ? FACTION_COLORS[comment.faction] : 'text-gray-600'
                      }`}
                    >
                      u/{comment.username}
                    </span>
                    <div className="flex items-center gap-2">
                      {comment.faction && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {comment.faction}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                    {comment.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 sm:mt-3 text-xs text-gray-500 text-center">
        Comments refresh automatically every 30 seconds
      </div>
    </div>
  );
};
