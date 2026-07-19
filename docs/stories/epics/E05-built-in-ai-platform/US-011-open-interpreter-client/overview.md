# Overview

## Current Behavior

- No Open Interpreter UI dashboard exists in the frontend.
- No support for creating workspace-scoped conversation threads.
- No visual controls to start, stop, install, send prompts, select proxy models, configure permission modes, or handle action approval cards.

## Target Behavior

- **Interactive Client Console**: Added workspace thread history sidebar allowing users to select workspace paths, create, list, and delete thread sessions.
- **Model and Permission Selectors**: Allows selecting active proxy LLM models (routing via synthetic `clx:<uuid>` headers) and default permission levels (`workspace-write`, `read-only`, `full-access`) directly on the console.
- **Protocol Streaming & Reasoning**: Supports streaming text, tool execution indicators, and expandable thinking blocks via the standard ACP frame listener.
- **Action Approval Card**: Renders cards requiring user confirmation ("Allow Once", "Allow for Session", "Deny") when Open Interpreter requests system terminal executions.

## Affected Product Docs

- `docs/stories/epics/E05-built-in-ai-platform/plan.md`
