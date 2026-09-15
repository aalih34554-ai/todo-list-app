/**
 * To-Do List Application Main Controller
 */

class TodoApp {
    constructor() {
        this.storage = new StorageManager();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.sortBtn = document.getElementById('sortBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');
        this.remainingTasksSpan = document.getElementById('remainingTasks');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.handleAddTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTask();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());

        // Sort
        this.sortBtn.addEventListener('click', () => this.handleSort());

        // Filters
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Prevent form submission if needed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editingTaskId) {
                this.cancelEdit();
            }
        });
    }

    /**
     * Handle adding a new task
     */
    handleAddTask() {
        const text = this.taskInput.value.trim();
        const category = this.categorySelect.value;

        if (!text) {
            alert('Please enter a task!');
            return;
        }

        this.storage.addTask({ text, category });
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    }

    /**
     * Handle task completion toggle
     */
    handleToggleTask(id) {
        this.storage.toggleTaskCompletion(id);
        this.render();
    }

    /**
     * Handle task deletion
     */
    handleDeleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.storage.deleteTask(id);
            this.render();
        }
    }

    /**
     * Handle task priority toggle
     */
    handleTogglePriority(id) {
        this.storage.toggleTaskPriority(id);
        this.render();
    }

    /**
     * Handle edit task
     */
    handleEditTask(id) {
        if (this.editingTaskId) this.cancelEdit();
        
        this.editingTaskId = id;
        const tasks = this.storage.getAllTasks();
        const task = tasks.find(t => t.id === id);
        
        if (!task) return;
        
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (!taskElement) return;
        
        taskElement.classList.add('editing');
        
        const taskContent = taskElement.querySelector('.task-content');
        taskContent.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(task.text)}">
            <div style="display: flex; gap: 5px;">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        
        const editInput = taskContent.querySelector('.edit-input');
        const saveBtn = taskContent.querySelector('.save-btn');
        const cancelBtn = taskContent.querySelector('.cancel-btn');
        
        editInput.focus();
        editInput.select();
        
        saveBtn.addEventListener('click', () => this.saveEdit(id, editInput.value));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
        
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEdit(id, editInput.value);
        });
    }

    /**
     * Save task edit
     */
    saveEdit(id, newText) {
        if (!newText.trim()) {
            alert('Task cannot be empty!');
            return;
        }
        
        this.storage.updateTask(id, { text: newText.trim() });
        this.editingTaskId = null;
        this.render();
    }

    /**
     * Cancel edit
     */
    cancelEdit() {
        this.editingTaskId = null;
        this.render();
    }

    /**
     * Handle clearing completed tasks
     */
    handleClearCompleted() {
        const count = this.storage.getFilteredTasks('completed').length;
        if (count === 0) {
            alert('No completed tasks to clear!');
            return;
        }
        
        if (confirm(`Delete ${count} completed task(s)?`)) {
            this.storage.clearCompletedTasks();
            this.render();
        }
    }

    /**
     * Handle sorting
     */
    handleSort() {
        const tasks = this.storage.getTasksSortedByPriority();
        this.storage.saveTasks(tasks);
        this.render();
    }

    /**
     * Handle filter change
     */
    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = this.storage.getStatistics();
        this.totalTasksSpan.textContent = stats.total;
        this.completedTasksSpan.textContent = stats.completed;
        this.remainingTasksSpan.textContent = stats.remaining;
    }

    /**
     * Get category icon
     */
    getCategoryIcon(category) {
        const icons = {
            'personal': '👤',
            'work': '💼',
            'shopping': '🛒',
            'health': '🏥',
            'other': '📌'
        };
        return icons[category] || '📌';
    }

    /**
     * Get priority indicator
     */
    getPriorityIcon(priority) {
        const icons = {
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        };
        return icons[priority] || '🟡';
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    /**
     * Render the task list
     */
    render() {
        this.updateStats();
        
        const tasks = this.currentFilter === 'all' 
            ? this.storage.getAllTasks()
            : this.storage.getFilteredTasks(this.currentFilter);
        
        if (tasks.length === 0) {
            this.taskList.innerHTML = '<li class="empty-state"><p>✨ No tasks yet. Add one to get started!</p></li>';
            this.taskList.dataset.empty = 'true';
            return;
        }
        
        this.taskList.dataset.empty = 'false';
        this.taskList.innerHTML = tasks.map(task => this.createTaskElement(task)).join('');
        
        // Attach event listeners to task elements
        this.attachTaskEventListeners();
    }

    /**
     * Create task element HTML
     */
    createTaskElement(task) {
        const completedClass = task.completed ? 'completed' : '';
        const priorityClass = `${task.priority}-priority`;
        
        return `
            <li class="task-item ${completedClass} ${priorityClass}" data-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                >
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-category">${this.getCategoryIcon(task.category)} ${task.category}</span>
                        <span class="task-date">${this.formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn priority-btn" title="Priority: ${task.priority}">
                        ${this.getPriorityIcon(task.priority)}
                    </button>
                    <button class="task-btn edit-btn" title="Edit task">✏️</button>
                    <button class="task-btn delete-btn" title="Delete task">✕</button>
                </div>
            </li>
        `;
    }

    /**
     * Attach event listeners to task elements
     */
    attachTaskEventListeners() {
        document.querySelectorAll('.task-item').forEach(taskElement => {
            const taskId = parseInt(taskElement.dataset.id);
            
            const checkbox = taskElement.querySelector('.task-checkbox');
            const priorityBtn = taskElement.querySelector('.priority-btn');
            const editBtn = taskElement.querySelector('.edit-btn');
            const deleteBtn = taskElement.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => this.handleToggleTask(taskId));
            priorityBtn.addEventListener('click', () => this.handleTogglePriority(taskId));
            editBtn.addEventListener('click', () => this.handleEditTask(taskId));
            deleteBtn.addEventListener('click', () => this.handleDeleteTask(taskId));
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});