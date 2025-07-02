import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, HelpCircle } from 'lucide-react';
import { Resource, GridSize, SuggestedPath } from '../types';

interface LearningGridProps {
  resources: Resource[];
  gridSize: GridSize;
  onResourceClick: (resource: Resource) => void;
  suggestedPath: SuggestedPath | null;
}

const LearningGrid: React.FC<LearningGridProps> = ({
  resources,
  gridSize,
  onResourceClick,
  suggestedPath
}) => {
  const cellSize = 40;
  const gap = 2;

  // Create a map of positions to resources for quick lookup
  const resourceMap = useMemo(() => {
    const map = new Map<string, Resource>();
    resources.forEach(resource => {
      map.set(`${resource.x},${resource.y}`, resource);
    });
    return map;
  }, [resources]);

  // Create a set of suggested path positions
  const suggestedPositions = useMemo(() => {
    if (!suggestedPath) return new Set<string>();
    return new Set(
      suggestedPath.suggestedPath.map(step => `${step.x},${step.y}`)
    );
  }, [suggestedPath]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return HelpCircle;
      case 'tutorial':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getResourceColor = (resource: Resource, isOnPath: boolean) => {
    if (resource.completed) {
      return 'bg-green-500 text-white shadow-lg';
    }
    if (isOnPath) {
      return 'bg-purple-500 text-white shadow-lg animate-pulse';
    }
    switch (resource.type) {
      case 'quiz':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'tutorial':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      default:
        return 'bg-indigo-500 text-white hover:bg-indigo-600';
    }
  };

  return (
    <div className="relative overflow-auto max-h-[600px] bg-gray-50 rounded-xl p-4">
      <div 
        className="relative"
        style={{
          width: gridSize.x * (cellSize + gap),
          height: gridSize.y * (cellSize + gap)
        }}
      >
        {/* Grid background */}
        {Array.from({ length: gridSize.y }, (_, y) =>
          Array.from({ length: gridSize.x }, (_, x) => {
            const key = `${x},${y}`;
            const resource = resourceMap.get(key);
            const isOnPath = suggestedPositions.has(key);
            
            return (
              <div
                key={key}
                className={`absolute border border-gray-200 ${
                  resource ? 'cursor-pointer' : 'bg-white'
                } ${isOnPath && !resource ? 'bg-purple-100 border-purple-300' : ''}`}
                style={{
                  left: x * (cellSize + gap),
                  top: (gridSize.y - 1 - y) * (cellSize + gap),
                  width: cellSize,
                  height: cellSize
                }}
                onClick={() => resource && onResourceClick(resource)}
              >
                {resource && (
                  <motion.div
                    className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-200 ${getResourceColor(resource, isOnPath)}`}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (x + y) * 0.01 }}
                    title={resource.name}
                  >
                    {React.createElement(getResourceIcon(resource.type), {
                      className: "w-5 h-5"
                    })}
                  </motion.div>
                )}
              </div>
            );
          })
        )}

        {/* Path arrows */}
        {suggestedPath && suggestedPath.suggestedPath.length > 1 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: gridSize.x * (cellSize + gap),
              height: gridSize.y * (cellSize + gap)
            }}
          >
            {suggestedPath.suggestedPath.slice(0, -1).map((step, index) => {
              const nextStep = suggestedPath.suggestedPath[index + 1];
              const startX = step.x * (cellSize + gap) + cellSize / 2;
              const startY = (gridSize.y - 1 - step.y) * (cellSize + gap) + cellSize / 2;
              const endX = nextStep.x * (cellSize + gap) + cellSize / 2;
              const endY = (gridSize.y - 1 - nextStep.y) * (cellSize + gap) + cellSize / 2;

              return (
                <motion.line
                  key={index}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default LearningGrid;