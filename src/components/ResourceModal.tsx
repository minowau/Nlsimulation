import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { Resource } from '../types';

interface ResourceModalProps {
  resource: Resource;
  onClose: () => void;
  onComplete: () => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose, onComplete }) => {
  const getResourceContent = (type: string) => {
    switch (type) {
      case 'quiz':
        return {
          icon: CheckCircle,
          title: 'Interactive Quiz',
          description: 'Test your understanding with this interactive quiz.',
          content: 'This quiz will help you assess your knowledge and identify areas for improvement.',
          action: 'Take Quiz',
          mockUrl: 'https://example.com/quiz'
        };
      case 'tutorial':
        return {
          icon: FileText,
          title: 'Tutorial',
          description: 'Step-by-step tutorial to guide your learning.',
          content: 'Follow along with this comprehensive tutorial to master the concepts.',
          action: 'Start Tutorial',
          mockUrl: 'https://example.com/tutorial'
        };
      default:
        return {
          icon: Play,
          title: 'Video Lecture',
          description: 'Watch this educational video to learn the concepts.',
          content: 'This video provides a comprehensive overview of the topic with examples and explanations.',
          action: 'Watch Video',
          mockUrl: 'https://example.com/video'
        };
    }
  };

  const content = getResourceContent(resource.type);
  const IconComponent = content.icon;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <IconComponent className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{resource.name}</h2>
              <p className="text-sm text-gray-600">{content.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600">{content.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What you'll learn</h3>
            <p className="text-gray-600">{content.content}</p>
          </div>

          {/* Mock content preview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Resource Preview</h4>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </span>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <IconComponent className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <p className="text-indigo-800 font-medium">Interactive {content.title}</p>
                <p className="text-indigo-600 text-sm">Click to access the full content</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>📍 Position: ({resource.x}, {resource.y})</span>
              </div>
              <a
                href={content.mockUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Open in new tab</span>
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <a
              href={content.mockUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <IconComponent className="w-4 h-4" />
              <span>{content.action}</span>
            </a>
            <motion.button
              onClick={onComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Complete</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResourceModal;