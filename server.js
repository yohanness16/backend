const express = require('express');
const path = require('path');
const taskRoutes = require('./src/tasks');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    extensions: ['html']
}));

app.use('/api', taskRoutes);

app.get('*', (req, res, next) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    try {
        fs.accessSync(indexPath);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error(`Error serving index.html: ${err.message}`);
                next(err);
            }
        });
    } catch (err) {
        console.error(`File not found: ${indexPath}`);
        res.status(404).send('404: index.html not found');
    }
});

app.use((err, req, res, next) => {
    console.error(`Server error: ${err.stack}`);
    res.status(500).send('500: Internal Server Error');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        app.listen(PORT + 1, () => {
            console.log(`Server running on http://localhost:${PORT + 1}`);
        });
    } else {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
});