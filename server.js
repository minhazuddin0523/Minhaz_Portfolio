import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Candidates for portfolio root directory
const candidateDirs = [
  path.join(__dirname, 'minhaz.github.io-master'),
  __dirname
];

// Determine directory containing index.html
const primaryDir = candidateDirs.find(dir => fs.existsSync(path.join(dir, 'index.html'))) || candidateDirs[0];

// Serve static assets from all existing candidate directories
candidateDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    app.use(express.static(dir));
  }
});

// Fallback to serve index.html for virtual or root routing
app.get('*', (req, res) => {
  const targetHtml = path.join(primaryDir, 'index.html');
  if (fs.existsSync(targetHtml)) {
    res.sendFile(targetHtml);
  } else {
    const fallback = candidateDirs.map(d => path.join(d, 'index.html')).find(f => fs.existsSync(f));
    if (fallback) {
      res.sendFile(fallback);
    } else {
      res.status(404).send('index.html not found');
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server is running locally on http://0.0.0.0:${PORT}`);
});

