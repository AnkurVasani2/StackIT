
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    skills: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions] = useState([
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 
    'HTML', 'CSS', 'Vue.js', 'Angular', 'PHP', 'C++', 'Go', 'Rust', 'MongoDB',
    'PostgreSQL', 'Docker', 'AWS', 'Git', 'GraphQL', 'Redux', 'Next.js'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSuggestions(true);
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const filteredSuggestions = skillSuggestions.filter(skill => 
    skill.toLowerCase().includes(skillInput.toLowerCase()) && 
    !formData.skills.includes(skill)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Enhanced validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Signup attempt:', formData);
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stackit-green-light to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 animate-scale-in">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-stackit-green-light rounded-full">
              <Sparkles className="h-8 w-8 text-stackit-green animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-stackit-green">Join StackIt</CardTitle>
          <p className="text-gray-600">Create your account and start learning</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-green-light hover:border-stackit-green ${errors.name ? 'border-red-500' : 'focus:border-stackit-green'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm animate-fade-in">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-green-light hover:border-stackit-green ${errors.username ? 'border-red-500' : 'focus:border-stackit-green'}`}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-sm animate-fade-in">{errors.username}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-green-light hover:border-stackit-green ${errors.email ? 'border-red-500' : 'focus:border-stackit-green'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm animate-fade-in">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-green-light hover:border-stackit-green ${errors.password ? 'border-red-500' : 'focus:border-stackit-green'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm animate-fade-in">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-medium">Your Skills</Label>
              <div className="relative">
                <Plus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="skills"
                  type="text"
                  placeholder="Add your skills (e.g., React, JavaScript)"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyPress={handleSkillKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-green-light hover:border-stackit-green ${errors.skills ? 'border-red-500' : 'focus:border-stackit-green'}`}
                />
                {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-stackit-green-light rounded-md shadow-lg max-h-40 overflow-y-auto animate-fade-in">
                    {filteredSuggestions.slice(0, 6).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full px-3 py-2 text-left hover:bg-stackit-green-light transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="bg-stackit-green-light text-stackit-green px-3 py-1 animate-scale-in"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {errors.skills && <p className="text-red-500 text-sm animate-fade-in">{errors.skills}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-stackit-green hover:bg-stackit-green-dark transition-all duration-200 transform hover:scale-[1.02] py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-stackit-green text-stackit-green hover:bg-stackit-green-light transition-all duration-200 rounded-md font-medium"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
