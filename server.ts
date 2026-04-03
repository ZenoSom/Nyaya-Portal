import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { cases } from "./src/data/cases.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES
  
  // Get all cases
  app.get("/api/cases", (req, res) => {
    res.json(cases);
  });

  // Filter by person name
  app.get("/api/user/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const filtered = cases.filter(c => c.person_name.toLowerCase().includes(name));
    res.json(filtered);
  });

  // Return one case by ID
  app.get("/api/case/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const found = cases.find(c => c.case_id === id);
    if (found) {
      res.json(found);
    } else {
      res.status(404).json({ error: "Case not found" });
    }
  });

  // AI Logic: Generate hearing schedule
  app.get("/api/run/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const found = cases.find(c => c.case_id === id);

    if (!found) {
      return res.status(404).json({ error: "Case not found" });
    }

    const priority = found.pending_days > 200 ? "High" : "Normal";
    const schedule_days = Math.floor(Math.random() * 11) + 5; // 5-15 range
    
    const hearing_date = new Date();
    hearing_date.setDate(hearing_date.getDate() + schedule_days);
    
    const times = ["10:00 AM", "11:30 AM", "2:00 PM"];
    const hearing_time = times[Math.floor(Math.random() * times.length)];
    const courtroom = `Courtroom No. ${Math.floor(Math.random() * 20) + 1}`;

    res.json({
      priority,
      schedule_days,
      hearing_date: hearing_date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      hearing_time,
      courtroom
    });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
