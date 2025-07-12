import React from 'react';
import { ChevronUp, ChevronDown, Clock, User, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Tag {
  tag_id: number;
  name: string;
  description: string;
}

interface Vote {
  likes: number;
  dislikes: number;
}

interface Answer {
  answer_id: number;
  content: string;
  username: string;
  created_at: string;
}

interface QuestionCardProps {
  question_id: number;
  title: string;
  description: string;
  tags: Tag[];
  votes: Vote;
  answers: Answer[];
  username: string;
  created_at: string;
  onClick: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  tags,
  username,
  created_at,
  votes,
  answers,
  onClick,
}) => {
  const voteCount = votes.likes - votes.dislikes;

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-stackit-blue cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-stackit-blue-light" onClick={(e) => e.stopPropagation()}>
              <ChevronUp className="h-4 w-4 group-hover:text-stackit-blue" />
            </Button>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-stackit-blue">{voteCount}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50" onClick={(e) => e.stopPropagation()}>
              <ChevronDown className="h-4 w-4 group-hover:text-red-500" />
            </Button>
          </div>

          {/* Answer Count */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                answers.length > 0
                  ? 'bg-stackit-blue-light border border-stackit-blue group-hover:bg-stackit-blue group-hover:text-white'
                  : 'bg-gray-50 border border-gray-200 group-hover:bg-gray-100'
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  answers.length > 0 ? 'text-stackit-blue group-hover:text-white' : 'text-gray-500'
                }`}
              >
                {answers.length}
              </span>
              <span
                className={`text-xs ${
                  answers.length > 0 ? 'text-gray-600 group-hover:text-white/80' : 'text-gray-600'
                }`}
              >
                {answers.length === 1 ? 'answer' : 'answers'}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-stackit-blue">{title}</h3>
            <p className="text-gray-600 mb-3 line-clamp-2 group-hover:text-gray-700">{description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag.tag_id}
                  variant="secondary"
                  className="bg-stackit-blue-light text-stackit-blue-dark hover:bg-stackit-blue hover:text-white cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* Answers Preview */}
            {answers.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Top answers:</p>
                {answers.slice(0, 2).map((ans) => (
                  <div key={ans.answer_id} className="text-sm text-gray-800 bg-white rounded p-2 shadow-sm">
                    <p className="text-gray-700">{ans.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      — {ans.username}, {new Date(ans.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {answers.length > 2 && (
                  <p className="text-xs text-blue-500">...and {answers.length - 2} more answer(s)</p>
                )}
              </div>
            )}

            {/* Footer Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">{username}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-sm">{new Date(created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {answers.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-stackit-blue hover:bg-stackit-blue-light border-stackit-blue/20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Summarize
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
