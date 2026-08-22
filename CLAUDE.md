# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

WT Toolbox — Chrome extension (Manifest V3) for debugging the Alfa-Bank Invest web terminal. It forces a specific PR build via a PR-number cookie whose name depends on the target app (`src/consts/apps.js`), reports VPN connectivity, and detects which stand the active tab is on.

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

### One export per file

**Every module exports exactly one entity, and the file name is that entity's name** — `src/utils/resolveApp.js` exports `resolveApp`, `src/stores/appIdStore.js` exports `appIdStore`. Classes keep their `PascalCase`, so `src/utils/Storage.js` exports `Storage`; everything else is camelCase, `SHOUTY_CASE` constants included — `src/consts/apps.js` exports `APPS`. Helpers a module needs for itself stay unexported inside it (`DEFAULT_APP` in `resolveApp.js`). Anything a second module needs becomes its own file rather than a second export — that is how `APPS` and `resolveApp` ended up split.

Shared literal data lives in `src/consts/<name>.js` — currently `APPS` (the target apps and their cookie names) and `DOMAINS` (the hosts the override rules cover). Keep these free of logic and imports; functions over them belong in `src/utils/`.

### Stores

Persisted state follows the same shape as actions: `src/utils/Storage.js` is the wrapper, and `src/stores/<name>Store.js` exports one configured `new Storage(key, { encode, decode })` instance shared by both contexts; both options are optional. **One store is exactly one `chrome.storage.local` key** — no store spans several. Split the state instead, as `prNumberStore` and `prEnabledStore` are split; the class deliberately has no multi-key mode to maintain.

The key itself never reaches `encode`/`decode` — `Storage` unwraps the stored value before `decode` and wraps `encode`'s result back up, so those functions only ever see the value, and no caller touches `chrome.storage` directly. `get()` and `subscribe()` both deliver decoded data; `subscribe()` fires once with the current value, then on every change.

`encode(data, current)` receives the current decoded value as its second argument, so a store can fold the caller's input into existing state instead of replacing it. That is where write-time invariants belong — a caller passing raw input must not be able to violate them.

The instances are `prNumberStore` (`''` when unset), `prEnabledStore` (coerced to boolean), `appIdStore` (an id from `APPS`, falling back to the first app), and `prHistoryStore`. `prHistoryStore.save(prNumber)` takes a single number, not a list: its `encode` moves that number to the front, drops the duplicate, and caps the result at 3.

Only subscribe to a store another context writes — `prHistoryStore` in the popup, written by the service worker. The popup is the sole writer of `prNumberStore` / `prEnabledStore` / `appIdStore`, so `initPROverrideBlock` reads those with `get()` on open and applies the override itself on every edit; subscribing there would fan one popup open out into several overlapping `overridePR` calls. `initReloadBlock` is the exception and subscribes to all three on purpose: it needs the change events, not the values, and it sends no message of its own.

Not every background module is message-driven: `src/handlers/trackAppliedPR.js` exports a plain `trackAppliedPR()` that subscribes to a Chrome event, and `src/background.js` calls it once at service-worker startup. Such subscriptions must be registered synchronously at top level, or the event won't wake a dormant worker.

### Constraints this structure imposes

- **`src/actions/` modules are imported by both contexts.** Keep them side-effect free — no DOM access, no Chrome API calls beyond constructing the `Action`. A stray `document` reference there breaks the service worker.
- **Handlers must return a promise.** `Action.register` calls `handler(payload).then(sendResponse)` and returns `true` to hold the message channel open. A synchronous handler will throw.
- **`src/ui/init*Block.js` modules query DOM elements at module top level**, so every element id they reference must already exist in `src/popup.html`.
- **State that is purely a function of a form control belongs in CSS, not JS.** The "Активен / Неактивен" hint is `content` on `.toggle-hint::before`, switched by `.toggle-row:has(input:checked)` — no listener, no class toggling, and it cannot drift out of sync with the checkbox.

### Adding a feature

Create the action, the handler, and the UI module; register the pair in `src/background.js`; add the markup to `src/popup.html`; call the new `init*Block()` from `src/popup.js`. Any new Chrome API also needs its `permissions` entry in `manifest.json`.

## Feature notes

