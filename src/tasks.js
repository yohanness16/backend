const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/tasks', async (req, res) => {
    try {
        const { status } = req.query;
        const tasks = await db.getTasks(status);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
    }
    try {
        const newTask = await db.addTask(title);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTask = await db.updateTask(Number(id));
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const success = await db.deleteTask(Number(id));
        if (!success) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;