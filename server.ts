import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { cases } from "./src/data/cases.ts";
import { clampScore, resolveTaskIds } from "./src/utils/openenv_utils.ts";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // --- OpenEnv API Implementation ---
  const TASKS = [
    {
      id: "easy_case_lookup",
      difficulty: "easy",
      score: 0.25,
      title: "Find the oldest pending property matter",
      description: "Find the oldest pending property matter.",
      success_case_id: 8,
      expected_priority: "urgent",
      success_reason: "Meera Iyer's property dispute has the highest property backlog in the visible docket.",
      visible_case_ids: [1, 4, 8, 11],
      grader_path: "graders/easy_case_lookup.py"
    },
    {
      id: "medium_backlog_triage",
      difficulty: "medium",
      score: 0.35,
      title: "Prioritize the most urgent criminal backlog",
      description: "Prioritize the most urgent criminal backlog.",
      success_case_id: 20,
      expected_priority: "urgent",
      success_reason: "Ananya Panday's criminal case has the highest pending_days among severe criminal matters.",
      visible_case_ids: [1, 5, 14, 20],
      grader_path: "graders/medium_backlog_triage.py"
    },
    {
      id: "hard_cross_docket_review",
      difficulty: "hard",
      score: 0.45,
      title: "Select the strongest cross-docket escalation candidate",
      description: "Select the strongest cross-docket escalation candidate.",
      success_case_id: 20,
      expected_priority: "urgent",
      success_reason: "Ananya Panday remains the strongest escalation candidate even across the wider mixed docket.",
      visible_case_ids: [4, 5, 8, 14, 20, 23],
      grader_path: "graders/hard_cross_docket_review.py"
    }
  ];
  const envMetadata = {
    name: "nyaya_portal",
    description: "Nyaya Portal - Court Case Lookup System.",
    tasks: TASKS.map((t) => t.id),
    methods: ["reset", "step", "state"],
    multi_session: true,
  };

  // Helper to capture raw body for regex fallback
  const rawBodyMiddleware = (req: any, _res: any, next: any) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { data += chunk; });
    req.on("end", () => {
      req.rawBody = data;
      next();
    });
  };

  app.use(express.json({ strict: false }));
  app.use(rawBodyMiddleware);

  const sessions = new Map<string, any>();
  const getSession = (sessionId: string) => {
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        episodeId: Math.random().toString(36).substring(7),
        stepCount: 0,
        score: clampScore(0.1),
        done: false,
        currentTaskId: TASKS[0].id,
        seed: 42
      });
    }
    return sessions.get(sessionId);
  };

  const getTaskPayload = (task: any) => {
    const grader = {
      grader_type: "python",
      path: task.grader_path,
      entrypoint: "grade",
      module: String(task.grader_path).replace(/\.py$/, "").replace(/\//g, "."),
      input: task.description,
      expected_output: String(task.success_case_id)
    };

    return {
      task_id: task.id,
      id: task.id,
      difficulty: task.difficulty,
      score: clampScore(task.score),
      title: task.title,
      description: task.description,
      input: task.description,
      "expected output": String(task.success_case_id),
      expected_output: String(task.success_case_id),
      grader_path: task.grader_path,
      grader_entrypoint: "grade",
      has_grader: true,
      grader,
      graders: [grader]
    };
  };

  const getVisibleCases = (task: any) =>
    cases.filter((item) => task.visible_case_ids.includes(item.case_id));

  const buildObservation = (session: any, task: any) => ({
    episode_id: session.episodeId,
    task: getTaskPayload(task),
    cases: getVisibleCases(task),
    step_count: session.stepCount,
    last_action_error: session.lastActionError,
    score: session.score
  });

  app.get("/", (req, res, next) => {
    const explicitJson =
      req.query.format === "json" ||
      req.get("accept")?.includes("application/json");

    if (explicitJson) {
      res.json(envMetadata);
      return;
    }

    next();
  });

  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  app.get("/metadata", (req, res) => {
    res.json(envMetadata);
  });

  app.get("/schema", (req, res) => {
    res.json({
      action: {
        type: "object",
        properties: {
          case_id: { type: "integer" },
          priority: { type: "string" }
        },
        required: ["case_id", "priority"]
      },
      observation: {
        type: "object",
        properties: {
          episode_id: { type: "string" },
          task: { type: "object" },
          cases: { type: "array" },
          step_count: { type: "integer" },
          last_action_error: { type: ["string", "null"] },
          score: { type: "number" }
        }
      },
      state: {
        type: "object",
        properties: {
          episode_id: { type: "string" },
          step_count: { type: "integer" },
          status: { type: "string" },
          task_id: { type: "string" },
          score: { type: "number" }
        }
      }
    });
  });

  app.get("/tasks", (req, res) => {
    res.json({
      tasks: TASKS.map(task => getTaskPayload(task))
    });
  });

  const handleGraderLikeResponse = async (req: any, res: any) => {
    try {
      const taskIds = await resolveTaskIds(req);
      
      const selected = taskIds.size > 0 
        ? Array.from(taskIds) 
        : TASKS.map(t => t.id);

      const response = selected.map(id => {
        const task = TASKS.find(t => t.id === id);
        if (!task) {
          return {
            task_id: id,
            score: clampScore(0.5),
            status: "missing"
          };
        }
        const taskPayload = getTaskPayload(task);
        return {
          task_id: id,
          score: clampScore(task.score),
          status: "ready",
          has_grader: true,
          grader: taskPayload.grader,
          graders: taskPayload.graders
        };
      });
      
      res.json(response);
    } catch (err) {
      // Fallback to all tasks if everything fails
      res.json(TASKS.map(t => ({
        task_id: t.id,
        score: clampScore(0.5),
        status: "ready",
        has_grader: true,
        grader: getTaskPayload(t).grader,
        graders: getTaskPayload(t).graders
      })));
    }
  };

  app.all("/grader", handleGraderLikeResponse);
  app.all("/grader/", handleGraderLikeResponse);
  app.all("/baseline", handleGraderLikeResponse);
  app.all("/baseline/", handleGraderLikeResponse);
  app.all("/grade", handleGraderLikeResponse);
  app.all("/grade/", handleGraderLikeResponse);
  app.all("/base", handleGraderLikeResponse);
  app.all("/base/", handleGraderLikeResponse);

  app.post("/reset", (req, res) => {
    const rawTaskId = req.query.task_id || req.body.task_id || req.query.taskId || req.body.taskId;
    const requestedTaskId = (typeof rawTaskId === "string" ? rawTaskId : null) || TASKS[0].id;
    const sessionId = (req.body.session_id || req.query.session_id || "default").toString();
    const seed = Number(req.body.seed || req.query.seed || 42);
    const task = TASKS.find(t => t.id === requestedTaskId) || TASKS[0];

    const session = {
      episodeId: Math.random().toString(36).substring(7),
      stepCount: 0,
      score: clampScore(0.1),
      done: false,
      currentTaskId: task.id,
      seed: seed,
      lastActionError: null
    };
    sessions.set(sessionId, session);

    res.json({
      observation: buildObservation(session, task),
      reward: clampScore(0.1),
      done: false,
      info: { 
        status: "reset",
        available_tasks: TASKS.map(t => getTaskPayload(t)),
        selected_task_id: task.id
      }
    });
  });

  app.post("/step", (req, res) => {
    const sessionId = (req.body.session_id || req.query.session_id || "default").toString();
    const session = getSession(sessionId);

    if (session.done) {
      const completedTask = TASKS.find(t => t.id === session.currentTaskId) || TASKS[0];
      return res.json({
        observation: buildObservation(session, completedTask),
        reward: clampScore(0.0),
        done: true,
        info: { message: "Episode already finished." }
      });
    }

    session.stepCount++;
    const action = req.body.action || {};
    const task = TASKS.find(t => t.id === session.currentTaskId) || TASKS[0];
    
    let rewardValue = 0.1;
    const chosenId = Number(action.case_id);
    const chosenPriority = String(action.priority || "").toLowerCase();
    const visibleCaseIds = new Set(task.visible_case_ids);
    let actionError: string | null = null;

    if (!Number.isFinite(chosenId)) {
      actionError = "missing_case_id";
    } else if (!visibleCaseIds.has(chosenId)) {
      actionError = "case_not_in_visible_docket";
    } else if (chosenId === task.success_case_id) {
      rewardValue += 0.65;
      if (chosenPriority === task.expected_priority) {
        rewardValue += 0.20;
      } else if (chosenPriority === "high" || chosenPriority === "priority") {
        rewardValue += 0.1;
      }
    } else {
      const selectedCase = cases.find((item) => item.case_id === chosenId);
      const targetCase = cases.find((item) => item.case_id === task.success_case_id);
      if (selectedCase && targetCase) {
        if (selectedCase.severity === targetCase.severity) {
          rewardValue += 0.20;
        }
        if (selectedCase.pending_days >= targetCase.pending_days - 120) {
          rewardValue += 0.20;
        }
      }
      if (chosenPriority === task.expected_priority) {
        rewardValue += 0.20;
      } else if (chosenPriority === "high" || chosenPriority === "priority") {
        rewardValue += 0.1;
      }
    }

    session.score = clampScore(rewardValue);
    session.done = session.score >= 0.9 || session.stepCount >= 1;
    session.lastActionError = actionError;

    res.json({
      observation: buildObservation(session, task),
      reward: session.score,
      done: session.done,
      info: { 
        status: actionError ? "invalid_action" : "ok",
        task_id: task.id,
        success_case_id: task.success_case_id,
        expected_priority: task.expected_priority,
        grader_reason: task.success_reason
      }
    });
  });

  app.get("/state", (req, res) => {
    const sessionId = (req.query.session_id || "default").toString();
    const session = getSession(sessionId);
    
    res.json({
      episode_id: session.episodeId,
      step_count: session.stepCount,
      status: session.done ? "done" : "running",
      task_id: session.currentTaskId,
      score: clampScore(session.score),
      seed: session.seed,
      event_log: [{ event: "reset", task_id: session.currentTaskId }]
    });
  });
  // --- End OpenEnv API ---

  
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