**PR override** (`src/handlers/overridePR.js`) — appends a `Cookie: <cookie>=<n>` request header via `declarativeNetRequest` dynamic rules, one rule per host in `DOMAINS` (`src/consts/domains.js`). Rule IDs are positional (`1..N`, derived from the `DOMAINS` index) and every call removes them before re-adding, so the rule set stays idempotent. **The removal and the addition must stay in one `updateDynamicRules` call** — Chrome applies `removeRuleIds` before `addRules` within a call, whereas two awaited calls let a second invocation slip in between and fail with `Rule with id 1 does not have a unique ID`. Disabling the override is the same call with an empty `addRules`. The popup sends exactly one `overridePR` per change for the same reason.

The handler also serialises itself: a module-level `pending` promise chains every invocation, so a slow call can't be overtaken by a newer one and the last edit is the one left in effect — the ordering guarantee is ours rather than a Chromium implementation detail. The rules are built synchronously before the call joins the queue, so each queued update carries its own snapshot of the payload, and `pending.then(apply, apply)` keeps the queue alive after a failed call while the error still reaches that call's own caller. This module-level state is the one exception to handlers being plain stateless functions. Adding a domain to `DOMAINS` **also requires a matching `host_permissions` entry** in `manifest.json`, or the rule silently won't apply. State is persisted through `prNumberStore` / `prEnabledStore` / `appIdStore` and re-applied each time the popup opens.

**Target app** (`src/consts/apps.js`, `src/utils/resolveApp.js`) — `APPS` is the single source of truth: one entry per app with `id`, Russian `name`, and `cookie`. Exactly one app is active at a time, chosen in the popup's `#appSelect`; the PR number, the enabled flag, and the history are shared across apps, so switching an app only swaps the cookie name. `resolveApp(appId)` falls back to the first entry, which keeps an unknown or missing stored id (e.g. state written before app selection existed) on `_PR_NUM`. **Adding an app is one entry in `APPS`** — the `<select>` options are rendered from it and the handler reads the cookie name through `resolveApp`; nothing else needs to change.

**Recent PR numbers** (`src/handlers/trackAppliedPR.js`, `src/stores/prHistoryStore.js`) — the popup renders the last 3 used PR numbers as clickable tags under the input; a click fills the field and applies immediately. A number enters the history only when it is actually _applied_ — `trackAppliedPR` watches `webRequest.onBeforeRequest` for `main_frame` navigations to a `DOMAINS` host and, if the override is enabled, moves the current number to the front of the list.

The list itself lives in `prHistoryStore`, which owns the dedupe-and-cap rule.

**Page reload** (`src/handlers/reloadTab.js`, `src/ui/initReloadBlock.js`) — a "Перезагрузить страницу" button under the PR input reloads the active tab. It is shown only while the current override — PR number, the enabled flag, _or_ the selected app — differs from what was in effect when the popup opened, and hides again when all of them return to that baseline or after the reload is triggered (the click makes the current state the new baseline). The baseline for each part is captured from the first `subscribe()` delivery; comparison goes through the stores rather than the DOM controls, so programmatic changes such as a history tag click move it too.

**VPN check** (`src/handlers/checkVpn.js`) — requests a unique marker URL on `invest-test.alfabank.ru` and watches `webRequest` `onCompleted`/`onErrorOccurred`. A DNS failure (`ERR_NAME_NOT_RESOLVED` / `ERR_NAME_RESOLUTION_FAILED`) means no VPN; any other error still counts as connected. Resolves `false` after a 4s timeout. The `finish()` guard makes resolution single-shot and tears down both listeners.

**Stand detection** (`src/handlers/getStand.js`) — maps the active tab's hostname to `int` / `local-int` / `local-prod`. `invest.alfabank.ru` is ambiguous, so it injects a script that scans inline `<script>` contents for `_PR_NUM` to tell `prelive` from `prod`. Unrecognized hosts return `unknown`, which `initStandBlock.js` renders as an em dash.

## Lint configuration

ESLint has **no browser env preset** — globals are enumerated explicitly in `eslint.config.js`. Using a new global (e.g. `localStorage`, `navigator`) requires adding it to that `globals` map or `no-undef` will fail.

`eslint.config.js` itself is CommonJS and has its own config block overriding `sourceType` to `script`; everything under `src/` is ESM.

Beyond `js.configs.recommended`, the enforced rules are `curly` and `padding-line-between-statements` — the latter requires blank lines after variable declaration groups, after `if` blocks, and before `return`. Prettier (100 cols, single quotes, trailing commas) owns formatting and is layered via `eslint-config-prettier`.
