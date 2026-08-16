# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

WT Toolbox — Chrome extension (Manifest V3) for debugging the Alfa-Bank Invest web terminal. It forces a specific PR build via the `_PR_NUM` cookie, reports VPN connectivity, and detects which stand the active tab is on.

UI strings are in Russian; keep new user-facing text consistent with that.

## Commands

Package manager is pnpm (`pnpm-lock.yaml`).

```bash
pnpm install
```

```bash
pnpm lint:js
```

```bash
pnpm lint:css
```

```bash
pnpm lint:format
```

```bash
pnpm format
```

There is no test framework and no tests in this repo — don't reference a test command that doesn't exist.

## Loading the extension

The **repository root is itself a loadable unpacked extension** — `manifest.json` points at `src/background.js`, `src/popup.html`, and `src/icons/*`, all of which resolve as-is. Load it directly from the root during development. There is no bundler or transpiler: the browser runs `src/` via native ES modules.

`pnpm build` produces the same layout in `dist/` (`manifest.json` plus a nested `src/`), so a single manifest serves both the root and the packaged build. Keep it that way: copying with `cp -r src dist/` preserves the directory, whereas `cp -r src/*` would flatten it into `dist/` and break every `src/`-prefixed manifest path. `dist/` is gitignored.

## Architecture

Two runtime contexts — the popup and the background service worker — communicate only through `chrome.runtime` messaging, wrapped by `src/utils/Action.js`.

An `Action` is a named message contract. `execute(payload)` sends from the popup and returns a promise; `register(handler)` installs the background listener. Each feature is a triple with one file per layer:

| Layer          | Location                      | Role                                             |
| -------------- | ----------------------------- | ------------------------------------------------ |
| Contract       | `src/actions/<name>Action.js` | Exports a shared `new Action('<name>')` instance |
| Implementation | `src/handlers/<name>.js`      | Async function, runs in the service worker       |
| UI             | `src/ui/init<Name>Block.js`   | Reads/writes popup DOM, calls `action.execute()` |

`src/background.js` wires handlers to actions and is the only place registration happens. `src/popup.js` just awaits each `init*Block()`.

### Constraints this structure imposes

- **`src/actions/` modules are imported by both contexts.** Keep them side-effect free — no DOM access, no Chrome API calls beyond constructing the `Action`. A stray `document` reference there breaks the service worker.
- **Handlers must return a promise.** `Action.register` calls `handler(payload).then(sendResponse)` and returns `true` to hold the message channel open. A synchronous handler will throw.
- **`src/ui/init*Block.js` modules query DOM elements at module top level**, so every element id they reference must already exist in `src/popup.html`.

### Adding a feature

Create the action, the handler, and the UI module; register the pair in `src/background.js`; add the markup to `src/popup.html`; call the new `init*Block()` from `src/popup.js`. Any new Chrome API also needs its `permissions` entry in `manifest.json`.

## Feature notes

**PR override** (`src/handlers/overridePR.js`) — appends a `Cookie: _PR_NUM=<n>` request header via `declarativeNetRequest` dynamic rules, one rule per host in `DOMAINS`. Rule IDs are positional (`1..N`, derived from the `DOMAINS` index) and every call removes them before re-adding, so the rule set stays idempotent. Adding a domain to `DOMAINS` **also requires a matching `host_permissions` entry** in `manifest.json`, or the rule silently won't apply. State lives in `chrome.storage.local` as `{ prNumber, enabled }` and is re-applied each time the popup opens.

**VPN check** (`src/handlers/checkVpn.js`) — requests a unique marker URL on `invest-test.alfabank.ru` and watches `webRequest` `onCompleted`/`onErrorOccurred`. A DNS failure (`ERR_NAME_NOT_RESOLVED` / `ERR_NAME_RESOLUTION_FAILED`) means no VPN; any other error still counts as connected. Resolves `false` after a 4s timeout. The `finish()` guard makes resolution single-shot and tears down both listeners.

**Stand detection** (`src/handlers/getStand.js`) — maps the active tab's hostname to `int` / `local-int` / `local-prod`. `invest.alfabank.ru` is ambiguous, so it injects a script that scans inline `<script>` contents for `_PR_NUM` to tell `prelive` from `prod`. Unrecognized hosts return `unknown`, which `initStandBlock.js` renders as an em dash.

## Lint configuration

ESLint has **no browser env preset** — globals are enumerated explicitly in `eslint.config.js`. Using a new global (e.g. `localStorage`, `navigator`) requires adding it to that `globals` map or `no-undef` will fail.

`eslint.config.js` itself is CommonJS and has its own config block overriding `sourceType` to `script`; everything under `src/` is ESM.

Beyond `js.configs.recommended`, the enforced rules are `curly` and `padding-line-between-statements` — the latter requires blank lines after variable declaration groups, after `if` blocks, and before `return`. Prettier (100 cols, single quotes, trailing commas) owns formatting and is layered via `eslint-config-prettier`.
