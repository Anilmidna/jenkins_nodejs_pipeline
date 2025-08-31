// app.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

// Serve a simple homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Node CI/CD Demo</title></head>
      <body style="font-family: Arial; padding: 2rem;">
        <h1>🚀 Node.js CI/CD with Jenkins + Docker</h1>
        <p>This page is served from an Express app inside Docker on EC2.</p>
        <ul>
          <li>Health: <a href="/health">/health</a></li>
          <li>Version: <a href="/version">/version</a></li>
        </ul>
        <p>Change some text here, commit & push → Jenkins auto-deploys.</p>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Version endpoint to see updates via env var
app.get('/version', (_req, res) => {
  res.json({ version: APP_VERSION, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
