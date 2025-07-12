import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom'; // 👈 Added for navigation

interface AnswerSubmissionFormProps {
  questionId: string;
  isLoggedIn?: boolean;
  onAnswerSubmitted?: (answer: any) => void;
}

const AnswerSubmissionForm: React.FC<AnswerSubmissionFormProps> = ({
  questionId,
  isLoggedIn = true,
  onAnswerSubmitted
}) => {
  const [content, setContent] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate(); // 👈 Initialize router

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write your answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (confidence === 0) {
      toast({
        title: "Confidence required",
        description: "Please rate your confidence in this answer.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://meerkat-saving-seriously.ngrok-free.app/api/v1/answers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Answer submission', // Optional depending on backend
          description: content,
          question_id: parseInt(questionId),
          user_id: 420188, // Replace with real user ID if available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const newAnswer = await response.json();

      onAnswerSubmitted?.(newAnswer);
      setContent('');
      setConfidence(0);

      toast({
        title: "Answer submitted",
        description: "Your answer has been posted successfully!"
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Want to help?</h3>
          <p className="text-gray-600 mb-4">Login to post your answer and share your knowledge!</p>
          <Button className="bg-stackit-blue hover:bg-stackit-blue-dark">
            Login to Answer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Submit Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Share your knowledge and help others..."
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            How confident are you in this answer?
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setConfidence(rating)}
                className="focus:outline-none transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    rating <= confidence
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {confidence > 0 && (
                <>
                  {confidence === 1 && 'Not very confident'}
                  {confidence === 2 && 'Somewhat confident'}
                  {confidence === 3 && 'Moderately confident'}
                  {confidence === 4 && 'Very confident'}
                  {confidence === 5 && 'Extremely confident'}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || confidence === 0 || isSubmitting}
            className="bg-stackit-green hover:bg-stackit-green-dark px-8"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerSubmissionForm;
