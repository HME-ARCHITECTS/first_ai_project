# 🎤 AI-Driven Development: From Autocomplete to Architect

> **"We are moving from 'Writing Code' to 'Directing Intelligence.'"**

---

## 📖 Agenda

| # | Topic | What You'll Learn |
|---|-------|-------------------|
| 1 | The Old Way vs. The New Way | Why "AI as autocomplete" leaves 80% on the table |
| 2 | Layer 1: Global Instructions | How `copilot-instructions.md` sets the "House Rules" |
| 3 | Layer 2: Repo Memory | How the AI remembers context across sessions |
| 4 | Layer 3: Spec-Driven Development | How a Markdown spec becomes working code |
| 5 | Live Demo | Building a full-stack feature from Spec 01 |

---

## 1️⃣ The Old Way vs. The New Way

### ❌ AI as "Fancy Autocomplete"
```
Developer types: function validate
AI suggests:     validateEmail(email: string) { ... }
```
- One line at a time
- No project awareness
- No architectural consistency
- Developer still architects everything

### ✅ AI as "Senior Pair Programmer"
```
Developer provides: A spec + global instructions + context
AI generates:       Full-stack feature (React component + Express route + Zod schema)
```
- Understands your stack, your users, your constraints
- Maintains type safety across frontend and backend
- Follows your team's coding standards automatically

> **The difference?** Context. The more context you give, the more the AI shifts from *guessing* to *engineering*.

---

## 2️⃣ Layer 1: Global Instructions (`copilot-instructions.md`)

### What is it?
A file at `.github/copilot-instructions.md` that the AI reads **before every interaction** in this repo.

### Analogy
Think of it as the **onboarding document** you'd give a new senior developer on Day 1:
- "Here's our stack"
- "Here's how we structure code"
- "Here are the rules you must never break"

### What goes in it?

| Section | Purpose | Example |
|---------|---------|---------|
| **Project Context** | Who are the users? What problem are we solving? | "Mobile-first tool for hardware installers wearing gloves" |
| **Technical Stack** | What technologies? What versions? | "React 19 + Vite, Node.js 24 + Express, TypeScript strict" |
| **Coding Principles** | Non-negotiable rules | "All coordinates must be normalized 0.0–1.0" |
| **Safety & Guardrails** | Security constraints | "Never call hardware IPs from the frontend" |

### Our file: `.github/copilot-instructions.md`
```
📁 .github/
  └── copilot-instructions.md   ← AI reads this FIRST, every time
📁 client/
📁 server/
📁 shared/
📁 specs/
```

### Key Insight
> Without this file, the AI has **zero** project context. It might suggest Next.js when you use Vite, or Prisma when you use in-memory storage. With it, the AI is **pre-calibrated** to your architecture.

---

## 3️⃣ Layer 2: Repo Memory

### What is it?
A **local notebook** the AI maintains about what it has learned while working on your project. Stored at `/memories/repo/` — not in git, not visible to teammates.

### How is it different from `copilot-instructions.md`?

| | `copilot-instructions.md` | Repo Memory |
|---|---|---|
| **Who writes it** | You (the team) | The AI (automatically) |
| **Lives in** | Git repo (`.github/`) | Local machine (`/memories/repo/`) |
| **Purpose** | **Rules**: "How to code" | **Facts**: "What was built" |
| **Shared with team** | ✅ Yes (checked in) | ❌ No (per-machine) |
| **Analogy** | Team coding standards | Developer's personal notes |

### What gets stored?
```markdown
# Example: /memories/repo/project-structure.md

- Monorepo with npm workspaces: shared/, server/, client/
- Server runs on port 3001, client on 5173
- Shared package exports Zod schemas: StoreSessionSchema, PointOfInterestSchema
- Build order: shared → server → client
```

### Why it matters
Without repo memory, every new chat session starts **from scratch** — the AI must re-explore the codebase. With it, the AI picks up exactly where it left off.

### How to activate it
Add this to your `copilot-instructions.md`:
```markdown
## 🧠 Memory Management
- After completing a spec, update repo memory with the key facts.
- Before starting work on a spec, check repo memory for prior context.
```

---

## 4️⃣ Layer 3: Spec-Driven Development

### The Core Idea
> **A well-written Markdown spec in the repo is worth 1,000 prompts.**

Instead of having a back-and-forth chat trying to explain what you want, you write a **precise spec** that the AI can execute in one shot.

### The Spec Anatomy

```markdown
# Spec 01: Vision AI Placement Marker

## User Story
As an Installer,
I want to tap on a live video stream,
So that I can register a "Detection Point" with normalized coordinates.

## Functional Requirements
1. Display MJPEG stream in 16:9 aspect ratio
2. Overlay transparent canvas for click capture
3. Convert clicks to normalized coordinates (0.0–1.0)

## Data Schema (TypeScript + Zod)
interface PointOfInterest {
  id: string;      // UUID
  x: number;       // 0.0 - 1.0
  y: number;       // 0.0 - 1.0
  timestamp: string;
}

## Validation Rules
- storeId must match pattern [AA]-[000]
- cameraSlot must be integer 1–16
```

