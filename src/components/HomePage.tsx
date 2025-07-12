import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Award, Filter, Search, SortAsc, X } from 'lucide-react';
import QuestionCard from './QuestionCard';
import QuestionDetailModal from './QuestionDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Question } from '@/types/question';
import { Link } from "react-router-dom";
import { User } from "lucide-react";
interface Vote {
  likes: number;
  dislikes: number;
}

interface Tag {
  tag_id: number;
  name: string;
  description: string;
}

interface Comment {
  comment_id: number;
  user_id: number;
  username: string;
  comment_text: string;
  created_at: string;
}

interface Answer {
  answer_id: number;
  user_id: number;
  username: string;
  title: string;
  description: string;
  votes: Vote;
  created_at: string;
  updated_at: string;
  comments: Comment[];
}



const HomePage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('latest');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

 useEffect(() => {
  const fetchQuestions = async () => {
    setLoading(true);
    console.log("🚀 Starting API request...");
    
    try {
      const response = await fetch('https://meerkat-saving-seriously.ngrok-free.app/api/v1/all_questions', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Raw response data:", data);
      
      // Extract questions array from response
      const questionsArray = data.questions || [];
      
      // Transform HTML-encoded entities in description and handle upvotes/downvotes
      const sanitizedData = questionsArray.map((question: any) => ({
        ...question,
        description: decodeHTMLEntities(question.description || ''),
        votes: {
          likes: question.upvotes || 0,
          dislikes: question.downvotes || 0
        },
        // Ensure answers is always an array
        answers: question.answers || []
      }));

      console.log("✅ Processed questions:", sanitizedData.length);
      setQuestions(sanitizedData);
      setError('');
    } catch (err) {
      console.error("❌ Error details:", {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode HTML entities
  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  fetchQuestions();
}, []);


  const availableTags = ['cricket_rules', 'indian_cooking', 'education_india', 'tech_jobs'];

  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    setSortBy('newest');
  };

  if (!Array.isArray(questions)) {
  return <div>Error loading questions.</div>;
}

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchTerm === '' ||
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => question.tags?.some(t => t.name === tag));

    return matchesSearch && matchesTags;
  });

  // Update how votes are calculated
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'most-answers':
        return b.answer_count - a.answer_count;
      case 'highest-voted':
        const aVotes = a.votes.likes - a.votes.dislikes;
        const bVotes = b.votes.likes - b.votes.dislikes;
        return bVotes - aVotes;
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) return <div className="p-10 text-center">Loading questions...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StackIt</h1>
        <p className="text-gray-600 text-lg">Collaborative learning through structured knowledge sharing</p>
      </div>

      <Card className="mb-6 border-2 hover:border-stackit-blue-light transition-colors">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-stackit-blue"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1 focus:border-stackit-blue"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-answers">Most Answers</option>
                  <option value="highest-voted">Highest Voted</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Filter by tags:</span>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? 'bg-stackit-blue hover:bg-stackit-blue-dark'
                          : 'hover:bg-stackit-blue-light hover:border-stackit-blue'
                      }`}
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {(selectedTags.length > 0 || searchTerm) && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex items-center space-x-1 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="h-3 w-3" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>

            {(selectedTags.length > 0 || searchTerm) && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-stackit-blue-light">
                    Tag: {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          🧠 <span className="font-bold text-stackit-blue">{sortedQuestions.length}</span> questions found
        </div>
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full mb-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-4 bg-gray-100">
            <TabsTrigger value="latest" className="flex items-center space-x-2 data-[state=active]:bg-stackit-blue data-[state=active]:text-white">
              <Clock className="h-4 w-4" />
              <span>Latest</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2 data-[state=active]:bg-stackit-blue data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="flex items-center space-x-2 data-[state=active]:bg-stackit-blue data-[state=active]:text-white">
              <Filter className="h-4 w-4" />
              <span>Unanswered</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center space-x-2 data-[state=active]:bg-stackit-blue data-[state=active]:text-white">
              <Award className="h-4 w-4" />
              <span>Featured</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="latest" className="mt-6 space-y-4">
          {sortedQuestions.map((question) => (
            <QuestionCard
              key={question.question_id}
              question_id={question.question_id}
              title={question.title}
              description={question.description}
              tags={question.tags}
              votes={question.votes}
              answers={question.answers.map(a => ({
                answer_id: a.answer_id,
                content: a.description, // Map 'description' to 'content'
                username: a.username,
                created_at: a.created_at,
                // Add other fields as needed
              }))}
              username={question.username}
              created_at={question.created_at}
              onClick={() => handleQuestionClick(question)}
            />
          ))}
        </TabsContent>

        <TabsContent value="trending" className="mt-6 space-y-4">
          {sortedQuestions
            .sort((a, b) => {
              const aVotes = (a.votes?.likes || 0) - (a.votes?.dislikes || 0);
              const bVotes = (b.votes?.likes || 0) - (b.votes?.dislikes || 0);
              return bVotes - aVotes;
            })
            .map((question) => (
              <QuestionCard
                key={question.question_id}
                question_id={question.question_id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                votes={question.votes}
                answers={question.answers.map(a => ({
                  answer_id: a.answer_id,
                  content: a.description,
                  username: a.username,
                  created_at: a.created_at,
                  // Add other fields as needed
                }))}
                username={question.username}
                created_at={question.created_at}
                onClick={() => handleQuestionClick(question)}
              />
            ))}
        </TabsContent>

        <TabsContent value="unanswered" className="mt-6 space-y-4">
          {sortedQuestions
            .filter(q => !q.answers || q.answers.length === 0)
            .map((question) => (
              <QuestionCard
                key={question.question_id}
                question_id={question.question_id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                votes={question.votes}
                answers={[]}
                username={question.username}
                created_at={question.created_at}
                onClick={() => handleQuestionClick(question)}
              />
            ))}
        </TabsContent>

        <TabsContent value="featured" className="mt-6 space-y-4">
          {sortedQuestions
            .filter(q => (q.answers?.length || 0) > 0) // Placeholder logic
            .map((question) => (
              <QuestionCard
                key={question.question_id}
                question_id={question.question_id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                votes={question.votes}
                answers={question.answers.map(a => ({
                  answer_id: a.answer_id,
                  content: a.description,
                  username: a.username,
                  created_at: a.created_at,
                  // Add other fields as needed
                }))}
                username={question.username}
                created_at={question.created_at}
                onClick={() => handleQuestionClick(question)}
              />
            ))}
        </TabsContent>
      </Tabs>

      {sortedQuestions.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            className="px-8 hover:bg-stackit-blue-light hover:border-stackit-blue transition-all duration-200 transform hover:scale-105"
          >
            Load More Questions
          </Button>
        </div>
      )}

      {sortedQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <QuestionDetailModal
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        question={selectedQuestion}
      />
    </div>
  );
};

export default HomePage;
