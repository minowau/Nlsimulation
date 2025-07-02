import torch
import torch.nn as nn
import numpy as np
import os
from pathlib import Path

class DQN(nn.Module):
    """
    Deep Q-Network for adaptive learning path prediction
    Input: One-hot encoded learner position on 10x10 grid (100-dimensional vector)
    Output: Q-values for 2 actions [UP, RIGHT]
    """
    def __init__(self, state_size=100, action_size=2):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_size, 128)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(128, action_size)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

class DQNPathPredictor:
    """
    Wrapper class for DQN model inference and path prediction
    """
    def __init__(self, model_path="backend/models/model3.pth", grid_size=10):
        self.grid_size = grid_size
        self.state_size = grid_size * grid_size
        self.action_size = 2  # UP, RIGHT
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load the trained model
        self.model = self._load_model(model_path)
        
        # Action mappings
        self.actions = {
            0: "UP",
            1: "RIGHT"
        }
        
    def _load_model(self, model_path):
        """Load the trained DQN model"""
        try:
            model = DQN(self.state_size, self.action_size).to(self.device)
            
            # Check if model file exists
            if os.path.exists(model_path):
                model.load_state_dict(torch.load(model_path, map_location=self.device))
                print(f"✅ Loaded trained model from {model_path}")
            else:
                print(f"⚠️  Model file {model_path} not found, using randomly initialized model")
                
            model.eval()
            return model
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            # Return a randomly initialized model as fallback
            model = DQN(self.state_size, self.action_size).to(self.device)
            model.eval()
            return model
    
    def position_to_state(self, position):
        """Convert grid position to one-hot encoded state vector"""
        x, y = position['x'], position['y']
        
        # Ensure position is within grid bounds
        x = max(0, min(x, self.grid_size - 1))
        y = max(0, min(y, self.grid_size - 1))
        
        # Create one-hot encoded state
        state = torch.zeros(self.state_size, device=self.device)
        idx = y * self.grid_size + x
        state[idx] = 1.0
        
        return state.unsqueeze(0)  # Add batch dimension
    
    def get_next_action(self, position):
        """Get next action from DQN model"""
        try:
            state = self.position_to_state(position)
            
            with torch.no_grad():
                q_values = self.model(state)
                action = torch.argmax(q_values, dim=1).item()
                
            return action, self.actions[action]
        except Exception as e:
            print(f"Error in get_next_action: {e}")
            # Fallback to random action
            action = np.random.choice([0, 1])
            return action, self.actions[action]
    
    def predict_path(self, start_position, goal_position, max_steps=50):
        """
        Predict learning path using DQN model
        Returns list of positions and actions
        """
        path = []
        current_pos = start_position.copy()
        
        for step in range(max_steps):
            # Get next action from model
            action_idx, action_name = self.get_next_action(current_pos)
            
            # Apply action to get next position
            next_pos = self._apply_action(current_pos, action_idx)
            
            # Add to path
            path.append({
                'x': next_pos['x'],
                'y': next_pos['y'],
                'action': action_name,
                'step': step + 1
            })
            
            # Update current position
            current_pos = next_pos
            
            # Check if goal reached
            if self._is_goal_reached(current_pos, goal_position):
                break
                
        return path
    
    def _apply_action(self, position, action):
        """Apply action to position and return new position"""
        x, y = position['x'], position['y']
        
        if action == 0:  # UP
            y = min(y + 1, self.grid_size - 1)
        elif action == 1:  # RIGHT
            x = min(x + 1, self.grid_size - 1)
            
        return {'x': x, 'y': y}
    
    def _is_goal_reached(self, current_pos, goal_pos):
        """Check if current position matches goal position"""
        return current_pos['x'] == goal_pos['x'] and current_pos['y'] == goal_pos['y']
    
    def get_confidence_score(self, position):
        """Get confidence score for current position"""
        try:
            state = self.position_to_state(position)
            
            with torch.no_grad():
                q_values = self.model(state)
                # Use max Q-value as confidence indicator
                max_q = torch.max(q_values).item()
                # Normalize to 0-1 range using sigmoid
                confidence = torch.sigmoid(torch.tensor(max_q)).item()
                
            return confidence
        except Exception as e:
            print(f"Error calculating confidence: {e}")
            return 0.5  # Default confidence