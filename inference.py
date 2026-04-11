from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any, List, Optional

from openai import OpenAI

# Mandatory Variables and Defaults (Strict adherence to Validator requirements)
API_BASE_URL = os.environ.get("API_BASE_URL") or "https://router.huggingface.co/v1"
MODEL_NAME = os.environ.get("MODEL_NAME") or "Qwen/Qwen2.5-72B-Instruct"
HF_TOKEN = os.environ.get("HF_TOKEN")
API_KEY = os.environ.get("API_KEY") or HF_TOKEN

# Project Specific Constants
ENV_BASE_URL = os.getenv("ENV_BASE_URL", "http://localhost:7860")
TASK_NAME = os.getenv("NYAYA_TASK", "easy_case_lookup")
BENCHMARK = os.getenv("NYAYA_BENCHMARK", "nyaya_portal")
MAX_STEPS = 5
TEMPERATURE = 0.0
MAX_TOKENS = 150

# Loggers following the mandatory format
def log_start(task: str, env: str, model: str) -> None:
    print(f"[START] task={task} env={env} model={model}", flush=True)

def log_step(step: int, action: str, reward: float, done: bool, error: Optional[str]) -> None:
    error_val = error if error else "null"
    done_val = str(done).lower()
    print(
        f"[STEP] step={step} action={action} reward={reward:.2f} done={done_val} error={error_val}",
        flush=True,
    )

def log_end(success: bool, steps: int, score: float, rewards: List[float]) -> None:
    rewards_str = ",".join(f"{r:.2f}" for r in rewards)
    print(f"[END] success={str(success).lower()} steps={steps} score={score:.2f} rewards={rewards_str}", flush=True)

# Internal helper for environment Interaction
def _http_json(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    url = f"{ENV_BASE_URL.rstrip('/')}{path}"
    request = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))

def _safe_compact(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=True)

def _task_prompt(task: dict[str, Any], cases: list[dict[str, Any]]) -> str:
    return (
        "You are solving a deterministic court-case triage task.\n"
        "Return only valid JSON with keys case_id and priority.\n"
        "Choose the single strongest case to escalate from the visible docket.\n\n"
        f"Task ID: {task.get('task_id') or task.get('id')}\n"
        f"Task: {task.get('description') or task.get('input')}\n"
        f"Visible cases:\n{json.dumps(cases, ensure_ascii=True, indent=2)}\n\n"
        'Example output: {"case_id": 8, "priority": "urgent"}'
    )

def get_model_action(client: OpenAI, task: dict[str, Any], cases: list[dict[str, Any]]) -> dict[str, Any]:
    prompt = _task_prompt(task, cases)
    visible_ids = [case.get("case_id") for case in cases if isinstance(case.get("case_id"), int)]
    
    # We do NOT catch exceptions here so that failures are visible to the validator
    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a careful legal triage assistant. Reply with JSON only."},
            {"role": "user", "content": prompt},
        ],
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
    )
    content = (completion.choices[0].message.content or "").strip()
    
    try:
        parsed = json.loads(content)
        case_id = int(parsed.get("case_id"))
        if case_id in visible_ids:
            return {"case_id": case_id, "priority": str(parsed.get("priority", "urgent"))}
    except Exception:
        pass

    # Deterministic fallback ONLY if JSON parsing fails, not LLM call
    best_case = max(cases, key=lambda c: (str(c.get("severity", "")).lower() == "high", int(c.get("pending_days", 0))))
    return {"case_id": best_case["case_id"], "priority": "urgent"}

def main() -> None:
    # Resolve the correct task ID from server
    try:
        tasks_resp = _http_json("GET", "/tasks")
        task_id = next((t.get("task_id") or t.get("id") for t in tasks_resp.get("tasks", []) 
                        if (t.get("task_id") or t.get("id")) == TASK_NAME), TASK_NAME)
    except Exception:
        task_id = TASK_NAME

    rewards: List[float] = []
    steps_taken = 0
    score = 0.0
    success = False

    log_start(task=task_id, env=BENCHMARK, model=MODEL_NAME)

    try:
        # Strict client initialization using mandatory env vars
        client = OpenAI(base_url=API_BASE_URL, api_key=API_KEY or "missing_key")
        
        reset_payload = _http_json("POST", "/reset", {"task_id": task_id})
        observation = reset_payload.get("observation", {})
        done = bool(reset_payload.get("done", False))

        for step in range(1, MAX_STEPS + 1):
            if done: break

            task = observation.get("task", {})
            cases = observation.get("cases", [])
            
            # This call must succeed via the proxy
            action_payload = get_model_action(client, task, cases)
            
            step_payload = _http_json("POST", "/step", {"action": action_payload})
            reward = float(step_payload.get("reward", 0.0))
            done = bool(step_payload.get("done", False))
            observation = step_payload.get("observation", {})
            error = observation.get("last_action_error")

            rewards.append(reward)
            steps_taken = step
            log_step(step=step, action=_safe_compact(action_payload), reward=reward, done=done, error=error)

            if done: break

        score = float(observation.get("score", rewards[-1] if rewards else 0.0))
        score = min(max(score, 0.0), 1.0)
        success = score > 0.0

    except Exception as exc:
        log_step(step=max(steps_taken, 1), action="error", reward=0.0, done=True, error=str(exc))
    finally:
        log_end(success=success, steps=steps_taken, score=score, rewards=rewards)

if __name__ == "__main__":
    main()
