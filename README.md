# 📋 To-Do List Application

A modern, feature-rich to-do list application with local storage functionality. Built with vanilla HTML, CSS, and JavaScript—no dependencies required!

## ✨ Features

### Core Functionality
- ✅ **Add Tasks** - Create new tasks with custom categories
- 📝 **Edit Tasks** - Modify task text inline
- 🗑️ **Delete Tasks** - Remove tasks you no longer need
- ✔️ **Mark Complete** - Toggle task completion status
- 💾 **Local Storage** - All tasks persist in browser storage

### Advanced Features
- 🎯 **Priority Levels** - Set tasks as low, medium, or high priority
- 📂 **Categories** - Organize tasks: Personal, Work, Shopping, Health, Other
- 🔍 **Filtering** - Filter by status (active/completed) or category
- 📊 **Statistics** - View total, completed, and remaining tasks
- 🔄 **Sort by Priority** - Automatically arrange tasks by priority
- 🧹 **Clear Completed** - Remove all completed tasks at once
- 📅 **Date Display** - See when tasks were created
- 📱 **Responsive Design** - Works perfectly on mobile and desktop

## 🚀 Getting Started

### Prerequisites
No installation required! Just a modern web browser.

### Usage
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding tasks!

## 📖 How to Use

### Adding a Task
1. Type your task in the input field
2. Select a category from the dropdown
3. Click "Add Task" or press Enter
4. Task appears in the list immediately

### Managing Tasks
- **Complete a Task**: Check the checkbox next to the task
- **Edit a Task**: Click the ✏️ button to edit inline
- **Change Priority**: Click the priority indicator (🔴🟡🟢) to cycle through levels
- **Delete a Task**: Click the ✕ button to remove

### Filtering
Click filter buttons to view:
- **All** - Show all tasks
- **Active** - Show only incomplete tasks
- **Completed** - Show only finished tasks
- **Category** - Filter by specific category

### Other Actions
- **Sort by Priority** - Organize tasks by importance
- **Clear Completed** - Remove all finished tasks

## 🏗️ Architecture

### Files
- **index.html** - Main HTML structure
- **styles.css** - Complete styling and responsive design
- **app.js** - Main application controller
- **storage.js** - Local storage management

### Key Classes

#### StorageManager
Handles all local storage operations:
```javascript
const storage = new StorageManager();
storage.addTask({ text: 'Buy groceries', category: 'shopping' });
storage.getAllTasks();
storage.updateTask(id, { completed: true });
storage.deleteTask(id);
```

#### TodoApp
Manages the UI and user interactions:
```javascript
const app = new TodoApp();
app.handleAddTask();
app.handleToggleTask(id);
app.render();
```

## 💾 Local Storage Structure

Tasks are stored as JSON objects:
```json
{
  "id": 1234567890,
  "text": "Buy groceries",
  "category": "shopping",
  "completed": false,
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;      /* Blue */
    --success-color: #27ae60;       /* Green */
    --danger-color: #e74c3c;        /* Red */
    --warning-color: #f39c12;       /* Orange */
}
```

### Add New Categories
1. Add option to select in `index.html`
2. Add icon to `getCategoryIcon()` in `app.js`
3. Update CSS if needed

## 🔧 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💡 Tips & Tricks

- **Keyboard Shortcuts**: Press Enter to add tasks, Escape to cancel edits
- **Offline**: App works completely offline using local storage
- **No Data Loss**: Tasks persist even after closing the browser
- **Clear Data**: Open DevTools → Application → Local Storage → Delete entry

## 📈 Future Enhancements

- [ ] Subtasks support
- [ ] Due dates and reminders
- [ ] Task search
- [ ] Recurring tasks
- [ ] Export/Import functionality
- [ ] Dark mode toggle
- [ ] Cloud sync
- [ ] Task notes/descriptions

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📧 Feedback

Have suggestions or found a bug? Please open an issue on GitHub.

---

**Made with ❤️ for productivity lovers**