/**
 * LocalStorage Manager for To-Do List Application
 * Handles all data persistence operations
 */

class StorageManager {
    constructor(storageKey = 'todoList') {
        this.storageKey = storageKey;
        this.initializeStorage();
    }

    /**
     * Initialize storage with empty array if not exists
     */
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    /**
     * Get all tasks from storage
     * @returns {Array} Array of task objects
     */
    getAllTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error reading from storage:', error);
            return [];
        }
    }

    /**
     * Save all tasks to storage
     * @param {Array} tasks - Array of task objects
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error writing to storage:', error);
        }
    }

    /**
     * Add a new task
     * @param {Object} task - Task object
     * @returns {Object} The created task with ID
     */
    addTask(task) {
        const tasks = this.getAllTasks();
        const newTask = {
            id: Date.now(),
            text: task.text,
            category: task.category || 'personal',
            completed: false,
            priority: task.priority || 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    }

    /**
     * Update an existing task
     * @param {number} id - Task ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated task or null if not found
     */
    updateTask(id, updates) {
        const tasks = this.getAllTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) return null;
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.saveTasks(tasks);
        return tasks[taskIndex];
    }

    /**
     * Delete a task
     * @param {number} id - Task ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteTask(id) {
        const tasks = this.getAllTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        
        if (filteredTasks.length === tasks.length) return false;
        
        this.saveTasks(filteredTasks);
        return true;
    }

    /**
     * Toggle task completion status
     * @param {number} id - Task ID
     * @returns {Object|null} Updated task or null if not found
     */
    toggleTaskCompletion(id) {
        const tasks = this.getAllTasks();
        const task = tasks.find(t => t.id === id);
        
        if (!task) return null;
        
        return this.updateTask(id, { completed: !task.completed });
    }

    /**
     * Toggle task priority (cycles through low -> medium -> high -> low)
     * @param {number} id - Task ID
     * @returns {Object|null} Updated task or null if not found
     */
    toggleTaskPriority(id) {
        const tasks = this.getAllTasks();
        const task = tasks.find(t => t.id === id);
        
        if (!task) return null;
        
        const priorityCycle = { 'low': 'medium', 'medium': 'high', 'high': 'low' };
        const newPriority = priorityCycle[task.priority] || 'medium';
        
        return this.updateTask(id, { priority: newPriority });
    }

    /**
     * Get tasks filtered by status and category
     * @param {string} filter - Filter type: 'all', 'active', 'completed', or category name
     * @returns {Array} Filtered array of tasks
     */
    getFilteredTasks(filter = 'all') {
        const tasks = this.getAllTasks();
        
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'personal':
            case 'work':
            case 'shopping':
            case 'health':
            case 'other':
                return tasks.filter(task => task.category === filter);
            default:
                return tasks;
        }
    }

    /**
     * Get tasks sorted by priority and date
     * @returns {Array} Tasks sorted by priority (high -> medium -> low) then by creation date
     */
    getTasksSortedByPriority() {
        const tasks = this.getAllTasks();
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        
        return [...tasks].sort((a, b) => {
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }

    /**
     * Get tasks statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const tasks = this.getAllTasks();
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        
        return {
            total,
            completed,
            remaining: total - completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    /**
     * Clear all completed tasks
     * @returns {number} Number of tasks deleted
     */
    clearCompletedTasks() {
        const tasks = this.getAllTasks();
        const originalCount = tasks.length;
        const activeTasks = tasks.filter(t => !t.completed);
        
        this.saveTasks(activeTasks);
        return originalCount - activeTasks.length;
    }

    /**
     * Export tasks as JSON
     * @returns {string} JSON string of all tasks
     */
    exportTasks() {
        return JSON.stringify(this.getAllTasks(), null, 2);
    }

    /**
     * Import tasks from JSON
     * @param {string} jsonString - JSON string of tasks
     * @returns {boolean} True if import successful
     */
    importTasks(jsonString) {
        try {
            const tasks = JSON.parse(jsonString);
            if (Array.isArray(tasks)) {
                this.saveTasks(tasks);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing tasks:', error);
            return false;
        }
    }

    /**
     * Clear all tasks
     */
    clearAllTasks() {
        this.saveTasks([]);
    }
}