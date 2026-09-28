# BIS Sarathi — Working Guide

## What problem does this solve?

India's Bureau of Indian Standards (BIS) publishes hundreds of Indian Standards (IS), operates a compulsory certification scheme (the ISI mark), and maintains a public Laboratory Information Management System (LIMS). However, navigating this ecosystem is genuinely hard:

- An MSME or manufacturer trying to certify a new product has to know *which* IS standard applies, *which revision* is currently in force, and *which accredited labs* can test against it — information scattered across multiple portals.
- A consumer who buys a product bearing the ISI mark has no quick way to check whether that mark is real, understand what the standard actually means, or know how to raise a complaint if the product is substandard.
- BIS's own portals are authoritative but require navigating legacy government web interfaces that don't support natural-language queries.

The result is that legitimate regulatory information exists but is effectively inaccessible to most people — manufacturers over-rely on consultants, and consumers rarely exercise their rights under the Standards and Quality Control Act.

---

## How BIS Sarathi helps

BIS Sarathi is a proof-of-concept AI assistant that acts as a grounded intermediary between users and BIS's public data. The core design principle is:

> **"The model explains the evidence. BIS evidence decides."**

Instead of generating answers from general training data (which can hallucinate clause numbers, invent labs, or confuse superseded standards), Sarathi:

1. **Classifies the user's intent** — is this a standards discovery query, a lab lookup, a consumer education question, a complaint preparation, or a verification request?
2. **Routes to seeded, public-source evidence** — every answer is backed by a specific record (an official BIS standard, a BIS LIMS lab snapshot, or a mock verification record) that the user can inspect directly.
3. **Shows its work** — a Service Trace panel exposes the intent, query type, route taken, evidence sources consulted, evidence status, and recommended next action for every response.
4. **Abstains rather than guesses** — if no grounded evidence supports an answer, Sarathi returns "UNABLE TO VERIFY" and directs the user to the official BIS website rather than fabricating a plausible-sounding answer.
5. **Never submits anything on the user's behalf** — complaint drafts are prepared for review; the user navigates to the official BIS Care portal themselves. Verification results are always labelled as demo records.

---

## How to start the application

### Prerequisites

- Node.js 18 or later
- npm 9 or later (bundled with Node.js)

### Steps

