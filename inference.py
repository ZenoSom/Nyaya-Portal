"""
Compatibility shim for environments that expect `inference.py` at the repo root.

Nyaya Portal is deployed as a Hugging Face Docker Space, so the actual app entry
point is defined in the Dockerfile and served by the Node/Express server.
This file exists only to satisfy tooling that validates repository structure.
"""


class EndpointHandler:
    def __init__(self, path: str = "") -> None:
        self.path = path

    def __call__(self, data):
        return {
            "status": "ok",
            "message": "Nyaya Portal uses the Dockerfile entrypoint; inference.py is a compatibility shim.",
            "input": data,
        }
