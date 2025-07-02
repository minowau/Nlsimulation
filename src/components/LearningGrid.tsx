import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, HelpCircle, Lock, CheckCircle2, ZoomIn, ZoomOut, Move } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  const cellSize = 50 * zoom;
  const gap = 2 * zoom;
  const minZoom = 0.5;
  const maxZoom = 2;

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

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(minZoom, Math.min(maxZoom, newZoom));
    });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 'out' : 'in';
      handleZoom(direction);
    }
  };

  // Handle drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      containerRef.current.scrollLeft -= deltaX;
      containerRef.current.scrollTop -= deltaY;
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update scroll position for minimap
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop
      });
    }
  };

  // Center view on a specific resource
  const centerOnResource = (resource: Resource) => {
    if (containerRef.current) {
      const targetX = resource.x * (cellSize + gap) - containerRef.current.clientWidth / 2;
      const targetY = (gridSize.y - 1 - resource.y) * (cellSize + gap) - containerRef.current.clientHeight / 2;
      
      containerRef.current.scrollTo({
        left: Math.max(0, targetX),
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }
  };

  const getResourceIcon = (type: string, completed: boolean, available: boolean) => {
    if (completed) return CheckCircle2;
    if (!available) return Lock;
    
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
      return 'bg-green-500 text-white shadow-lg border-green-600';
    }
    if (!resource.available) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400';
    }
    if (isOnPath) {
      return 'bg-purple-500 text-white shadow-lg animate-pulse border-purple-600';
    }
    switch (resource.type) {
      case 'quiz':
        return 'bg-orange-500 text-white hover:bg-orange-600 border-orange-600';
      case 'tutorial':
        return 'bg-blue-500 text-white hover:bg-blue-600 border-blue-600';
      default:
        return 'bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600';
    }
  };

  const getTooltipText = (resource: Resource) => {
    if (resource.completed) {
      return `✅ ${resource.name} (Completed)`;
    }
    if (!resource.available) {
      const prereqs = resource.prerequisites?.join(', ') || 'Unknown prerequisites';
      return `🔒 ${resource.name}\nPrerequisites: ${prereqs}`;
    }
    return `📚 ${resource.name}\nClick to start learning`;
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In (Ctrl + Scroll)"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="flex items-center space-x-1">
            <Move className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Drag to pan</span>
          </div>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-xs text-gray-600 mb-2">Overview</div>
        <div 
          className="relative bg-gray-100 border border-gray-300"
          style={{ width: '120px', height: '80px' }}
        >
          {/* Minimap resources */}
          {resources.map((resource, index) => (
            <div
              key={index}
              className={`absolute w-1 h-1 rounded-full cursor-pointer ${
                resource.completed ? 'bg-green-500' : 
                resource.available ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              style={{
                left: `${(resource.x / gridSize.x) * 120}px`,
                top: `${((gridSize.y - 1 - resource.y) / gridSize.y) * 80}px`
              }}
              onClick={() => centerOnResource(resource)}
              title={resource.name}
            />
          ))}
          
          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-red-500 bg-red-200 bg-opacity-30"
            style={{
              left: `${(scrollPosition.x / (gridSize.x * (cellSize + gap))) * 120}px`,
              top: `${(scrollPosition.y / (gridSize.y * (cellSize + gap))) * 80}px`,
              width: `${Math.min(120, (containerRef.current?.clientWidth || 0) / (gridSize.x * (cellSize + gap)) * 120)}px`,
              height: `${Math.min(80, (containerRef.current?.clientHeight || 0) / (gridSize.y * (cellSize + gap)) * 80)}px`
            }}
          />
        </div>
      </div>

      {/* Main scrollable grid */}
      <div 
        ref={containerRef}
        className={`relative overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ 
          height: '700px',
          scrollBehavior: 'smooth'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onScroll={handleScroll}
      >
        <div 
          className="relative"
          style={{
            width: gridSize.x * (cellSize + gap) + 100, // Extra padding
            height: gridSize.y * (cellSize + gap) + 100,
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          {/* Grid background pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${cellSize + gap}px ${cellSize + gap}px`
            }}
          />

          {/* Grid cells */}
          {Array.from({ length: gridSize.y }, (_, y) =>
            Array.from({ length: gridSize.x }, (_, x) => {
              const key = `${x},${y}`;
              const resource = resourceMap.get(key);
              const isOnPath = suggestedPositions.has(key);
              
              return (
                <div
                  key={key}
                  className={`absolute border transition-all duration-200 ${
                    resource ? 'cursor-pointer' : 'bg-white border-gray-200'
                  } ${isOnPath && !resource ? 'bg-purple-100 border-purple-300 animate-pulse' : ''}`}
                  style={{
                    left: x * (cellSize + gap) + 50, // Offset for padding
                    top: (gridSize.y - 1 - y) * (cellSize + gap) + 50,
                    width: cellSize,
                    height: cellSize
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (resource && resource.available && !resource.completed) {
                      onResourceClick(resource);
                    }
                  }}
                  title={resource ? getTooltipText(resource) : ''}
                >
                  {resource && (
                    <motion.div
                      className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${getResourceColor(resource, isOnPath)}`}
                      whileHover={resource.available && !resource.completed ? { scale: 1.1, zIndex: 10 } : {}}
                      whileTap={resource.available && !resource.completed ? { scale: 0.95 } : {}}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (x + y) * 0.01, type: "spring", stiffness: 300 }}
                    >
                      {React.createElement(getResourceIcon(resource.type, resource.completed, resource.available), {
                        className: `w-${Math.max(4, Math.min(8, Math.floor(cellSize / 8)))} h-${Math.max(4, Math.min(8, Math.floor(cellSize / 8)))}`
                      })}
                      
                      {/* Progress indicator for completed resources */}
                      {resource.completed && (
                        <motion.div
                          className="absolute -top-1 -right-1 bg-green-600 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ 
                            width: Math.max(12, cellSize / 4), 
                            height: Math.max(12, cellSize / 4) 
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      
                      {/* Lock indicator for unavailable resources */}
                      {!resource.available && !resource.completed && (
                        <motion.div
                          className="absolute -top-1 -right-1 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ 
                            width: Math.max(12, cellSize / 4), 
                            height: Math.max(12, cellSize / 4) 
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                        >
                          🔒
                        </motion.div>
                      )}

                      {/* Resource name on hover for larger zoom levels */}
                      {zoom > 1.2 && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {resource.name}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}

          {/* Enhanced path visualization with arrows */}
          {suggestedPath && suggestedPath.suggestedPath.length > 1 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{
                width: gridSize.x * (cellSize + gap) + 100,
                height: gridSize.y * (cellSize + gap) + 100
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#8b5cf6"
                  />
                </marker>
              </defs>
              
              {suggestedPath.suggestedPath.slice(0, -1).map((step, index) => {
                const nextStep = suggestedPath.suggestedPath[index + 1];
                const startX = step.x * (cellSize + gap) + cellSize / 2 + 50;
                const startY = (gridSize.y - 1 - step.y) * (cellSize + gap) + cellSize / 2 + 50;
                const endX = nextStep.x * (cellSize + gap) + cellSize / 2 + 50;
                const endY = (gridSize.y - 1 - nextStep.y) * (cellSize + gap) + cellSize / 2 + 50;

                return (
                  <motion.line
                    key={index}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#8b5cf6"
                    strokeWidth={Math.max(2, zoom * 3)}
                    strokeDasharray="8,4"
                    markerEnd="url(#arrowhead)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ delay: index * 0.2, duration: 0.8, ease: "easeInOut" }}
                  />
                );
              })}
            </svg>
          )}

          {/* Path confidence indicator */}
          {suggestedPath && (
            <motion.div
              className="absolute bg-white rounded-lg shadow-lg p-3 border border-purple-200"
              style={{ 
                top: '20px', 
                right: '20px',
                transform: `scale(${zoom})`
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  AI Confidence: {Math.round(suggestedPath.confidence * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Legend */}
      <motion.div
        className="mt-6 flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-indigo-500 rounded border-2 border-indigo-600"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded border-2 border-gray-400"></div>
          <span className="text-sm text-gray-600">Locked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded border-2 border-purple-600 animate-pulse"></div>
          <span className="text-sm text-gray-600">Suggested Path</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>💡 Tip: Ctrl+Scroll to zoom, drag to pan, click minimap to navigate</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningGrid;