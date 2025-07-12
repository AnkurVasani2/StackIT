import React, { useState } from 'react';
import { ArrowLeft, Tag, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from './RichTextEditor';
import { useNavigate } from 'react-router-dom';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popularTags = [
    'javascript', 'react', 'typescript', 'node.js', 'python', 
    'css', 'html', 'sql', 'database', 'api', 'backend', 'frontend',
    'vue', 'angular', 'express', 'mongodb', 'postgresql', 'aws'
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag.toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid) return;

  setIsSubmitting(true);

  try {
    const response = await fetch('https://meerkat-saving-seriously.ngrok-free.app/api/v1/questions/add_question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        tags,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Question posted successfully:', result);

    // Navigate after success
    navigate('/');
  } catch (error) {
    console.error('Failed to post question:', error);
    alert('Something went wrong while posting your question. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};


  const isFormValid = title.trim().length > 10 && description.trim().length > 20 && tags.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4 hover:bg-stackit-blue-light transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-stackit-blue animate-pulse" />
            Ask a Question
          </h1>
          <p className="text-gray-600 mt-1">Share your knowledge with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Title Section */}
          <Card className="border-2 hover:border-stackit-blue-light transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <HelpCircle className="h-5 w-5 mr-2 text-stackit-blue" />
                Question Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium">
                  Be specific and imagine you're asking a question to another person
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How to implement authentication in React with TypeScript?"
                  maxLength={150}
                  className="text-lg border-2 focus:border-stackit-blue focus:ring-2 focus:ring-stackit-blue-light transition-all duration-200"
                />
                <div className="flex justify-between text-sm">
                  <span className={title.length > 10 ? "text-stackit-green" : "text-gray-500"}>
                    {title.length > 10 ? "✓ Good title length" : "Make it clear and descriptive"}
                  </span>
                  <span className={title.length > 140 ? "text-red-500" : "text-gray-400"}>
                    {title.length}/150
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Description Section */}
          <Card className="border-2 hover:border-stackit-blue-light transition-colors">
            <CardHeader>
              <CardTitle>Detailed Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Provide all the details someone would need to understand and answer your question
                </Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your problem in detail. Include what you've tried, what you expected to happen, and what actually happened. Add code examples if relevant..."
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={description.length > 20 ? "text-stackit-green" : "text-gray-500"}>
                    {description.length > 20 ? "✓ Good description" : `Need ${Math.max(0, 21 - description.length)} more characters`}
                  </span>
                  <span className="text-gray-400">
                    {description.length} characters
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Tags Section */}
          <Card className="border-2 hover:border-stackit-blue-light transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Tag className="h-5 w-5 mr-2 text-stackit-blue" />
                Tags ({tags.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Add up to 5 tags to describe what your question is about
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., javascript, react, hooks"
                      className="flex-1 border-2 focus:border-stackit-blue transition-colors"
                    />
                    <Button 
                      type="button"
                      onClick={() => handleAddTag(tagInput.trim())}
                      disabled={!tagInput.trim() || tags.length >= 5}
                      className="bg-stackit-blue hover:bg-stackit-blue-dark"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected tags:</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="bg-stackit-blue-light text-stackit-blue-dark px-3 py-1 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors animate-scale-in"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Popular tags:</Label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.filter(tag => !tags.includes(tag)).slice(0, 12).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-stackit-blue-light hover:border-stackit-blue transition-all duration-200 hover:scale-105"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit"
              className={`px-8 py-3 text-lg font-semibold transition-all duration-200 transform ${
                isFormValid 
                  ? 'bg-stackit-blue hover:bg-stackit-blue-dark hover:scale-105 animate-pulse' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </div>
              ) : (
                'Post Your Question'
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-stackit-blue">Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Great questions include:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Clear, specific problem description</li>
                  <li>Code examples when relevant</li>
                  <li>What you've already tried</li>
                  <li>Expected vs actual results</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Tags help others find your question:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Use existing popular tags when possible</li>
                  <li>Include the main technology/language</li>
                  <li>Add specific framework or library tags</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-stackit-green">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Be respectful and constructive</p>
              <p>• Search before asking to avoid duplicates</p>
              <p>• Accept helpful answers</p>
              <p>• Update your question with new information</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;
