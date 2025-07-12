
import React, { useState } from 'react';
import { MessageCircle, Flag, Edit, Trash2, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  author: { name: string; avatar?: string };
  timestamp: string;
  isOwn: boolean;
}

interface CommentSectionProps {
  answerId: string;
  initialComments?: Comment[];
  isLoggedIn?: boolean;
}

// Simple profanity filter
const profanityWords = ['damn', 'hell', 'stupid', 'idiot', 'crap']; // Add more as needed

const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
};

const CommentSection: React.FC<CommentSectionProps> = ({ 
  answerId, 
  initialComments = [], 
  isLoggedIn = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    // Check for profanity
    if (containsProfanity(newComment)) {
      toast({
        title: "Inappropriate Content",
        description: "Your comment contains inappropriate language. Please edit and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: { name: 'Current User' },
        timestamp: 'just now',
        isOwn: true
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully."
      });
    }, 500);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    toast({
      title: "Comment deleted",
      description: "Your comment has been removed."
    });
  };

  const handleFlagComment = (commentId: string) => {
    toast({
      title: "Comment flagged",
      description: "This comment has been reported for review."
    });
  };

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-gray-600 hover:text-stackit-blue transition-colors"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Button>

      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              No comments yet. Be the first to reply!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment, index) => (
                <Card key={comment.id} className="border-l-2 border-l-stackit-blue-light" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{comment.author.name}</span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{comment.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {comment.isOwn && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-stackit-blue"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagComment(comment.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-orange-500"
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isLoggedIn ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none focus:ring-2 focus:ring-stackit-blue"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-stackit-blue hover:bg-stackit-blue-dark"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">Login to post your comment</p>
              <Button variant="outline" className="border-stackit-blue text-stackit-blue hover:bg-stackit-blue-light">
                Login
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
