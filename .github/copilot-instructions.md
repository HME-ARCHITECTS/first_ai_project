# 🤖 GitHub Copilot Project Instructions

## 🌐 Project Context
- **Project Name:** Vision AI Installer Tool
- **Goal:** A mobile-first field tool for QSR camera calibration and point-of-interest (POI) tagging.
- **Users:** Hardware installers working in physical retail environments (often wearing gloves, low-light, or poor Wi-Fi).

## 🏗️ Technical Stack (The "Source of Truth")
- **Frontend:** React 19+ (Vite-based SPA)
- **Backend:** Node.js 24+ with Express.js (REST API)
- **Language:** TypeScript (Strict mode, shared types in `/shared` folder)
- **UI:** Tailwind CSS + Lucide React (Icons)
- **State Management:** React Context + LocalStorage (Offline-first)
- **Validation:** Zod for API request/response schemas

## 📏 Coding Principles
1. **Architectural Separation:** - Frontend logic stays in `/client`.
   - Backend Node.js logic stays in `/server`.
   - Shared interfaces stay in `/shared`.
2. **Normalized Coordinates:** All spatial data ($x, y$) must be calculated as decimals ($0.0$ to $1.0$) relative to the parent video container.
3. **Mobile-First Field UX:** - Minimum hit-target: `48x48px` for glove-friendly interaction.
   - High-contrast colors: `#FF0000` (Safety Red) for pins, `#39FF14` (Neon Green) for status.
4. **Hardware Communication:** Node.js (Backend) acts as a proxy for the Vision AI hardware. Never call hardware IPs directly from the React frontend.
5. **Full-Stack Error Handling:** Node.js must return standardized error codes (400, 401, 503) that the React frontend catches and displays as user-friendly "Toast" notifications.

## 📋 Prompting Standards for the Team
- **Bridge Development:** When creating a feature, ask: *"Generate the React marking component and the corresponding Express controller to save the POI data."*
- **Feature Specs:** Always reference `/specs` using the `@` symbol.
- **Unit Testing:** Use **Vitest** for React components and **Supertest** for Node.js API routes.

## ⚠️ Safety & Guardrails
- **CORS Management:** Always configure CORS in the Node.js backend to only allow the React frontend's origin.
- **Data Integrity:** Prioritize `LocalStorage` queuing if the Node.js backend is unreachable.

## 🧠 Memory Management
- After completing a spec or making significant architectural changes, update repo memory (`/memories/repo/`) with the key facts (new routes, components, patterns, decisions).
- Before starting work on a spec, check repo memory for prior context.