import React, { useState } from 'react';
import { Search, Bell, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [notificationCount] = useState(3);
  const navigate = useNavigate();

  return (
<header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#e0f2ff] to-[#f0fcff] dark:from-[#0f172a] dark:to-[#1e293b] backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-stackit-blue to-stackit-green rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-bold text-base">St</span>
          </div>
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            StackIt
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions, tags, or users..."
              className="pl-10 py-2 rounded-md bg-white/90 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-stackit-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/ask"
            className="bg-stackit-blue text-white px-4 py-2 rounded-md hover:bg-stackit-blue-dark transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ask
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 dark:bg-gray-900">
              <div className="p-3 border-b dark:border-gray-700">
                <h3 className="font-semibold text-sm dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New answer on your question</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      "How to implement React hooks?" - 2h ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">@johndoe mentioned you</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      "Great explanation about state management!" - 4h ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Your answer was upvoted</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      "JavaScript array methods explained" - 1 day ago
                    </p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="p-3 border-t dark:border-gray-700">
                <Button variant="ghost" className="w-full text-sm text-stackit-blue">
                  Mark all as read
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-9 h-9 bg-gradient-to-br from-stackit-blue to-stackit-green rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-900">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 text-sm dark:text-white">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup" className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
