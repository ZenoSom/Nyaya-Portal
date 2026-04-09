---
title: Nyaya Portal
sdk: docker
pinned: false
short_description: Court case triage OpenEnv environment
tasks:
  - id: easy_case_lookup
    input: "Find the oldest pending property matter."
    expected_output: "8"
    grader_logic: "def grade(output, expected_output):\n    return 0.8 if str(output).strip() == str(expected_output).strip() else 0.2"
    graders:
      - grader_type: python
        input: "Find the oldest pending property matter."
        expected_output: "8"
        grader_logic: "def grade(output, expected_output):\n    return 0.8 if str(output).strip() == str(expected_output).strip() else 0.2"
  - id: medium_backlog_triage
    input: "Prioritize the most urgent criminal backlog."
    expected_output: "20"
    grader_logic: "def grade(output, expected_output):\n    return 0.75 if str(output).strip() == str(expected_output).strip() else 0.25"
    graders:
      - grader_type: python
        input: "Prioritize the most urgent criminal backlog."
        expected_output: "20"
        grader_logic: "def grade(output, expected_output):\n    return 0.75 if str(output).strip() == str(expected_output).strip() else 0.25"
  - id: hard_cross_docket_review
    input: "Select the strongest cross-docket escalation candidate."
    expected_output: "20"
    grader_logic: "def grade(output, expected_output):\n    return 0.9 if str(output).strip() == str(expected_output).strip() else 0.1"
    graders:
      - grader_type: python
        input: "Select the strongest cross-docket escalation candidate."
        expected_output: "20"
        grader_logic: "def grade(output, expected_output):\n    return 0.9 if str(output).strip() == str(expected_output).strip() else 0.1"
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
- a task `score` strictly between `0` and `1`
- one or more deterministic `graders`
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
- makes an OpenAI-compatible `/v1/chat/completions` request through the injected proxy variables
- remains self-contained even if the external `openai` package is unavailable

Required proxy/runtime variables:

- `API_BASE_URL`: LiteLLM or OpenAI-compatible proxy base URL
- `API_KEY`: proxy API key
- `MODEL_NAME`: model identifier exposed by the proxy
- `ENV_BASE_URL`: base URL for the running FastAPI environment

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

Run the inference script against an OpenAI-compatible proxy:

```bash
API_BASE_URL="https://your-proxy.example/v1" \
API_KEY="your-proxy-key" \
MODEL_NAME="your-model" \
ENV_BASE_URL="http://localhost:8000" \
python3 inference.py
```

## Files

- `server/app.py`: OpenEnv-compatible environment server
- `openenv.yaml`: environment entrypoint definition
- `inference.py`: baseline validator script
- `Dockerfile`: Space container build
