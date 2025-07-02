export interface Resource {
  name: string;
  x: number;
  y: number;
  completed: boolean;
  type: 'lecture' | 'tutorial' | 'quiz';
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
}

export interface PathHistory {
  timestamp: string;
  path: PathStep[];
  fromPosition: Position;
}

export interface PathStep {
  x: number;
  y: number;
  action: string;
}

export interface Achievement {
  name: string;
  unlocked: boolean;
}

export interface SuggestedPath {
  suggestedPath: PathStep[];
  confidence: number;
  reasoning: string;
}

export interface GridSize {
  x: number;
  y: number;
}