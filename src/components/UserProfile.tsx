
import React, { useState } from 'react';
import { User, Calendar, Award, BookOpen, MessageSquare, Star, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Passionate full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Love helping others learn and grow in their coding journey.");
  const [editedBio, setEditedBio] = useState(bio);

  const userStats = {
    questionsAsked: 24,
    answersPosted: 156,
    averageConfidence: 4.2,
    reputation: 2847
  };

  const topTags = [
    { name: 'react', count: 45, confidence: 4.5 },
    { name: 'typescript', count: 38, confidence: 4.3 },
    { name: 'javascript', count: 52, confidence: 4.1 },
    { name: 'node.js', count: 28, confidence: 4.0 },
    { name: 'css', count: 22, confidence: 3.8 },
    { name: 'html', count: 19, confidence: 3.9 }
  ];

  const recentQuestions = [
    { id: 1, title: "How to optimize React component performance?", answers: 5, votes: 12, timestamp: "2 days ago" },
    { id: 2, title: "Best practices for TypeScript error handling", answers: 3, votes: 8, timestamp: "1 week ago" },
    { id: 3, title: "Database design patterns for scalability", answers: 7, votes: 15, timestamp: "2 weeks ago" }
  ];

  const recentAnswers = [
    { id: 1, question: "How to implement custom React hooks?", votes: 24, confidence: 5, timestamp: "1 day ago" },
    { id: 2, question: "TypeScript generic constraints explained", votes: 18, confidence: 4, timestamp: "3 days ago" },
    { id: 3, question: "Async/await vs Promises in JavaScript", votes: 31, confidence: 5, timestamp: "5 days ago" }
  ];

  const handleSaveBio = () => {
    setBio(editedBio);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Manav Parekh</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Joined March 2025</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">{userStats.reputation} reputation</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="hover:bg-stackit-blue-light"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="text-gray-700"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={handleSaveBio} className="bg-stackit-blue hover:bg-stackit-blue-dark">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{bio}</p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-stackit-blue-light rounded-lg hover:bg-stackit-blue-light/80 transition-colors">
                  <div className="text-2xl font-bold text-stackit-blue">{userStats.questionsAsked}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-stackit-green-light rounded-lg hover:bg-stackit-green-light/80 transition-colors">
                  <div className="text-2xl font-bold text-stackit-green">{userStats.answersPosted}</div>
                  <div className="text-sm text-gray-600">Answers</div>
                </div>
                <div className="text-center p-4 bg-stackit-orange-light rounded-lg hover:bg-stackit-orange-light/80 transition-colors">
                  <div className="text-2xl font-bold text-stackit-orange">{userStats.averageConfidence}</div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tag Expertise Heatmap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-stackit-blue" />
            <span>Tag Expertise</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topTags.map((tag, index) => (
              <div 
                key={tag.name}
                className="group p-4 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                style={{ 
                  backgroundColor: `hsl(220, 100%, ${95 - (tag.confidence - 3) * 10}%)`,
                  borderColor: `hsl(220, 70%, ${80 - (tag.confidence - 3) * 15}%)`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-stackit-blue text-white group-hover:bg-stackit-blue-dark transition-colors">
                    {tag.name}
                  </Badge>
                  <span className="text-sm font-medium text-gray-600">{tag.count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600">Confidence:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 transition-colors ${
                          i < Math.floor(tag.confidence) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{tag.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">My Questions</TabsTrigger>
          <TabsTrigger value="answers">My Answers</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-stackit-blue-light rounded-lg">
                  <MessageSquare className="h-4 w-4 text-stackit-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Answered "React Hook Optimization"</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-stackit-green-light rounded-lg">
                  <BookOpen className="h-4 w-4 text-stackit-green" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Asked "Database Scaling Patterns"</p>
                    <p className="text-xs text-gray-600">3 hourss ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">Top React Contributor</p>
                    <p className="text-sm text-gray-600">Earned for 50+ helpful React answers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium">TypeScript Expert</p>
                    <p className="text-sm text-gray-600">Consistent high-quality TypeScript answers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {recentQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-stackit-blue transition-colors">
                      {question.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{question.answers} answers</span>
                      <span>{question.votes} votes</span>
                      <span>{question.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          {recentAnswers.map((answer) => (
            <Card key={answer.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-stackit-blue transition-colors">
                      {answer.question}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{answer.votes} votes</span>
                      <div className="flex items-center space-x-1">
                        <span>Confidence:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < answer.confidence ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span>{answer.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-600">Questions you bookmark will appear here for easy access.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
