# Overview

## Current Behavior

- The settings interface is a single, monolithic scrollable panel (`src/components/SettingsPanel.tsx`) showing theme selection, mythical pet configuration, local LLM configurations, and sidebar icon ordering.
- There is a single global Settings icon in the sidebar that opens this monolithic panel.
- There is no category-based routing or deep-linking to specific settings.
- The AI Companion sidebar header has a "Config" button that opens a custom LLM modal form (`LlmConfigModal`) with duplicate settings for the cloud LLM.
- The primary sidebar tabs order does not include Open Interpreter.

## Target Behavior

- Settings panel retains one global Settings icon in the sidebar but uses a sidebar/rail layout with a left category rail and right active category pane.
- Supported stable section IDs:
  - `appearance` (Theme)
  - `mythical-pet` (Anime/Mythical Pet selection & toggle)
  - `ai-companion` (Cloud AI companion configurations)
  - `local-llm` (Local offline LLM configurations)
  - `open-interpreter` (Open Interpreter settings placeholder/configurations)
  - `web-ai` (Web AI profile configurations)
  - `navigation` (Sidebar Icon Order configuration)
- Monolithic Settings panel is decomposed into modular sub-components.
- Last selected category is persisted in `localStorage` (`ai-cli-settings-active-section`).
- Responsive adaptation: on narrow layouts, the left rail becomes a select dropdown/drawer.
- A global routing function `openSettings(section)` is exposed via event dispatching to allow deep links from the Command Palette, AI Companion header, etc.
- The AI Companion configuration modal is eliminated; its "Config" button now deep-links directly to the `ai-companion` settings category.
- Command Palette actions added to open Settings directly at any of the seven categories.
- Command Palette actions added to launch AI Companion, Open Interpreter, and Web AI.
- Configurable primary sidebar order supports Open Interpreter (`open-interpreter`), appending it gracefully for existing configurations.

## Affected Users

- All desktop app users customizing their interface, models, or assistants.

## Affected Product Docs

- `docs/stories/epics/E05-built-in-ai-platform/plan.md`

## Non-Goals

- Implementing actual Web AI WebView engine or Open Interpreter PTY runtime bridge (covered in US-009/US-010).
- Altering existing storage keys or format for themes, pet selections, or LLM configurations.
