import React from 'react';
import { motion } from 'framer-motion';
import { X, Brain, ArrowRight, Target } from 'lucide-react';
import { SuggestedPath } from '../types';

interface PathVisualizationProps {
  path: SuggestedPath;
  onClose: () => void;
}

const PathVisualization: React.FC<PathVisualizationProps> = ({ path, onClose }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI-Suggested Learning Path</h3>
            <p className="text-sm text-gray-600">
              Confidence: {Math.round(path.confidence * 100)}%
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Path Steps */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Recommended Steps</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {path.suggestedPath.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Move to ({step.x}, {step.y})
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    Action: {step.action}
                  </p>
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

        {/* AI Reasoning */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">AI Reasoning</h4>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
            <p className="text-gray-700 mb-4">{path.reasoning}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Path Length:</span>
                <span className="font-medium text-gray-800">{path.suggestedPath.length} steps</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Confidence Score:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${path.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="font-medium text-gray-800">
                    {Math.round(path.confidence * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Optimization:</span>
                <span className="font-medium text-green-600">Shortest Path</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 mt-0.5">💡</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Pro Tip</p>
                <p className="text-xs text-yellow-700">
                  Follow the suggested path for optimal learning progression based on topic dependencies and your current progress.
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