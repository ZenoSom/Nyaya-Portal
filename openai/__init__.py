from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass
from typing import Any


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
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data.get("choices", [{}])[0].get("message", {}).get("content")
        return _CompletionResponse(choices=[_Choice(message=_Message(content=content))])


class _Chat:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self.completions = _Completions(base_url=base_url, api_key=api_key)


class OpenAI:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self.chat = _Chat(base_url=base_url, api_key=api_key)
