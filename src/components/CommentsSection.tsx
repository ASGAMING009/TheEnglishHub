import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  comment_text: string;
  created_at: string;
}

interface CommentsSectionProps {
  activityId: string;
}

export default function CommentsSection({ activityId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    loadComments();
  }, [activityId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_comments')
        .select('id, comment_text, created_at')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('activity_comments')
        .insert({
          activity_id: activityId,
          comment_text: newComment.trim(),
        });

      if (error) throw error;
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{comments.length} Comments</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p className="text-slate-600 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded p-3">
                  <p className="text-slate-800 text-sm break-words">{comment.comment_text}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              maxLength={200}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
