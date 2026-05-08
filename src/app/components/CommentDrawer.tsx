import { useState, useEffect } from "react";
import { X, Send, Heart, MoreVertical, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
    level?: string;
  };
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  commentCount: number;
}

export function CommentDrawer({ isOpen, onClose, postId, commentCount }: CommentDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Mock comments data
  useEffect(() => {
    if (isOpen) {
      setComments([
        {
          id: 1,
          user: {
            name: "Alex Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
            level: "V4",
          },
          content: "Awesome progress! That route looks challenging 🔥",
          time: "2h ago",
          likes: 12,
          isLiked: false,
        },
        {
          id: 2,
          user: {
            name: "Sarah Kim",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            level: "V3",
          },
          content: "Great technique on that crimp! Any tips for beginners?",
          time: "1h ago",
          likes: 8,
          isLiked: true,
        },
        {
          id: 3,
          user: {
            name: "Mike Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
            level: "V5",
          },
          content: "I've been trying this route for weeks. Congrats! 💪",
          time: "45m ago",
          likes: 5,
          isLiked: false,
        },
        {
          id: 4,
          user: {
            name: "Emma Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
            level: "V2",
          },
          content: "This is so inspiring! Can't wait to try it this weekend 😊",
          time: "30m ago",
          likes: 3,
          isLiked: false,
        },
      ]);
    }
  }, [isOpen, postId]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          name: "You",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
          level: "V3",
        },
        content: newComment,
        time: "Just now",
        likes: 0,
        isLiked: false,
      };
      setComments([comment, ...comments]);
      setNewComment("");
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Comments</h2>
            <span className="text-sm text-gray-500">({commentCount})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No comments yet</p>
              <p className="text-gray-400 text-xs mt-1">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <ImageWithFallback
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-9 h-9 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {comment.user.name}
                      </span>
                      {comment.user.level && (
                        <span className="px-2 py-0.5 bg-[#d4e7c5] text-[#5a8a3f] text-xs rounded-full">
                          {comment.user.level}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#7eb662] transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            comment.isLiked
                              ? "fill-[#7eb662] text-[#7eb662]"
                              : ""
                          }`}
                        />
                        <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-xs text-gray-500 hover:text-[#7eb662] transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 px-4 py-3 bg-white">
          {replyingTo && (
            <div className="flex items-center justify-between mb-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">
                Replying to{" "}
                <span className="font-medium">
                  {comments.find((c) => c.id === replyingTo)?.user.name}
                </span>
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=you"
              alt="Your avatar"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  newComment.trim()
                    ? "bg-[#7eb662] text-white hover:bg-[#6a9b54]"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}