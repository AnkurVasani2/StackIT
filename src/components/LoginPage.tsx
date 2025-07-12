
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stackit-blue-light to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-stackit-blue-light rounded-full">
              <Sparkles className="h-8 w-8 text-stackit-blue animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-stackit-blue">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to your StackIt account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-blue-light hover:border-stackit-blue ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-stackit-blue'}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-stackit-blue-light hover:border-stackit-blue ${errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-stackit-blue'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm animate-fade-in">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-stackit-blue hover:bg-stackit-blue-dark transition-all duration-200 transform hover:scale-[1.02] py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-stackit-blue hover:underline text-sm transition-colors hover:text-stackit-blue-dark"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">New to StackIt?</span>
              </div>
            </div>
            <div className="text-center">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-stackit-blue text-stackit-blue hover:bg-stackit-blue-light transition-all duration-200 rounded-md font-medium"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
