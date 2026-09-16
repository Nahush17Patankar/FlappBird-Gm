import express from "express";
import path from "path";
import net from "node:net";
import { createServer as createViteServer } from "vite";

const DEFAULT_PORT = Number(process.env.PORT || 3000);

function getAvailablePort(startPort: number, maxAttempts = 20): Promise<number> {
  return new Promise((resolve, reject) => {
    const checkPort = (port: number, attemptsLeft: number) => {
      const tester = net.createServer();

      tester.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
          checkPort(port + 1, attemptsLeft - 1);
          return;
        }

        reject(error);
      });

      tester.once("listening", () => {
        tester.close(() => resolve(port));
      });

      tester.listen(port, "0.0.0.0");
    };

    checkPort(startPort, maxAttempts);
  });
}

async function startServer() {
  const app = express();
  const PORT = await getAvailablePort(DEFAULT_PORT).catch(() => DEFAULT_PORT);

  // Ensure correct MIME type for webmanifest
  express.static.mime?.define({ "application/manifest+json": ["webmanifest"] });

  // API routes first
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
