export interface Resource {
  name: string;
  x: number;
  y: number;
  completed: boolean;
  type: 'lecture' | 'tutorial' | 'quiz';
  prerequisites?: string[];
  available?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface LearnerProgress {
  completedResources: string[];
  totalResources: number;
  progressPercentage: number;
  currentPosition: Position;
  score: number;
  pathHistory: PathHistory[];
  achievements: Achievement[];
  currentGoal?: string;
  sessionTime?: number;
  availableResources?: number;
}

export interface PathHistory {
  timestamp: string;
  path: PathStep[];
  fromPosition: Position;
  goal?: string;
  confidence?: number;
}

export interface PathStep {
  x: number;
  y: number;
  action: string;
  step?: number;
  confidence?: number;
}

export interface Achievement {
  name: string;
  unlocked: boolean;
  unlockedAt?: string;
  description?: string;
}

export interface SuggestedPath {
  suggestedPath: PathStep[];
  confidence: number;
  reasoning: string;
  goal?: string;
  nextResource?: string;
  availableResources?: number;
}

export interface GridSize {
  x: number;
  y: number;
}

export interface PrerequisiteInfo {
  resource: string;
  prerequisites: string[];
  prerequisitesMet: boolean;
  completed: boolean;
}

export interface LearningGoal {
  id: string;
  name: string;
  description: string;
  resources: string[];
  estimatedTime: number;
}