
export function clampScore(value: any): number {
  try {
    const parsed = typeof value === "number" ? value : parseFloat(String(value));
    if (isNaN(parsed)) return 0.5;
    return Math.max(0.01, Math.min(0.99, parsed));
  } catch {
    return 0.5;
  }
}

export function coercePayload(payload: any): any {
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload.trim());
      // Handle potential double-encoding
      if (typeof parsed === "string") {
        try {
          return JSON.parse(parsed.trim());
        } catch {
          return parsed;
        }
      }
      return parsed;
    } catch {
      return payload;
    }
  }
  return payload;
}

export function extractTaskId(item: any): string {
  if (!item || typeof item !== "object") return "";
  const keys = ["task_id", "taskId", "task", "id"];
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export function collectTaskIds(
  payload: any,
  taskIds: Set<string>,
  depth: number = 0,
  contextKey: string | null = null
): void {
  if (depth > 12) return;
  
  const currentPayload = coercePayload(payload);
  
  const idFieldKeys = new Set(["task_id", "taskId", "task", "id"]);
  const idListKeys = new Set(["tasks", "task_ids", "taskIds", "task_list", "taskList"]);
  const scoreMapKeys = new Set(["summary", "results", "scores", "task_scores"]);
  const blocked = new Set([
    "task_id", "task", "taskId", "task_name", "task_score", "task_scores", 
    "score", "scores", "summary", "results", "tasks", "payload", "data", "input"
  ]);

  const addId = (id: any) => {
    if (typeof id !== "string") return;
    const candidate = id.trim();
    if (!candidate || candidate.length > 256 || blocked.has(candidate)) return;
    taskIds.add(candidate);
  };

  if (typeof currentPayload === "string") {
    if (contextKey && idFieldKeys.has(contextKey)) {
      addId(currentPayload);
      return;
    }
    if (contextKey && (idListKeys.has(contextKey) || scoreMapKeys.has(contextKey))) {
      currentPayload.split(",").forEach(part => addId(part));
      return;
    }
    return;
  }

  if (Array.isArray(currentPayload)) {
    for (const item of currentPayload) {
      if (typeof item === "string" && (!contextKey || idListKeys.has(contextKey) || scoreMapKeys.has(contextKey))) {
        addId(item);
      } else {
        collectTaskIds(item, taskIds, depth + 1, contextKey);
      }
    }
    return;
  }

  if (currentPayload && typeof currentPayload === "object") {
    // Check direct ID keys
    for (const key of idFieldKeys) {
      if (key in currentPayload) {
        collectTaskIds(currentPayload[key], taskIds, depth + 1, key);
      }
    }
    
    // Check list keys
    for (const key of idListKeys) {
      if (key in currentPayload) {
        collectTaskIds(currentPayload[key], taskIds, depth + 1, key);
      }
    }

    // Check map keys
    for (const key of scoreMapKeys) {
      const section = currentPayload[key];
      if (section && typeof section === "object" && !Array.isArray(section)) {
        for (const [candidateId, value] of Object.entries(section)) {
          addId(candidateId);
          collectTaskIds(value, taskIds, depth + 1, key);
        }
      } else if (section !== undefined) {
        collectTaskIds(section, taskIds, depth + 1, key);
      }
    }

    // Check arbitrary keys starting with task_
    for (const [key, value] of Object.entries(currentPayload)) {
      if (typeof key === "string" && key.startsWith("task_")) {
        addId(key);
      }
      collectTaskIds(value, taskIds, depth + 1, key);
    }
  }
}

export function extractTaskIdsFromText(text: string): Set<string> {
  const taskIds = new Set<string>();
  if (!text || typeof text !== "string") return taskIds;

  const blocked = new Set([
    "task_id", "task", "taskId", "task_name", "task_score", "task_scores", 
    "score", "scores", "summary", "results", "tasks", "payload", "data", "input"
  ]);

  const addId = (id: string) => {
    const candidate = id.trim();
    if (candidate && candidate.length <= 256 && !blocked.has(candidate)) {
      taskIds.add(candidate);
    }
  };

  const normalizedText = text.replace(/\\"/g, '"');
  const patterns = [
    /"(?:task_id|taskId|task|id)"\s*:\s*"([^"]+)"/g,
    /(?:task_id|taskId|task|id)\s*"?\s*[:=]\s*"([^"]+)"/g,
    /\b(task_[A-Za-z0-9_\-]+)\b/g,
    /(?:\[|,)\s*"([A-Za-z0-9][A-Za-z0-9_\-]{1,255})"\s*(?:,|\])/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(normalizedText)) !== null) {
      if (match[1]) addId(match[1]);
    }
  }
  return taskIds;
}

export async function resolveTaskIds(req: any): Promise<Set<string>> {
  const taskIds = new Set<string>();
  
  // Try structured payload first
  const payload = req.body;
  if (payload) {
    collectTaskIds(payload, taskIds);
  }

  // Try query params
  if (req.query) {
    const qTaskId = req.query.task_id || req.query.task;
    if (qTaskId) taskIds.add(qTaskId);
    
    const qTaskIds = req.query.task_ids;
    if (qTaskIds && typeof qTaskIds === "string") {
      qTaskIds.split(",").forEach(id => taskIds.add(id.trim()));
    }
  }

  // Fallback to raw body text regex if no structured IDs found
  if (taskIds.size === 0 && req.rawBody) {
    const regexIds = extractTaskIdsFromText(req.rawBody);
    regexIds.forEach(id => taskIds.add(id));
  }

  return taskIds;
}
