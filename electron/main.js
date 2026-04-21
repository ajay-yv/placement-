import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
const PORT = 4000;

// Simple static file server for production
function startLocalServer() {
    const server = http.createServer((req, res) => {
        // Remove query strings or hashes from URL
        const urlPath = req.url.split('?')[0].split('#')[0];
        let filePath = path.join(__dirname, '../dist', urlPath === '/' ? 'index.html' : urlPath);

        // Basic MIME type handling
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // SPA routing: fallback to index.html
                    fs.readFile(path.join(__dirname, '../dist/index.html'), (err, indexContent) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error loading index.html');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(indexContent, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    server.listen(PORT, 'localhost');
    console.log(`Server running at http://localhost:${PORT}`);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, '../public/icon.png'),
    });

    const startUrl = process.env.ELECTRON_START_URL;

    if (startUrl) {
        mainWindow.loadURL(startUrl);
    } else {
        // Start local server and load from localhost in production
        startLocalServer();
        mainWindow.loadURL(`http://localhost:${PORT}`);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
