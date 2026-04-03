from __future__ import annotations

from typing import Any
from uuid import uuid4

from fastapi import FastAPI
from pydantic import BaseModel, Field


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


app = FastAPI(title="Nyaya Portal OpenEnv Compatibility Server")

_episode_id = str(uuid4())
_step_count = 0


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Nyaya Portal OpenEnv compatibility server is running."}


@app.post("/reset", response_model=ResetResponse)
def reset() -> ResetResponse:
    global _episode_id, _step_count
    _episode_id = str(uuid4())
    _step_count = 0
    return ResetResponse(
        observation={
            "message": "Nyaya Portal environment reset.",
            "episode_id": _episode_id,
        },
        info={"status": "reset"},
    )


@app.post("/step", response_model=StepResponse)
def step(request: StepRequest) -> StepResponse:
    global _step_count
    _step_count += 1
    return StepResponse(
        observation={
            "message": "Step processed.",
            "received_action": request.action,
            "step_count": _step_count,
        },
        info={"status": "ok"},
    )


@app.get("/state", response_model=StateResponse)
def state() -> StateResponse:
    return StateResponse(
        episode_id=_episode_id,
        step_count=_step_count,
        status="running",
    )
