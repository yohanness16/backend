document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const errorMessage = document.getElementById('error-message');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // Fetch and display tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/tasks${currentFilter !== 'all' ? `?status=${currentFilter}` : ''}`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <span>${task.title}</span>
                    <div>
                        ${!task.completed ? `<button class="complete-btn" data-id="${task.id}">Complete</button>` : ''}
                        <button class="delete-btn" data-id="${task.id}">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        } catch (error) {
            showError(error.message);
        }
    };

    // Add task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) {
            showError('Task title is required');
            return;
        }
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to add task');
            taskInput.value = '';
            errorMessage.style.display = 'none';
            fetchTasks();
        } catch (error) {
            showError(error.message);
        }
    });

    // Complete or delete task
    taskList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        try {
            if (e.target.classList.contains('complete-btn')) {
                const response = await fetch(`/api/tasks/${id}`, { method: 'PUT' });
                if (!response.ok) throw new Error('Failed to update task');
            } else if (e.target.classList.contains('delete-btn')) {
                const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete task');
            }
            fetchTasks();
        } catch (error) {
            showError(error.message);
        }
    });

    // Filter tasks
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            fetchTasks();
        });
    });

    // Show error message
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    };

    // Initial fetch
    fetchTasks();
});