from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any

try:
    from openai import OpenAI as _OpenAIClient
except ImportError:
    _OpenAIClient = None


@dataclass
class _Message:
    content: str | None


@dataclass
class _Choice:
    message: _Message


@dataclass
class _CompletionResponse:
    choices: list[_Choice]


class _Completions:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self._base_url = base_url
        self._api_key = api_key

    def create(self, **payload: Any) -> _CompletionResponse:
        request = urllib.request.Request(
            f"{self._base_url.rstrip('/')}/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data.get("choices", [{}])[0].get("message", {}).get("content")
        return _CompletionResponse(choices=[_Choice(message=_Message(content=content))])


class _Chat:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self.completions = _Completions(base_url=base_url, api_key=api_key)


class _ProxyClient:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self.chat = _Chat(base_url=base_url, api_key=api_key)


API_BASE_URL = os.getenv("API_BASE_URL", "https://router.huggingface.co/v1")
MODEL_NAME = os.getenv("MODEL_NAME", "Qwen/Qwen2.5-72B-Instruct")
API_KEY = os.getenv("API_KEY")
ENV_BASE_URL = os.getenv("ENV_BASE_URL", "http://localhost:8000")
TASK_NAME = os.getenv("NYAYA_TASK", "easy_case_lookup")
BENCHMARK = os.getenv("NYAYA_BENCHMARK", "nyaya_portal")
MAX_STEPS = 3
TEMPERATURE = 0.0
MAX_TOKENS = 120


def _http_json(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{ENV_BASE_URL.rstrip('/')}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def log_start(task: str, env: str, model: str) -> None:
    print(f"[START] task={task} env={env} model={model}", flush=True)


def log_step(step: int, action: str, reward: float, done: bool, error: str | None) -> None:
    error_value = error if error else "null"
    print(
        f"[STEP] step={step} action={action} reward={reward:.2f} "
        f"done={str(done).lower()} error={error_value}",
        flush=True,
    )


def log_end(success: bool, steps: int, score: float, rewards: list[float]) -> None:
    rewards_str = ",".join(f"{reward:.2f}" for reward in rewards)
    print(
        f"[END] success={str(success).lower()} steps={steps} "
        f"score={score:.2f} rewards={rewards_str}",
        flush=True,
    )


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


def _extract_action(content: str, cases: list[dict[str, Any]]) -> dict[str, Any]:
    visible_ids = [case.get("case_id") for case in cases if isinstance(case.get("case_id"), int)]
    try:
        parsed = json.loads(content)
        case_id = int(parsed.get("case_id"))
        priority = str(parsed.get("priority", "urgent")).strip().lower() or "urgent"
        if case_id in visible_ids:
            return {"case_id": case_id, "priority": priority}
    except Exception:
        pass

    best_case = max(
        cases,
        key=lambda case: (
            str(case.get("severity", "")).lower() == "high",
            int(case.get("pending_days", 0)),
        ),
    )
    return {"case_id": best_case["case_id"], "priority": "urgent"}


def _make_client() -> Any | None:
    if not API_BASE_URL or not API_KEY:
        return None
    if _OpenAIClient is not None:
        try:
            return _OpenAIClient(base_url=API_BASE_URL, api_key=API_KEY)
        except Exception:
            pass
    return _ProxyClient(base_url=API_BASE_URL, api_key=API_KEY)


def get_model_action(client: Any | None, task: dict[str, Any], cases: list[dict[str, Any]]) -> dict[str, Any]:
    if client is None:
        return _extract_action("", cases)
    prompt = _task_prompt(task, cases)
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a careful legal triage assistant. "
                        "Reply with JSON only."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
            stream=False,
        )
        content = (completion.choices[0].message.content or "").strip()
        return _extract_action(content, cases)
    except Exception:
        return _extract_action("", cases)


def resolve_task_name() -> str:
    try:
        payload = _http_json("GET", "/tasks")
        tasks = payload.get("tasks", [])
        task_ids = {
            str(task.get("task_id") or task.get("id"))
            for task in tasks
            if task.get("task_id") or task.get("id")
        }
        if TASK_NAME in task_ids:
            return TASK_NAME
        if task_ids:
            return sorted(task_ids)[0]
    except Exception:
        pass
    return TASK_NAME


def main() -> None:
    client = _make_client()
    task_name = resolve_task_name()
    rewards: list[float] = []
    steps_taken = 0
    score = 0.0
    success = False

    log_start(task=task_name, env=BENCHMARK, model=MODEL_NAME)

    try:
        reset_payload = _http_json("POST", "/reset", {"task_id": task_name})
        observation = reset_payload.get("observation", {})
        done = bool(reset_payload.get("done", False))

        for step in range(1, MAX_STEPS + 1):
            if done:
                break

            task = observation.get("task", {})
            cases = observation.get("cases", [])
            action_payload = get_model_action(client, task, cases)
            step_payload = _http_json("POST", "/step", {"action": action_payload})

            reward = float(step_payload.get("reward", 0.0) or 0.0)
            done = bool(step_payload.get("done", False))
            observation = step_payload.get("observation", {})
            error = observation.get("last_action_error")

            rewards.append(reward)
            steps_taken = step
            log_step(
                step=step,
                action=_safe_compact(action_payload),
                reward=reward,
                done=done,
                error=error,
            )

            if done:
                break

        score = float(observation.get("score", rewards[-1] if rewards else 0.0) or 0.0)
        score = min(max(score, 0.0), 1.0)
        success = score > 0.0

    except urllib.error.HTTPError as exc:
        steps_taken = max(steps_taken, 1)
        log_step(
            step=steps_taken,
            action=_safe_compact({"case_id": None, "priority": "urgent"}),
            reward=0.00,
            done=True,
            error=f"http_{exc.code}",
        )
    except Exception as exc:
        steps_taken = max(steps_taken, 1)
        log_step(
            step=steps_taken,
            action=_safe_compact({"case_id": None, "priority": "urgent"}),
            reward=0.00,
            done=True,
            error=str(exc).replace("\n", " ").replace("\r", " ") or "runtime_error",
        )
    finally:
        log_end(success=success, steps=steps_taken, score=score, rewards=rewards)


if __name__ == "__main__":
    main()
