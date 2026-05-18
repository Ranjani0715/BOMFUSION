import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "BOMfusionAI-Enterprise-Ready" });
  });

  // Simulated AI Engine Endpoints
  app.post("/api/ai/classify", (req, res) => {
    // Artificial delay to simulate heavy processing
    setTimeout(() => {
      res.json({ status: "success", timestamp: new Date().toISOString() });
    }, 1500);
  });

  app.post("/api/ai/generate-mbom", (req, res) => {
    setTimeout(() => {
      res.json({ status: "success", stationCount: 5 });
    }, 2000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BOMfusionAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
