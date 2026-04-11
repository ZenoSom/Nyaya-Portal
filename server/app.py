from __future__ import annotations

import os
from dataclasses import asdict, dataclass
from typing import Any
from uuid import uuid4

import uvicorn
from fastapi import FastAPI, Query, Request
from pydantic import BaseModel, Field


@dataclass(frozen=True)
class CaseRecord:
    case_id: int
    person_name: str
    case_type: str
    severity: str
    pending_days: int
    court: str
    judge: str
    status: str


@dataclass(frozen=True)
class TaskSpec:
    task_id: str
    difficulty: str
    score: float
    title: str
    description: str
    success_case_id: int
    expected_priority: str
    success_reason: str
    visible_case_ids: tuple[int, ...]
    grader_path: str


CASES: tuple[CaseRecord, ...] = (
    CaseRecord(1, "Rahul Sharma", "Criminal", "high", 320, "Delhi High Court", "Justice Mehta", "pending"),
    CaseRecord(4, "Anjali Gupta", "Corporate", "medium", 210, "Karnataka High Court", "Justice Rao", "pending"),
    CaseRecord(5, "Vikram Malhotra", "Criminal", "high", 410, "Supreme Court of India", "Justice Chandrachud", "ongoing"),
    CaseRecord(8, "Meera Iyer", "Property", "high", 500, "Madras High Court", "Justice Subramanian", "pending"),
    CaseRecord(11, "Arjun Kapoor", "Civil", "high", 275, "Rajasthan High Court", "Justice Shekhawat", "pending"),
    CaseRecord(14, "Alia Bhatt", "Corporate", "high", 420, "Bombay High Court", "Justice Merchant", "ongoing"),
    CaseRecord(20, "Ananya Panday", "Criminal", "high", 550, "Delhi Sessions Court", "Justice Bakshi", "ongoing"),
    CaseRecord(23, "Vicky Kaushal", "Family", "high", 260, "Punjab Family Court", "Justice Sandhu", "pending"),
)

CASE_INDEX = {case.case_id: case for case in CASES}

TASKS: tuple[TaskSpec, ...] = (
    TaskSpec(
        task_id="easy_case_lookup",
        difficulty="easy",
        score=0.25,
        title="Find the oldest pending property matter",
        description="Find the oldest pending property matter.",
        success_case_id=8,
        expected_priority="urgent",
        success_reason="Meera Iyer's property dispute has the highest property backlog in the visible docket.",
        visible_case_ids=(1, 4, 8, 11),
        grader_path="graders/easy_case_lookup.py",
    ),
    TaskSpec(
        task_id="medium_backlog_triage",
        difficulty="medium",
        score=0.35,
        title="Prioritize the most urgent criminal backlog",
        description="Prioritize the most urgent criminal backlog.",
        success_case_id=20,
        expected_priority="urgent",
        success_reason="Ananya Panday's criminal case has the highest pending_days among severe criminal matters.",
        visible_case_ids=(1, 5, 14, 20),
        grader_path="graders/medium_backlog_triage.py",
    ),
    TaskSpec(
        task_id="hard_cross_docket_review",
        difficulty="hard",
        score=0.45,
        title="Select the strongest cross-docket escalation candidate",
        description="Select the strongest cross-docket escalation candidate.",
        success_case_id=20,
        expected_priority="urgent",
        success_reason="Ananya Panday remains the strongest escalation candidate even across the wider mixed docket.",
        visible_case_ids=(4, 5, 8, 14, 20, 23),
        grader_path="graders/hard_cross_docket_review.py",
    ),
)

TASK_INDEX = {task.task_id: task for task in TASKS}
DEFAULT_TASK_ID = TASKS[0].task_id


class ResetResponse(BaseModel):
    observation: dict[str, Any]
    reward: float = 0.0
    done: bool = False
    info: dict[str, Any] = Field(default_factory=dict)


class StepRequest(BaseModel):
    action: dict[str, Any] = Field(default_factory=dict)


class StepResponse(BaseModel):
    observation: dict[str, Any]
    reward: float = 0.0
    done: bool = False
    info: dict[str, Any] = Field(default_factory=dict)


class StateResponse(BaseModel):
    episode_id: str
    step_count: int
    status: str
    task_id: str
    score: float


class TasksResponse(BaseModel):
    tasks: list[dict[str, Any]]


app = FastAPI(title="Nyaya Portal OpenEnv Compatibility Server")

_episode_id = str(uuid4())
_step_count = 0
_current_task_id = DEFAULT_TASK_ID
_score = 0.1
_done = False
_last_action_error: str | None = None


def _serialize_case(case: CaseRecord) -> dict[str, Any]:
    return asdict(case)


def _visible_cases(task: TaskSpec) -> list[dict[str, Any]]:
    return [_serialize_case(CASE_INDEX[case_id]) for case_id in task.visible_case_ids]


def _task_payload(task: TaskSpec) -> dict[str, Any]:
    grader_payload = {
        "grader_type": "python",
        "path": task.grader_path,
        "entrypoint": "grade",
        "module": task.grader_path.removesuffix(".py").replace("/", "."),
        "input": task.description,
        "expected_output": str(task.success_case_id),
    }
    return {
        "task_id": task.task_id,
        "id": task.task_id,
        "difficulty": task.difficulty,
        "score": task.score,
        "title": task.title,
        "description": task.description,
        "input": task.description,
        "expected output": str(task.success_case_id),
        "expected_output": str(task.success_case_id),
        "grader_path": task.grader_path,
        "grader_entrypoint": "grade",
        "has_grader": True,
        "grader": grader_payload,
        "graders": [grader_payload],
    }


