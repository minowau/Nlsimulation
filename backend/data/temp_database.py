"""
Temporary in-memory database for storing user progress and learning paths
"""

import json
import time
from datetime import datetime
from typing import Dict, List, Optional

class TempDatabase:
    """
    In-memory database for storing learning progress and paths
    """
    
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.learning_analytics = {}
        
    def create_user(self, user_id: str, initial_data: Dict = None) -> Dict:
        """Create a new user with initial progress data"""
        user_data = {
            "user_id": user_id,
            "completed_resources": [],
            "current_path": [],
            "current_goal": "complete_course",
            "current_position": {"x": 0, "y": 0},
            "score": 0,
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "session_count": 0,
            "total_time_spent": 0,
            "achievements": []
        }
        
        if initial_data:
            user_data.update(initial_data)
            
        self.users[user_id] = user_data
        return user_data
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user data by ID"""
        return self.users.get(user_id)
    
    def update_user(self, user_id: str, updates: Dict) -> Dict:
        """Update user data"""
        if user_id not in self.users:
            self.create_user(user_id)
            
        self.users[user_id].update(updates)
        self.users[user_id]["last_updated"] = datetime.now().isoformat()
        return self.users[user_id]
    
    def complete_resource(self, user_id: str, resource_name: str, position: Dict = None) -> Dict:
        """Mark a resource as completed for a user"""
        if user_id not in self.users:
            self.create_user(user_id)
            
        user = self.users[user_id]
        
        if resource_name not in user["completed_resources"]:
            user["completed_resources"].append(resource_name)
            user["score"] += 10
            
            # Update position if provided
            if position:
                user["current_position"] = position
                
            # Check for achievements
            self._check_achievements(user_id)
            
            user["last_updated"] = datetime.now().isoformat()
            
        return user
    
    def set_learning_path(self, user_id: str, path: List[str], goal: str = None) -> Dict:
        """Set the current learning path for a user"""
        if user_id not in self.users:
            self.create_user(user_id)
            
        updates = {
            "current_path": path,
            "last_updated": datetime.now().isoformat()
        }
        
        if goal:
            updates["current_goal"] = goal
            
        return self.update_user(user_id, updates)
    
    def get_progress_stats(self, user_id: str) -> Dict:
        """Get detailed progress statistics for a user"""
        user = self.get_user(user_id)
        if not user:
            return {}
            
        total_resources = 70  # Total number of resources in the system
        completed_count = len(user["completed_resources"])
        progress_percentage = (completed_count / total_resources) * 100
        
        return {
            "user_id": user_id,
            "completed_resources": user["completed_resources"],
            "total_resources": total_resources,
            "completed_count": completed_count,
            "progress_percentage": round(progress_percentage, 2),
            "current_position": user["current_position"],
            "score": user["score"],
            "current_path": user["current_path"],
            "current_goal": user["current_goal"],
            "achievements": user["achievements"],
            "session_count": user["session_count"],
            "total_time_spent": user["total_time_spent"],
            "last_updated": user["last_updated"]
        }
    
    def start_session(self, user_id: str) -> str:
        """Start a new learning session"""
        if user_id not in self.users:
            self.create_user(user_id)
            
        session_id = f"{user_id}_{int(time.time())}"
        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "start_time": datetime.now().isoformat(),
            "end_time": None,
            "resources_completed": [],
            "paths_generated": [],
            "actions_taken": []
        }
        
        self.sessions[session_id] = session_data
        
        # Update user session count
        self.users[user_id]["session_count"] += 1
        
        return session_id
    
    def end_session(self, session_id: str) -> Dict:
        """End a learning session"""
        if session_id not in self.sessions:
            return {}
            
        session = self.sessions[session_id]
        session["end_time"] = datetime.now().isoformat()
        
        # Calculate session duration
        start_time = datetime.fromisoformat(session["start_time"])
        end_time = datetime.fromisoformat(session["end_time"])
        duration = (end_time - start_time).total_seconds()
        
        # Update user's total time spent
        user_id = session["user_id"]
        if user_id in self.users:
            self.users[user_id]["total_time_spent"] += duration
            
        return session
    
    def log_path_generation(self, user_id: str, session_id: str, path_data: Dict) -> None:
        """Log path generation event"""
        if session_id in self.sessions:
            self.sessions[session_id]["paths_generated"].append({
                "timestamp": datetime.now().isoformat(),
                "path_data": path_data
            })
    
    def log_action(self, user_id: str, session_id: str, action: str, details: Dict = None) -> None:
        """Log user action"""
        if session_id in self.sessions:
            self.sessions[session_id]["actions_taken"].append({
                "timestamp": datetime.now().isoformat(),
                "action": action,
                "details": details or {}
            })
    
    def _check_achievements(self, user_id: str) -> None:
        """Check and award achievements based on progress"""
        user = self.users[user_id]
        completed_count = len(user["completed_resources"])
        current_achievements = set(user["achievements"])
        
        # Define achievements
        achievements = [
            {"name": "First Steps", "requirement": 1, "description": "Complete your first resource"},
            {"name": "Getting Started", "requirement": 5, "description": "Complete 5 resources"},
            {"name": "Making Progress", "requirement": 10, "description": "Complete 10 resources"},
            {"name": "Dedicated Learner", "requirement": 20, "description": "Complete 20 resources"},
            {"name": "Expert", "requirement": 50, "description": "Complete 50 resources"},
            {"name": "Master", "requirement": 70, "description": "Complete all resources"}
        ]
        
        # Check each achievement
        for achievement in achievements:
            if (completed_count >= achievement["requirement"] and 
                achievement["name"] not in current_achievements):
                user["achievements"].append(achievement["name"])
    
    def get_all_users(self) -> Dict:
        """Get all users (for admin/debugging)"""
        return self.users
    
    def reset_user_progress(self, user_id: str) -> Dict:
        """Reset user progress"""
        if user_id in self.users:
            self.users[user_id].update({
                "completed_resources": [],
                "current_path": [],
                "current_position": {"x": 0, "y": 0},
                "score": 0,
                "achievements": [],
                "last_updated": datetime.now().isoformat()
            })
        return self.users.get(user_id, {})
    
    def export_data(self) -> Dict:
        """Export all data for backup"""
        return {
            "users": self.users,
            "sessions": self.sessions,
            "export_timestamp": datetime.now().isoformat()
        }
    
    def import_data(self, data: Dict) -> bool:
        """Import data from backup"""
        try:
            if "users" in data:
                self.users.update(data["users"])
            if "sessions" in data:
                self.sessions.update(data["sessions"])
            return True
        except Exception as e:
            print(f"Error importing data: {e}")
            return False

# Global instance
temp_db = TempDatabase()

# Initialize default user for demo
temp_db.create_user("default_user", {
    "completed_resources": [],
    "current_goal": "complete_course",
    "current_position": {"x": 0, "y": 0}
})