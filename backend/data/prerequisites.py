"""
Prerequisites and learning path dependencies for adaptive learning
"""

# Define prerequisite relationships between learning resources
PREREQUISITES = {
    # Basic Logic Foundation
    "Logical Equivalence": ["Introduction to Mathematical Logic"],
    "Rules of Inference": ["Introduction to Mathematical Logic", "Logical Equivalence"],
    "Resolution": ["Logical Equivalence", "Rules of Inference"],
    "SAT Problem": ["Logical Equivalence", "Rules of Inference"],
    
    # Tutorials build on previous concepts
    "Tutorial 1: Part I": ["Introduction to Mathematical Logic", "Logical Equivalence"],
    "Tutorial 1: Part II": ["Tutorial 1: Part I", "Rules of Inference"],
    
    # Predicate Logic
    "Predicate Logic": ["Rules of Inference", "Resolution"],
    "Rules of Inferences in Predicate Logic": ["Predicate Logic"],
    
    # Proof Strategies
    "Proof Strategies I": ["Rules of Inference", "Predicate Logic"],
    "Proof Strategies II": ["Proof Strategies I"],
    "Induction": ["Proof Strategies I"],
    
    # Tutorial 2
    "Tutorial 2: Part I": ["Predicate Logic", "Proof Strategies I"],
    "Tutorial 2: Part II": ["Tutorial 2: Part I", "Induction"],
    
    # Set Theory
    "Sets": ["Introduction to Mathematical Logic"],
    "Relations": ["Sets"],
    "Operations on Relations": ["Relations"],
    "Transitive Closure of Relations": ["Relations", "Operations on Relations"],
    "Warshall's Algorithm for Computing Transitive Closure": ["Transitive Closure of Relations"],
    
    # Tutorial 3
    "Tutorial 3": ["Relations", "Operations on Relations"],
    
    # Advanced Relations
    "Equivalence Relation": ["Relations", "Operations on Relations"],
    "Equivalence Relations and Partitions": ["Equivalence Relation"],
    "Partial Ordering": ["Relations", "Equivalence Relation"],
    "Functions": ["Relations", "Sets"],
    
    # Tutorial 4
    "Tutorial 4: Part I": ["Equivalence Relation", "Functions"],
    "Tutorial 4: Part II": ["Tutorial 4: Part I", "Partial Ordering"],
    
    # Cardinality
    "Countable and Uncountable Sets": ["Sets", "Functions"],
    "Examples of Countably Infinite Sets": ["Countable and Uncountable Sets"],
    "Cantor's Diagonalization Argument": ["Countable and Uncountable Sets"],
    "Uncomputable Functions": ["Functions", "Cantor's Diagonalization Argument"],
    
    # Tutorial 5
    "Tutorial 5": ["Countable and Uncountable Sets", "Functions"],
    
    # Combinatorics
    "Basic Rules of Counting": ["Sets"],
    "Permutation and Combination": ["Basic Rules of Counting"],
    "Counting Using Recurrence Equations": ["Permutation and Combination"],
    "Solving Linear Homogeneous Recurrence Equations - Part I": ["Counting Using Recurrence Equations"],
    "Solving Linear Homogeneous Recurrence Equations - Part II": ["Solving Linear Homogeneous Recurrence Equations - Part I"],
    
    # Tutorial 6
    "Tutorial 6: Part I": ["Permutation and Combination"],
    "Tutorial 6: Part II": ["Tutorial 6: Part I", "Counting Using Recurrence Equations"],
    
    # Advanced Combinatorics
    "Solving Linear Non-Homogeneous Recurrence Equations": ["Solving Linear Homogeneous Recurrence Equations - Part II"],
    "Catalan Numbers": ["Counting Using Recurrence Equations"],
    "Catalan Numbers - Derivation of Closed Form Formula": ["Catalan Numbers"],
    "Counting Using Principle of Inclusion-Exclusion": ["Basic Rules of Counting", "Permutation and Combination"],
    
    # Tutorial 7
    "Tutorial 7": ["Catalan Numbers", "Counting Using Principle of Inclusion-Exclusion"],
    
    # Graph Theory
    "Graph Theory Basics": ["Sets", "Relations"],
    "Matching": ["Graph Theory Basics"],
    "Proof of Hall's Marriage Theorem": ["Matching"],
    "Various Operations on Graphs": ["Graph Theory Basics"],
    "Vertex and Edge Connectivity": ["Graph Theory Basics", "Various Operations on Graphs"],
    
    # Tutorial 8
    "Tutorial 8": ["Graph Theory Basics", "Matching"],
    
    # Advanced Graph Theory
    "Euler Path and Euler Circuit": ["Graph Theory Basics", "Vertex and Edge Connectivity"],
    "Hamiltonian Circuit": ["Graph Theory Basics", "Euler Path and Euler Circuit"],
    "Vertex and Edge Coloring": ["Graph Theory Basics", "Various Operations on Graphs"],
    
    # Tutorial 9
    "Tutorial 9: Part I": ["Euler Path and Euler Circuit", "Hamiltonian Circuit"],
    "Tutorial 9: Part II": ["Tutorial 9: Part I", "Vertex and Edge Coloring"],
    
    # Number Theory
    "Modular Arithmetic": ["Basic Rules of Counting"],
    "Prime Numbers and GCD": ["Modular Arithmetic"],
    "Properties of GCD and Bézout's Theorem": ["Prime Numbers and GCD"],
    "Linear Congruence Equations and Chinese Remainder Theorem": ["Properties of GCD and Bézout's Theorem"],
    "Uniqueness Proof of the CRT": ["Linear Congruence Equations and Chinese Remainder Theorem"],
    "Fermat's Little Theorem, Primality Testing and Carmichael Numbers": ["Prime Numbers and GCD", "Modular Arithmetic"],
    
    # Abstract Algebra
    "Group Theory": ["Modular Arithmetic", "Properties of GCD and Bézout's Theorem"],
    "Cyclic Groups": ["Group Theory"],
    "Subgroups": ["Group Theory"],
    "More Applications of Groups": ["Cyclic Groups", "Subgroups"],
    "Discrete Logarithm and Cryptographic Applications": ["Cyclic Groups", "Fermat's Little Theorem, Primality Testing and Carmichael Numbers"],
    
    # Field Theory
    "Rings, Fields and Polynomials": ["Group Theory"],
    "Polynomials Over Fields and Properties": ["Rings, Fields and Polynomials"],
    "Finite Fields and Properties I": ["Rings, Fields and Polynomials"],
    "Finite Fields and Properties II": ["Finite Fields and Properties I", "Polynomials Over Fields and Properties"],
    "Primitive Element of a Finite Field": ["Finite Fields and Properties I"],
    "Applications of Finite Fields": ["Finite Fields and Properties II", "Primitive Element of a Finite Field"]
}

