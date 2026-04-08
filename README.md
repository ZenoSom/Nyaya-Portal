---
title: Nyayal P
sdk: docker
pinned: false
short_description: Court case triage OpenEnv environment
---

# Nyaya Portal OpenEnv Environment

Nyaya Portal is a courtroom triage environment for the OpenEnv hackathon. An agent receives a small docket of real-world-style court cases and must choose which matter should be escalated next.

## Environment Summary

- Domain: judicial backlog triage
- Runtime: FastAPI
- Core endpoints: `/reset`, `/step`, `/state`, `/tasks`
- Objective: choose the correct `case_id` and urgency level for each task

## Task Set

The environment exposes three deterministic tasks:

1. `easy_case_lookup`
   Find the oldest pending property matter.
2. `medium_backlog_triage`
   Prioritize the most urgent criminal backlog.
3. `hard_cross_docket_review`
   Select the strongest escalation candidate across a mixed docket.

Each task returns:

- a task description
- a visible subset of case records
- deterministic grading through the `step()` call

## Action Space

The agent submits a JSON action object to `/step`:

```json
{
  "case_id": 8,
  "priority": "urgent"
}
```

## Observation Space

`/reset` and `/step` return observations with:

- `episode_id`
- `task`
- `cases`
- `step_count`
- `last_action_error`
- `score`

## Reward Logic

Rewards are normalized to `[0.0, 1.0]`.

- `0.75` for choosing the correct `case_id`
- partial credit for selecting a near-correct severe / long-pending case
- `0.25` for setting the expected urgency correctly

The episode ends after one grading step, which keeps validation deterministic and reproducible.

## Inference Script

The root `inference.py`:

- emits strict `[START]`, `[STEP]`, `[END]` stdout lines
- makes an OpenAI-compatible chat completion request through the injected proxy variables
- remains self-contained even if the external `openai` package is unavailable

## Local Run

Install frontend dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Run the OpenEnv FastAPI server locally:

```bash
python3 -m server.app
```

## Files

- `server/app.py`: OpenEnv-compatible environment server
- `openenv.yaml`: environment entrypoint definition
- `inference.py`: baseline validator script
- `Dockerfile`: Space container build