### Why this works

| Traditional Prompt | Spec-Driven Prompt |
|---|---|
| "Make a component that shows a video and lets me click on it" | "Execute spec 01" |
| AI guesses: aspect ratio? coordinates? validation? | AI knows: 16:9, normalized, Zod schema, glove-friendly |
| Result: 40-60% correct, needs iterations | Result: 80-90% correct, first pass |

### The Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Product     │     │  Eng Lead /  │     │     AI       │
│   Manager     │────▶│  Architect   │────▶│  (Copilot)   │
│              │     │              │     │              │
│  User Story  │     │  + Technical │     │  Generates   │
│  (the What)  │     │    Detail    │     │  Working Code│
│              │     │  (the How)   │     │  (the Build) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                    specs/01-feature.md
                    (Source of Truth)
```

### The Three Layers Working Together

```
┌─────────────────────────────────────────────────┐
│           copilot-instructions.md                │  ← "House Rules"
│  Stack: React 19 + Express + TypeScript          │     (applies to ALL specs)
│  Rules: Normalized coords, 48px hit targets      │
├─────────────────────────────────────────────────┤
│           /memories/repo/                        │  ← "What I've Built"
│  "shared/ has StoreSessionSchema"                │     (grows over time)
│  "server runs on port 3001"                      │
├─────────────────────────────────────────────────┤
│           specs/01-camera-marker.md              │  ← "What to Build Next"
│  User story + schemas + validation rules         │     (one spec per feature)
└─────────────────────────────────────────────────┘
                      │
                      ▼
              "Execute spec 01"
                      │
                      ▼
         ┌────────────────────────┐
         │   Full-Stack Output:   │
         │  • React component     │
         │  • Express route       │
         │  • Shared Zod schema   │
         │  • Type safety across  │
         │    frontend & backend  │
         └────────────────────────┘
```

---

## 5️⃣ Live Demo: Executing Spec 01

### What we'll do
1. Show the skeleton project (already scaffolded)
2. Show the spec file (`specs/01-camera-placement-marker.md`)
3. Say: **"Execute spec 01"**
4. Watch the AI generate:
   - Shared Zod schemas ✅ (already in skeleton)
   - Express routes for sessions and POIs ✅ (already in skeleton)
   - React video canvas with click-to-mark
   - Marking mode toggle (glove-friendly)
   - Normalized coordinate calculation
   - LocalStorage offline queue
5. Verify: Same Zod schema validates on **both** frontend and backend

### The "Aha!" Moment
> The AI didn't just write React code. It wrote a **full-stack feature** that:
> - Follows the architecture from `copilot-instructions.md`
> - Uses the exact interfaces from the spec
> - Validates data identically on client and server
> - Handles the offline case (LocalStorage queue)
> - Uses 48px hit targets for glove-friendly UX

---

## 🔑 Key Takeaways

1. **Instructions = Onboarding** — `copilot-instructions.md` is Day 1 for the AI. Write it once, benefit every session.

2. **Memory = Continuity** — Repo memory lets the AI maintain context across conversations, like a developer who remembers yesterday's work.

3. **Specs = Precision** — A Markdown spec bridges the gap between a Jira story and working code. The more precise the spec, the better the output.

4. **The formula:**
   > `Global Instructions` + `Repo Memory` + `Precise Spec` = **80–90% correct code on first pass**

5. **Your role shifts** — From writing boilerplate to **directing intelligence**. You become the architect; the AI becomes the builder.

---

---
## 🚀 Execution Prompts (Copy & Paste into Copilot Chat)

Use these prompts to execute this spec incrementally. Each prompt builds on the previous layer.

### Step 1 — Shared Schema Tests
```
Execute spec 01 — shared schema tests first (Suite 1)
```

### Step 2 — Pure Utility Functions
```
Execute spec 01 — FR-3 (coordinateMapper), FR-5 (pinRenderer), FR-7 (offlineQueue) + test Suites 2 and 3
```

### Step 3 — React Components
```
Execute spec 01 — FR-1 (SessionForm), FR-2 (VideoCanvas), FR-4 (MarkingToggle), FR-6 (MarkingContext) + PoiList, Toast + test Suites 4 and 5
```

### Step 4 — Server Tests
```
Execute spec 01 — server test Suites 6 and 7
```

### Step 5 — Wire Up App
```
Execute spec 01 — wire up App.tsx with the full component tree, verify npm run build and npm run test pass
```

### Full Execution (Single Prompt)
```
Execute spec 01 — full implementation following the Implementation Checklist
---

## 📚 File Reference

| File | Purpose | Who Maintains |
|------|---------|---------------|
| `.github/copilot-instructions.md` | Global AI rules for this repo | Team (in git) |
| `/memories/repo/*.md` | AI's learned facts about this project | AI (local) |
| `specs/01-*.md` | Feature spec (source of truth) | PM + Lead + Architect |
| `shared/src/schemas.ts` | Zod schemas (shared types) | AI generates from spec |
| `server/src/routes/*.ts` | Express API routes | AI generates from spec |
| `client/src/components/*.tsx` | React components | AI generates from spec |


