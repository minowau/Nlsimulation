import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import LearningGrid from './components/LearningGrid';
import Dashboard from './components/Dashboard';
import ResourceModal from './components/ResourceModal';
import PathVisualization from './components/PathVisualization';
import { useApi } from './hooks/useApi';
import { Resource, LearnerProgress, SuggestedPath } from './types';

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [gridSize, setGridSize] = useState({ x: 20, y: 20 });
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [suggestedPath, setSuggestedPath] = useState<SuggestedPath | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchResources, fetchProgress, completeResource, getSuggestedPath } = useApi();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [resourcesData, progressData] = await Promise.all([
        fetchResources(),
        fetchProgress()
      ]);
      
      setResources(resourcesData.resources);
      setGridSize(resourcesData.gridSize);
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (!resource.completed) {
      setSelectedResource(resource);
    }
  };

  const handleCompleteResource = async (resource: Resource) => {
    try {
      await completeResource(resource.name, { x: resource.x, y: resource.y });
      
      // Update local state
      setResources(prev => prev.map(r => 
        r.name === resource.name ? { ...r, completed: true } : r
      ));
      
      // Refresh progress
      const updatedProgress = await fetchProgress();
      setProgress(updatedProgress);
      
      setSelectedResource(null);
    } catch (error) {
      console.error('Failed to complete resource:', error);
    }
  };

  const handleSuggestPath = async () => {
    try {
      const currentPos = progress?.currentPosition || { x: 0, y: 0 };
      const pathData = await getSuggestedPath(currentPos);
      setSuggestedPath(pathData);
    } catch (error) {
      console.error('Failed to get suggested path:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your learning journey...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      <Header 
        progress={progress}
        onToggleDashboard={() => setShowDashboard(!showDashboard)}
        onSuggestPath={handleSuggestPath}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Learning Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Learning Map</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Suggested Path</span>
                  </div>
                </div>
              </div>
              
              <LearningGrid
                resources={resources}
                gridSize={gridSize}
                onResourceClick={handleResourceClick}
                suggestedPath={suggestedPath}
              />
            </motion.div>
          </div>

          {/* Dashboard */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {showDashboard && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Dashboard progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Path Visualization */}
        {suggestedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <PathVisualization 
              path={suggestedPath}
              onClose={() => setSuggestedPath(null)}
            />
          </motion.div>
        )}
      </main>

      {/* Resource Modal */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onComplete={() => handleCompleteResource(selectedResource)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;