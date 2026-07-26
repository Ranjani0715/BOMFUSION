import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPythonCmd = () => {
  if (process.env.PYTHON_CMD) return process.env.PYTHON_CMD;
  return process.platform === 'win32' ? 'python' : 'python3';
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Express + Python 3.10 Data Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // Python eBOM Processor API
  app.post('/api/python/process-ebom', (req, res) => {
    const components = req.body.components || [];
    const scriptPath = path.join(process.cwd(), 'scripts', 'ebom_processor.py');
    const payload = JSON.stringify({ components });

    execFile(getPythonCmd(), [scriptPath, payload], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python ebom_processor error:', stderr || error.message);
        return res.status(500).json({
          error: 'Python processing error',
          details: stderr || error.message,
        });
      }

      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (e) {
        return res.status(500).json({
          error: 'Failed to parse Python script output',
          rawOutput: stdout,
        });
      }
    });
  });

  // Python Line Balancer API
  app.post('/api/python/line-balance', (req, res) => {
    const { operations, taktTime, stations } = req.body;
    const scriptPath = path.join(process.cwd(), 'scripts', 'line_balancer.py');
    const payload = JSON.stringify({ operations, taktTime, stations });

    execFile(getPythonCmd(), [scriptPath, payload], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python line_balancer error:', stderr || error.message);
        return res.status(500).json({
          error: 'Python line balancing error',
          details: stderr || error.message,
        });
      }

      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (e) {
        return res.status(500).json({
          error: 'Failed to parse Python line balancer output',
          rawOutput: stdout,
        });
      }
    });
  });

  // Python Intelligent NLP Classifier API
  app.post('/api/python/classify-ebom', (req, res) => {
    const components = req.body.components || [];
    const scriptPath = path.join(process.cwd(), 'scripts', 'classifier_engine.py');
    const payload = JSON.stringify({ components });

    execFile(getPythonCmd(), [scriptPath, payload], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python classifier error:', stderr || error.message);
        return res.status(500).json({
          error: 'Python classifier error',
          details: stderr || error.message,
        });
      }

      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (e) {
        return res.status(500).json({
          error: 'Failed to parse Python classifier output',
          rawOutput: stdout,
        });
      }
    });
  });

  // Python SPC Quality Engine API
  app.post('/api/python/quality-spc', (req, res) => {
    const checkpoints = req.body.checkpoints || [];
    const scriptPath = path.join(process.cwd(), 'scripts', 'quality_spc_engine.py');
    const payload = JSON.stringify({ checkpoints });

    execFile(getPythonCmd(), [scriptPath, payload], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python quality_spc error:', stderr || error.message);
        return res.status(500).json({
          error: 'Python SPC error',
          details: stderr || error.message,
        });
      }

      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (e) {
        return res.status(500).json({
          error: 'Failed to parse Python SPC output',
          rawOutput: stdout,
        });
      }
    });
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} with Python 3.10 Engine`);
  });
}

startServer();