# Learning paths for different goals
LEARNING_PATHS = {
    "basic_logic": [
        "Introduction to Mathematical Logic",
        "Logical Equivalence", 
        "Rules of Inference",
        "Tutorial 1: Part I",
        "Tutorial 1: Part II"
    ],
    "predicate_logic": [
        "Introduction to Mathematical Logic",
        "Logical Equivalence",
        "Rules of Inference", 
        "Predicate Logic",
        "Rules of Inferences in Predicate Logic",
        "Tutorial 2: Part I"
    ],
    "set_theory": [
        "Introduction to Mathematical Logic",
        "Sets",
        "Relations", 
        "Operations on Relations",
        "Tutorial 3"
    ],
    "graph_theory": [
        "Sets",
        "Relations",
        "Graph Theory Basics",
        "Matching",
        "Euler Path and Euler Circuit",
        "Tutorial 8"
    ],
    "number_theory": [
        "Basic Rules of Counting",
        "Modular Arithmetic",
        "Prime Numbers and GCD",
        "Properties of GCD and Bézout's Theorem",
        "Group Theory"
    ],
    "complete_course": [
        "Introduction to Mathematical Logic",
        "Logical Equivalence",
        "Rules of Inference",
        "Predicate Logic",
        "Sets",
        "Relations",
        "Functions",
        "Basic Rules of Counting",
        "Graph Theory Basics",
        "Modular Arithmetic",
        "Group Theory",
        "Applications of Finite Fields"
    ]
}

def get_prerequisites(resource_name):
    """Get prerequisites for a specific resource"""
    return PREREQUISITES.get(resource_name, [])

def check_prerequisites_met(resource_name, completed_resources):
    """Check if all prerequisites for a resource are completed"""
    prerequisites = get_prerequisites(resource_name)
    return all(prereq in completed_resources for prereq in prerequisites)

def get_available_resources(completed_resources):
    """Get list of resources that can be taken next (prerequisites met)"""
    available = []
    all_resources = set(PREREQUISITES.keys())
    
    # Add resources with no prerequisites
    for resource in all_resources:
        if not get_prerequisites(resource):
            available.append(resource)
    
    # Add resources whose prerequisites are met
    for resource in all_resources:
        if resource not in completed_resources and check_prerequisites_met(resource, completed_resources):
            available.append(resource)
    
    return list(set(available))  # Remove duplicates

def get_learning_path(goal="complete_course"):
    """Get predefined learning path for a specific goal"""
    return LEARNING_PATHS.get(goal, LEARNING_PATHS["complete_course"])

def suggest_next_resources(completed_resources, max_suggestions=3):
    """Suggest next resources based on completed ones"""
    available = get_available_resources(completed_resources)
    # Filter out already completed resources
    suggestions = [r for r in available if r not in completed_resources]
    return suggestions[:max_suggestions]