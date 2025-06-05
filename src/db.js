const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/tasks.json');

const initializeDatabase = async () => {
    try {
        await fs.access(DB_PATH);
    } catch (err) {
        const initialData = [
            { id: 1, title: 'Buy groceries', completed: false },
            { id: 2, title: 'Read a book', completed: true }
        ];
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
        console.log('Initialized tasks.json with sample data');
    }
};

const getTasks = async (status) => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        let tasks = JSON.parse(data);
        if (status === 'completed') {
            tasks = tasks.filter(task => task.completed);
        } else if (status === 'pending') {
            tasks = tasks.filter(task => !task.completed);
        }
        return tasks.map(task => ({
            id: task.id,
            title: task.title,
            completed: !!task.completed
        }));
    } catch (err) {
        throw new Error(`Failed to read tasks: ${err.message}`);
    }
};

const addTask = async (title) => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const tasks = JSON.parse(data);
        const newTask = {
            id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title,
            completed: false
        };
        tasks.push(newTask);
        await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
        return newTask;
    } catch (err) {
        throw new Error(`Failed to add task: ${err.message}`);
    }
};

const updateTask = async (id) => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const tasks = JSON.parse(data);
        const task = tasks.find(t => t.id === Number(id));
        if (!task) return null;
        task.completed = true;
        await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
        return { id: task.id, title: task.title, completed: task.completed };
    } catch (err) {
        throw new Error(`Failed to update task: ${err.message}`);
    }
};

const deleteTask = async (id) => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex(t => t.id === Number(id));
        if (taskIndex === -1) return false;
        tasks.splice(taskIndex, 1);
        await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
        return true;
    } catch (err) {
        throw new Error(`Failed to delete task: ${err.message}`);
    }
};

initializeDatabase().catch(err => console.error('Database initialization failed:', err));

module.exports = { getTasks, addTask, updateTask, deleteTask };