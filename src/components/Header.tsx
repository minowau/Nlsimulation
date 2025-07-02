import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Zap, BookOpen } from 'lucide-react';
import { LearnerProgress } from '../types';

interface HeaderProps {
  progress: LearnerProgress | null;
  onToggleDashboard: () => void;
  onSuggestPath: () => void;
}

const Header: React.FC<HeaderProps> = ({ progress, onToggleDashboard, onSuggestPath }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Navigated Learning
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Adaptive Learning Platform</p>
            </div>
          </motion.div>

          {/* Progress Stats */}
          {progress && (
            <motion.div 
              className="hidden md:flex items-center space-x-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                  {progress.completedResources.length}/{progress.totalResources} Completed
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {progress.score} Points
                </span>
              </div>

              <div className="w-32 bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {progress.progressPercentage}%
              </span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onSuggestPath}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Suggest Path</span>
            </motion.button>

            <motion.button
              onClick={onToggleDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;