```bash
# 1. Navigate to the application directory
cd bis-sarathi

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

No environment variables, API keys, or backend services are required — the entire demo runs client-side with seeded data.

### Other useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Production build (outputs to `.next/`) |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint check across the project |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run all tests once and exit (CI-friendly) |

---

## Demo walkthrough — six scenarios

The demo is entirely self-contained. All responses are pre-seeded; typing is not required — use the **Quick Start Prompts** or the **Demo Scenario Switcher** on the Ask Sarathi page.

Navigate to **http://localhost:3000/ask** to begin.

---

### Scenario 1 — Standards Discovery (Industry / MSME)

**Trigger:** Click "Packaged drinking water standard?" or type anything containing *packaged drinking water*, *bottled water*, *IS 14543*, or *water certification*.

**What happens:**
- Sarathi identifies the product category and extracts attributes (packaged drinking water, consumer use).
- It surfaces two candidate standards: **IS 14543:2024** (current, 4th revision) and **IS 14543:2016** (superseded 3rd revision).
- A Product Understanding card explains why each standard was matched.
- An Evidence card links to the official BIS catalogue entry for each standard.

**Expected result:** You see which standard is currently in force, that the 2016 edition is superseded, and a direct link to the official BIS source — no fabricated clause numbers.

---

### Scenario 2 — Laboratory Discovery

**Trigger:** Click "Find testing labs for IS 14543" or type anything containing *lab*, *laboratory*, *LIMS*, or *testing lab*.

**What happens:**
- Sarathi shows a list of 5 labs drawn from a public BIS LIMS snapshot (retrieved 28 Sep 2026).
- Each Lab Card shows the lab name, city, state, applicable standard, scope category, and a link to the BIS LIMS source.
- A location filter lets you narrow by state.

**Expected result:** You see real lab names from the BIS LIMS public portal, each clearly labelled as a snapshot record with its retrieval date. The notice "Verify current laboratory status on BIS LIMS before booking/testing" is always visible.

---

### Scenario 3 — Consumer Education

**Trigger:** Click "What does IS 14543 mean for consumers?" or type anything containing *what is IS 14543*, *explain IS*, or *simple terms*.

**What happens:**
- Sarathi returns a plain-language explanation of what IS 14543 covers and why the ISI mark matters for packaged drinking water.
- An Evidence card backs the explanation with the official BIS standard record.
- Three action buttons let you proceed to lab discovery, ask about certification status, or prepare a complaint.

**Expected result:** A clear, jargon-free explanation sourced from the seeded standard data, with a link to the official BIS source and clear next-step options.

---

### Scenario 4 — Complaint Preparation

**Trigger:** Click "Help me complain about a substandard product" or type anything containing *complain*, *complaint*, *defective*, *faulty*, or *grievance*.

**What happens:**
- Sarathi shows a Complaint Draft card with pre-populated fields from the demo query (product name, description of issue).
- Fields that would normally be missing in a real complaint (licence/ISI mark number, purchase details) are highlighted with action prompts.
- Three next-step buttons guide the user through reviewing the draft and opening the official BIS Care portal.

**Expected result:** A structured complaint draft with missing-field indicators. The button to act is labelled **"Open BIS Care Portal"** — there is no "Submit to BIS" button at any step, because Sarathi never submits data to any external service.

---

### Scenario 5 — Licence/Mark Verification

**Trigger:** Click "Verify licence DEMO-LIC-001" or type anything containing *verify*, *verification*, *licence*, *license*, *authentic*, or *ISI mark check*.

**What happens:**
- Sarathi looks up the identifier DEMO-LIC-001 in the seeded verification record.
- A Verification Result card is rendered with an amber warning banner: **"DEMO VERIFICATION RECORD — not connected to BIS production registry"**.
- The status, source, and a prominent disclaimer are all displayed.

**Expected result:** A verification result that is explicitly labelled as a demo record at every level. There is no green "Verified by BIS" badge — the demo never claims to verify anything against a live BIS registry.

---

### Scenario 6 — Trust Test (Abstention)

**Trigger:** Click "Is product X certified?" or type any query that does not match a known keyword pattern (e.g. *tell me about climate change*, or any out-of-scope question).

**What happens:**
- Sarathi returns an **"UNABLE TO VERIFY"** response in purple-neutral styling.
- The exact message: *"I could not verify this reliably from the available BIS evidence. I will not guess."*
- Two reasons are given: "No authoritative evidence found" and "Insufficient current regulatory data".
- An "Open official BIS resource" button directs the user to the BIS website.

**Expected result:** Sarathi refuses to fabricate an answer and redirects to the official source. This is the correct, safe behaviour for out-of-scope or unverifiable queries.

---

## Other pages

| Page | URL | What it shows |
|---|---|---|
| Home | `/` | Overview, capability cards, journey entry points |
| Industry Journey | `/industry` | Step-by-step guided flow for manufacturers/MSMEs |
| Consumer Journey | `/consumer` | Consumer-focused explanation and action flow |
| Evidence | `/evidence` | Searchable catalogue of all 9 seeded evidence records, filterable by source type |
| How It Works | `/how-it-works` | Visual pipeline diagram and plain-language explanation of how Sarathi processes queries |
| Demo Data | `/demo-data` | Provenance table for all seeded data — which records are official, which are mock, and why |

---

## Presentation Mode

The **Presentation Mode** toggle in the top-right of the navigation bar is designed for screen recording and live demos. When active:

- Secondary navigation links (Evidence, How It Works, Demo Data) are hidden to reduce visual clutter.
- Font sizes and card padding are increased for readability on projected screens.
- The Demo Banner remains visible at all times (it cannot be dismissed).

Toggle it off to return to the full navigation.

---

## What the demo does NOT do

Being explicit about the demo's boundaries is part of its design:

- It is **not connected to any BIS production system**. All data is seeded from public sources snapshotted on 28 Sep 2026.
- The verification flow uses a **mock record** (DEMO-LIC-001). It does not query the BIS licence registry.
- Lab records are a **public BIS LIMS snapshot** — they reflect status as of the retrieval date and may be out of date. Always verify current lab status directly on BIS LIMS before booking testing.
- The complaint flow **prepares a draft only**. No data is sent to BIS or any other service.
- The AI routing is **keyword-based**, not a large language model inference in production. The demo simulates the retrieval pipeline to show what a grounded AI assistant could do.

---

## Running the tests

```bash
cd bis-sarathi

# Run all 215 tests once
npm run test:run

# Run in watch mode during development
npm run test
```

The test suite covers:
- Unit tests for all components and pages (Tasks 13.1–13.12)
- 14 property-based tests using fast-check (Tasks 14.1–14.14), verifying invariants such as:
  - The demo banner is always present
  - "Verified by BIS" never appears in any output
  - "Submit to BIS" never appears in the complaint journey
  - Arbitrary unknown queries always trigger abstention
  - All evidence records have complete, non-empty required fields
  - Freshness labels always read "28 Sep 2026" across all seed records
