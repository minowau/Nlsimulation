import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load extracted data
const extractedDataPath = path.join(__dirname, 'data', 'extracted_data.json');
let extractedData = {};

try {
  const data = fs.readFileSync(extractedDataPath, 'utf8');
  extractedData = JSON.parse(data);
} catch (error) {
  console.error('Error loading extracted data:', error);
}

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Adaptive Learning Platform API Server',
    status: 'running',
    endpoints: [
      'GET /api/resources',
      'GET /api/learner-progress', 
      'POST /api/complete',
      'POST /api/suggest-path',
      'POST /api/reset-progress'
    ]
  });
});

// In-memory storage for learner progress
let learnerProgress = {
  completedResources: new Set(),
  currentPosition: { x: 0, y: 0 },
  totalResources: Object.keys(extractedData).length,
  score: 0,
  pathHistory: []
};

// Mock DQN model simulation
class MockDQNModel {
  constructor() {
    this.gridSizeX = 20;
    this.gridSizeY = 20;
  }

  predictPath(currentPos, completedResources) {
    // Simple pathfinding simulation - move towards nearest unvisited resource
    const resources = this.getResourcePositions();
    const unvisited = resources.filter(r => !completedResources.has(r.name));
    
    if (unvisited.length === 0) {
      return [{ x: this.gridSizeX - 1, y: this.gridSizeY - 1, action: 'goal' }];
    }

    // Find nearest unvisited resource
    let nearest = unvisited[0];
    let minDistance = this.calculateDistance(currentPos, nearest);

    unvisited.forEach(resource => {
      const distance = this.calculateDistance(currentPos, resource);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = resource;
      }
    });

    // Generate path towards nearest resource
    return this.generatePathTo(currentPos, nearest);
  }

  getResourcePositions() {
    const SCALE = 100;
    const resources = [];
    
    for (const [name, data] of Object.entries(extractedData)) {
      const x = Math.floor(parseFloat(data.x_coordinate) * SCALE);
      const y = Math.floor(parseFloat(data.y_coordinate) * SCALE);
      resources.push({ name, x, y });
    }

    // Normalize positions
    if (resources.length > 0) {
      const minX = Math.min(...resources.map(r => r.x));
      const minY = Math.min(...resources.map(r => r.y));
      
      return resources.map(r => ({
        ...r,
        x: r.x - minX,
        y: r.y - minY
      }));
    }

    return resources;
  }

  calculateDistance(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  generatePathTo(start, target) {
    const path = [];
    let current = { ...start };

    // Simple pathfinding - move right then up
    while (current.x !== target.x || current.y !== target.y) {
      if (current.x < target.x) {
        current.x++;
        path.push({ ...current, action: 'right' });
      } else if (current.x > target.x) {
        current.x--;
        path.push({ ...current, action: 'left' });
      } else if (current.y < target.y) {
        current.y++;
        path.push({ ...current, action: 'up' });
      } else if (current.y > target.y) {
        current.y--;
        path.push({ ...current, action: 'down' });
      }

      if (path.length > 50) break; // Prevent infinite loops
    }

    return path;
  }
}

const dqnModel = new MockDQNModel();

// Routes

// Get all resources with their positions and completion status
app.get('/api/resources', (req, res) => {
  try {
    const resources = dqnModel.getResourcePositions().map(resource => ({
      ...resource,
      completed: learnerProgress.completedResources.has(resource.name),
      type: resource.name.toLowerCase().includes('quiz') ? 'quiz' : 
            resource.name.toLowerCase().includes('tutorial') ? 'tutorial' : 'lecture'
    }));

    res.json({
      resources,
      gridSize: { x: dqnModel.gridSizeX, y: dqnModel.gridSizeY }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Mark a resource as completed
app.post('/api/complete', (req, res) => {
  try {
    const { resourceName, position } = req.body;
    
    if (!resourceName) {
      return res.status(400).json({ error: 'Resource name is required' });
    }

    learnerProgress.completedResources.add(resourceName);
    learnerProgress.currentPosition = position || learnerProgress.currentPosition;
    learnerProgress.score += 10;

    res.json({
      success: true,
      progress: {
        completed: learnerProgress.completedResources.size,
        total: learnerProgress.totalResources,
        score: learnerProgress.score
      }
    });
  } catch (error) {
    console.error('Error completing resource:', error);
    res.status(500).json({ error: 'Failed to complete resource' });
  }
});

// Get suggested learning path using DQN model
app.post('/api/suggest-path', (req, res) => {
  try {
    const { currentPosition } = req.body;
    
    const suggestedPath = dqnModel.predictPath(
      currentPosition || learnerProgress.currentPosition,
      learnerProgress.completedResources
    );

    learnerProgress.pathHistory.push({
      timestamp: new Date().toISOString(),
      path: suggestedPath,
      fromPosition: currentPosition || learnerProgress.currentPosition
    });

    res.json({
      suggestedPath,
      confidence: 0.85 + Math.random() * 0.1, // Mock confidence score
      reasoning: "Path optimized based on your learning progress and resource dependencies"
    });
  } catch (error) {
    console.error('Error generating path suggestion:', error);
    res.status(500).json({ error: 'Failed to generate path suggestion' });
  }
});

// Get learner progress and statistics
app.get('/api/learner-progress', (req, res) => {
  try {
    const completedArray = Array.from(learnerProgress.completedResources);
    const progressPercentage = (completedArray.length / learnerProgress.totalResources) * 100;

    res.json({
      completedResources: completedArray,
      totalResources: learnerProgress.totalResources,
      progressPercentage: Math.round(progressPercentage),
      currentPosition: learnerProgress.currentPosition,
      score: learnerProgress.score,
      pathHistory: learnerProgress.pathHistory.slice(-5), // Last 5 paths
      achievements: [
        { name: "First Steps", unlocked: completedArray.length >= 1 },
        { name: "Getting Started", unlocked: completedArray.length >= 5 },
        { name: "Making Progress", unlocked: completedArray.length >= 10 },
        { name: "Dedicated Learner", unlocked: completedArray.length >= 20 },
        { name: "Expert", unlocked: completedArray.length >= 50 }
      ]
    });
  } catch (error) {
    console.error('Error fetching learner progress:', error);
    res.status(500).json({ error: 'Failed to fetch learner progress' });
  }
});

// Reset progress (for demo purposes)
app.post('/api/reset-progress', (req, res) => {
  learnerProgress = {
    completedResources: new Set(),
    currentPosition: { x: 0, y: 0 },
    totalResources: Object.keys(extractedData).length,
    score: 0,
    pathHistory: []
  };

  res.json({ success: true, message: 'Progress reset successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/resources',
      'GET /api/learner-progress',
      'POST /api/complete',
      'POST /api/suggest-path',
      'POST /api/reset-progress'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📚 Loaded ${Object.keys(extractedData).length} learning resources`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/*`);
});