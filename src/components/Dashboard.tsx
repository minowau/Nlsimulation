import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { LearnerProgress } from '../types';

interface DashboardProps {
  progress: LearnerProgress | null;
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  if (!progress) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const unlockedAchievements = progress.achievements.filter(a => a.unlocked);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Learning Dashboard</h3>
        <p className="text-gray-600">Track your progress and achievements</p>
      </div>

      {/* Progress Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-semibold text-gray-800">Completion Rate</p>
              <p className="text-sm text-gray-600">{progress.progressPercentage}%</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {progress.completedResources.length}/{progress.totalResources}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-semibold text-gray-800">Total Score</p>
              <p className="text-sm text-gray-600">Points earned</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {progress.score}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h4 className="font-semibold text-gray-800">Achievements</h4>
        </div>
        
        <div className="space-y-2">
          {progress.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200 opacity-60'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Award className={`w-5 h-5 ${
                achievement.unlocked ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className={`font-medium ${
                achievement.unlocked ? 'text-green-800' : 'text-gray-500'
              }`}>
                {achievement.name}
              </span>
              {achievement.unlocked && (
                <motion.div
                  className="ml-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {progress.pathHistory.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-gray-800">Recent Activity</h4>
          </div>
          
          <div className="space-y-2">
            {progress.pathHistory.slice(-3).map((history, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Path suggested with {history.path.length} steps
                </p>
                <p className="text-xs text-blue-600">
                  {new Date(history.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
        <p className="text-sm text-gray-600">
          {progress.completedResources.length === 0 
            ? "Start your learning journey by clicking on any resource!"
            : progress.progressPercentage === 100
            ? "Congratulations! You've completed all resources!"
            : "Use the 'Suggest Path' button to get AI-powered recommendations for your next learning steps."
          }
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;