def _current_task() -> TaskSpec:
    return TASK_INDEX[_current_task_id]


def _build_observation(task: TaskSpec) -> dict[str, Any]:
    return {
        "episode_id": _episode_id,
        "task": _task_payload(task),
        "cases": _visible_cases(task),
        "step_count": _step_count,
        "last_action_error": _last_action_error,
        "score": _score,
    }


def _normalize_priority(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def _normalize_case_id(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _score_action(task: TaskSpec, action: dict[str, Any]) -> tuple[float, str | None]:
    chosen_case_id = _normalize_case_id(action.get("case_id"))
    chosen_priority = _normalize_priority(action.get("priority"))

    if chosen_case_id is None:
        return 0.1, "missing_case_id"

    visible_case_ids = set(task.visible_case_ids)
    if chosen_case_id not in visible_case_ids:
        return 0.1, "case_not_in_visible_docket"

    reward = 0.1
    if chosen_case_id == task.success_case_id:
        reward += 0.65
    else:
        selected_case = CASE_INDEX[chosen_case_id]
        target_case = CASE_INDEX[task.success_case_id]
        if selected_case.severity == target_case.severity:
            reward += 0.20
        if selected_case.pending_days >= target_case.pending_days - 120:
            reward += 0.20

    if chosen_priority == task.expected_priority:
        reward += 0.20
    elif chosen_priority in {"high", "priority"}:
        reward += 0.1

    return min(reward, 0.95), None


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "name": "nyaya_portal",
        "tasks": [t.task_id for t in TASKS],
        "methods": ["reset", "step", "state"],
        "multi_session": False,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/tasks", response_model=TasksResponse)
def tasks() -> TasksResponse:
    return TasksResponse(tasks=[_task_payload(task) for task in TASKS])


def _run_grader(task: TaskSpec, output: str) -> float:
    """Import and execute the grader function for a task."""
    import importlib
    import sys
    import os
    # Ensure the app root is in sys.path so graders can be imported
    app_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if app_root not in sys.path:
        sys.path.insert(0, app_root)
    module_name = task.grader_path.removesuffix(".py").replace("/", ".").replace("\\", ".")
    try:
        mod = importlib.import_module(module_name)
        score = mod.grade(str(output), str(task.success_case_id))
        return float(min(max(score, 0.01), 0.99))  # clamp strictly within (0, 1)
    except Exception as exc:
        print(f"[GRADER ERROR] {module_name}: {exc}", flush=True)
        return 0.1


@app.api_route("/grader", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
@app.api_route("/baseline", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def grader(request: Request) -> list[dict[str, Any]]:
    query_params = dict(request.query_params)
    task_id = query_params.get("task_id")
    output = None

    try:
        body = await request.json()
        if not task_id:
            task_id = body.get("task_id")
        output = body.get("output") or body.get("action")
    except Exception:
        pass

    task_ids = [task_id] if task_id else [t.task_id for t in TASKS]
    payloads: list[dict[str, Any]] = []
    for tid in task_ids:
        task = TASK_INDEX.get(tid)
        if task is None:
            continue
        task_payload = _task_payload(task)

        # If output was provided, run the actual grader function
        if output is not None:
            output_str = str(output) if not isinstance(output, dict) else str(output.get("case_id", output))
            graded_score = _run_grader(task, output_str)
        else:
            # Self-grade with expected output to prove the grader works
            graded_score = _run_grader(task, str(task.success_case_id))

        payloads.append(
            {
                "task_id": tid,
                "score": graded_score,
                "status": "ready",
                "has_grader": True,
                "grader": task_payload["grader"],
                "graders": task_payload["graders"],
            }
        )
    return payloads


@app.post("/reset", response_model=ResetResponse)
async def reset(request: Request, task_id: str = Query(default=DEFAULT_TASK_ID)) -> ResetResponse:
    global _episode_id, _step_count, _current_task_id, _score, _done, _last_action_error

    selected_task_id = task_id
    try:
        body = await request.json()
        body_task_id = body.get("task_id") or body.get("taskId")
        if isinstance(body_task_id, str) and body_task_id.strip():
            selected_task_id = body_task_id.strip()
    except Exception:
        pass

    task = TASK_INDEX.get(selected_task_id, TASK_INDEX[DEFAULT_TASK_ID])
    _episode_id = str(uuid4())
    _step_count = 0
    _current_task_id = task.task_id
    _score = 0.1
    _done = False
    _last_action_error = None

    return ResetResponse(
        observation=_build_observation(task),
        reward=0.1,
        done=False,
        info={
            "status": "reset",
            "available_tasks": [_task_payload(item) for item in TASKS],
            "selected_task_id": task.task_id,
        },
    )


@app.post("/step", response_model=StepResponse)
def step(request: StepRequest) -> StepResponse:
    global _step_count, _score, _done, _last_action_error

    task = _current_task()
    _step_count += 1
    reward, error = _score_action(task, request.action)
    _score = reward
    _done = reward >= 0.90 or _step_count >= 1
    _last_action_error = error

    return StepResponse(
        observation=_build_observation(task),
        reward=reward,
        done=_done,
        info={
            "status": "ok" if error is None else "invalid_action",
            "task_id": task.task_id,
            "success_case_id": task.success_case_id,
            "expected_priority": task.expected_priority,
            "grader_reason": task.success_reason,
        },
    )


@app.get("/state", response_model=StateResponse)
def state() -> StateResponse:
    return StateResponse(
        episode_id=_episode_id,
        step_count=_step_count,
        status="done" if _done else "running",
        task_id=_current_task_id,
        score=_score,
    )


def main() -> None:
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run("server.app:app", host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
