import React from 'react';
import { motion } from 'framer-motion';
import { X, Brain, ArrowRight, Target, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { SuggestedPath } from '../types';

interface PathVisualizationProps {
  path: SuggestedPath;
  onClose: () => void;
}

const PathVisualization: React.FC<PathVisualizationProps> = ({ path, onClose }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
            <Brain className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">DQN-Powered Learning Path</h3>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                AI Confidence: <span className="font-semibold text-purple-600">{Math.round(path.confidence * 100)}%</span>
              </p>
              {path.nextResource && (
                <p className="text-sm text-gray-600">
                  Next: <span className="font-semibold text-indigo-600">{path.nextResource}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Path Steps */}
        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <span>Optimal Learning Sequence</span>
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {path.suggestedPath.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Position ({step.x}, {step.y})
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-600 capitalize">
                      Action: <span className="font-medium">{step.action}</span>
                    </p>
                    {step.confidence && (
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">
                          {Math.round(step.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {index < path.suggestedPath.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                )}
                {index === path.suggestedPath.length - 1 && (
                  <Target className="w-4 h-4 text-green-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Analysis & Stats */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>DQN Analysis</span>
            </h4>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{path.reasoning}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Path Length:</span>
                  <span className="font-semibold text-gray-800">{path.suggestedPath.length} steps</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Model Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${path.confidence * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="font-semibold text-gray-800">
                      {Math.round(path.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                {path.goal && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Learning Goal:</span>
                    <span className="font-semibold text-indigo-600 capitalize">
                      {path.goal.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {path.availableResources !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Available Resources:</span>
                    <span className="font-semibold text-green-600">
                      {path.availableResources}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Recommended Action</p>
                <p className="text-xs text-yellow-700 mt-1">
                  {path.nextResource 
                    ? `Start with "${path.nextResource}" as it's the next logical step in your learning journey.`
                    : "Follow the suggested path for optimal learning progression based on prerequisite dependencies."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* DQN Model Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="text-blue-600 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">DQN Model</p>
                <p className="text-xs text-blue-700 mt-1">
                  This path is generated using a Deep Q-Network trained on optimal learning sequences. 
                  The model considers your progress, prerequisites, and learning objectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PathVisualization;