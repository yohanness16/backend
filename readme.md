Task Manager
A simple web app to manage tasks. You can add, view, complete, and delete tasks through a browser interface. The backend uses a JSON file to store tasks, and the frontend is a basic HTML/CSS/JS setup.
Project Structure

server.js: Main backend file, sets up the Express server.
src/task.js: Defines API routes for task operations.
src/db.js: Handles task storage using data/tasks.json.
data/tasks.json: Stores tasks as JSON.
public/: Contains frontend files:
index.html: Main webpage.
css/styles.css: Styles for the UI.
js/app.js: JavaScript for frontend logic.



Requirements

Node.js (tested on v22.14.0, v20 should work too).
pnpm (package manager).

Setup

Clone or copy the project to your machine (e.g., C:\Users\yohannes\Desktop\Backend1).
Open a terminal in the project folder.
Install dependencies:pnpm install


Start the server:pnpm start

You should see:Server running on http://localhost:3000
Initialized tasks.json with sample data



Usage

Open http://localhost:3000 in your browser.
Add a task: Type in the input field and click "Add Task" or press Enter.
Filter tasks: Use the dropdown to show all, pending, or completed tasks.
Complete a task: Click "Complete" (changes to "Undo" after).
Delete a task: Click "Delete" next to a task.

API Endpoints

GET /api/tasks: Get all tasks (filter with ?status=completed or ?status=pending).
POST /api/tasks: Add a task (send JSON like {"title": "New task"}).
PUT /api/tasks/:id: Mark task as completed.
DELETE /api/tasks/:id: Delete a task.

Troubleshooting

Port conflict: If port 3000 is in use, the server tries 3001. Check with:netstat -an | findstr :3000
taskkill /PID <PID> /F


Dependency issues: Clear and reinstall:pnpm store prune
del /S /Q node_modules pnpm-lock.yaml
pnpm install


Still broken?: Check src/task.js for weird routes (like URLs) with:type src\task.js



Notes

Tasks are saved in data/tasks.json. No database needed.
No extra dependencies beyond express.
Frontend is basic but functional. Feel free to tweak public/css/styles.css for better looks.

