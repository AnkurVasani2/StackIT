import React, { useState } from 'react';
import {
  X, ThumbsUp, ThumbsDown, MessageCircle, Share2,
  Bookmark, Zap, Star, Clock, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommentSection from './CommentSection';
import AnswerSubmissionForm from './AnswerSubmissionForm';
import { Question } from '@/types/question';

interface QuestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  isOpen, onClose, question
}) => {
  const [activeTab, setActiveTab] = useState('answers');
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState(question?.answers || []);

  if (!isOpen || !question) return null;

  const voteCount = question.votes.likes - question.votes.dislikes;

  const handleAnswerSubmitted = (newAnswer: any) => {
    setAnswers(prev => [...prev, newAnswer]);
  };

  const mockSummary = "The main solutions involve using React hooks for state management, implementing proper error handling with try-catch blocks, and following TypeScript best practices for type safety.";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl animate-slide-in-right overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {question.title}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSummary(!showSummary)}
                  className="bg-stackit-blue text-white hover:bg-stackit-blue-dark"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {showSummary ? 'Hide' : 'Show'} Summary
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {showSummary && (
              <div className="bg-stackit-blue-light border-l-4 border-stackit-blue p-4 m-6 mt-0 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-stackit-blue mt-0.5" />
                  <div>
                    <h3 className="font-medium text-stackit-blue-dark mb-1">AI Summary</h3>
                    <p className="text-gray-700 text-sm">{mockSummary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              console.log("questions:", questions);

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-stackit-blue-light">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold text-gray-700">{voteCount}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4">{question.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map(tag => (
                        <Badge
                          key={tag.tag_id}
                          variant="secondary"
                          className="bg-stackit-blue-light text-stackit-blue-dark hover:bg-stackit-blue hover:text-white"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">{question.username}</span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="answers">
                    <MessageCircle className="h-4 w-4 mr-1" /> Answers ({answers.length})
                  </TabsTrigger>
                  <TabsTrigger value="summary">
                    <Zap className="h-4 w-4 mr-1" /> AI Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="answers" className="space-y-6">
                  {answers.map((answer, index) => {
                    const answerVotes = answer.votes.likes - answer.votes.dislikes;
                    return (
                      <Card key={answer.answer_id}>
                        <CardContent className="p-6">
                          <div className="flex space-x-4">
                            <div className="flex flex-col items-center space-y-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold text-gray-700">{answerVotes}</span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 mb-4">{answer.description}</p>
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-sm text-gray-600">{answer.username}</span>
                                </div>
                                <div className="flex items-center text-gray-500 space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-sm">{new Date(answer.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <CommentSection
  answerId={String(answer.answer_id)}
  initialComments={answer.comments.map((comment: any) => ({
    id: String(comment.comment_id),
    content: comment.content,
    author: {
      name: comment.username || 'Anonymous',
    },
    timestamp: new Date(comment.created_at).toLocaleString(),
    isOwn: false, // or derive this from session if available
  }))}
/>

                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  <AnswerSubmissionForm
                    questionId={String(question.question_id)}
                    onAnswerSubmitted={handleAnswerSubmitted}
                  />
                </TabsContent>

                <TabsContent value="summary">
                  <Card className="bg-gradient-to-r from-stackit-blue-light to-stackit-green-light border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Zap className="h-6 w-6 text-stackit-blue mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Answer Summary</h3>
                          <p className="text-gray-700 mb-4">{mockSummary}</p>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-1">Key Solutions:</h4>
                              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Use `useState` and `useEffect` hooks for state</li>
                                <li>• Implement TypeScript interfaces for safety</li>
                                <li>• Apply try-catch for error boundaries</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailModal;
