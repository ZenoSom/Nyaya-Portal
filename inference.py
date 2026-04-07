"""
Compatibility shim for environments that expect `inference.py` at the repo root.

Nyaya Portal is deployed as a Hugging Face Docker Space, so the actual app entry
point is defined in the Dockerfile and served by the Node/Express server.
This file exists only to satisfy tooling that validates repository structure.
"""

from __future__ import annotations

import json
from typing import Any


class EndpointHandler:
    def __init__(self, path: str = "") -> None:
        self.path = path

    def __call__(self, data: Any) -> dict[str, Any]:
        return {
            "status": "ok",
            "message": "Nyaya Portal uses the Dockerfile entrypoint; inference.py is a compatibility shim.",
            "input": data,
        }


def main() -> None:
    print(json.dumps(EndpointHandler()({"healthcheck": True})))


if __name__ == "__main__":
    main()
