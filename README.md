# NiceBaby.io

A privacy-first newborn tracker blueprint. The project outlines how to build **Baby Rhythm**—a collaborative, offline-first
PWA that captures feeds, diapers, sleep, growth, medical records, and meaningful memories while keeping family data under
your control. The UI scaffolding in this repo mirrors the product guide so design, engineering, and operations can stay
aligned from MVP → v1.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to browse the full implementation plan. No Docker or self-hosted stack is required; the site is
a content prototype for the product direction.

## Implementation Guide Highlights

### 1. Product Goals & Metrics
- 1–2 tap logging even in sleep-deprived states.
- Offline-first storage with optional encrypted sync.
- Trustworthy insights that only alert when thresholds matter.
- Success metrics: ≤5s to start core timers, ≥95% offline retention, <1 false nudge/day.

### 2. Personas & Top Tasks
- **Parent logger**: fast capture, “what’s next” radar, reassurance.
- **Partner & helpers**: delegated access, shared routines, quick logging shortcuts.
- **Pediatrician**: concise growth packet, exportable timeline, medication/vaccine summary.

### 3. Platforms & Architecture
- PWA-first React/Preact client with Tailwind-style utilities.
- IndexedDB/SQLite local store with append-only outbox queue.
- Supabase/Postgres or Firebase/Firestore sync layer with encrypted blob storage.
- n8n automations for digests, calendar sync, notifications, and packet lifecycles.

### 4. Core Modules
- Feeding, diaper, sleep, soothing, pumping, growth, medical, caregiver coordination, memories, guidance.
- WHO/CDC LMS growth charts, anomaly detection, predictive nap windows, and encrypted document vault.

### 5. Offline & Sync Strategy
- Outbox queue batches up to 50 operations per reconnect.
- Conflict policies per entity (timer merges, history table for text).
- Attachments stored with content-hash references and resume-safe uploads.

### 6. Rules & Guidance
- Sliding window rule engine (few wet diapers, long wake windows, asymmetric breast usage, medication windows).
- Zod-validated `RuleThreshold` configs with sensitivity controls and quiet hours.
- Contextual nudges with inline resources and caregiver-specific delivery channels.

### 7. Security & Privacy
- Local-only mode plus synced mode with per-family space keys and invite key wrap.
- Roles (Owner/Parent/Helper/Viewer), passcode/biometric lock, audit log, encrypted exports.
- PII minimization in pediatrician packets and medical-disclaimer guardrails.

### 8. Integrations & Automations
- ICS export + optional CalDAV two-way sync for appointments.
- n8n flows for 07:00 caregiver digests, rules webhooks, pediatrician packet links, and smart-home hooks.
- Focused REST endpoints: `POST /outbox`, `GET /timeline`, `POST /pdf/doctor-packet`.

### 9. Roadmap & QA
- **MVP (0–6 weeks)**: auth optional, single baby, core timers, offline queue, baseline insights, PDF packet.
- **v1 (6–16 weeks)**: medical modules, caregiver invites with key wrap, memory timeline, predictive naps.
- **Stretch**: full-entity E2EE, CalDAV two-way, multi-baby dashboard, OCR + on-device media intelligence.
- QA checks: 48h offline logging, race conditions across caregivers, E2EE export/import, PWA + accessibility audits.

For the full blueprint—including detailed data models, analytics dashboards, and pediatrician packet requirements—open the
local site and explore each section.
