# Requirements Document

## Introduction

BIS Sarathi is an evidence-first conversational service-orchestration layer for the Indian Standards (BIS) information and service ecosystem, built for Smart India Hackathon 2026 (Problem Statement 26107, Team UDDAN).

It is NOT a generic chatbot. It is a structured, grounded assistant that understands natural-language queries from industry users and consumers, looks up seeded/public-source BIS evidence, routes to appropriate workflows, and routes users to official BIS services — while being transparent about the limits of what it can verify.

Core positioning: "Ask naturally. Verify with BIS evidence. Act through the official service."

This is an interactive concept demonstrator. All records are seeded from publicly available BIS sources or are clearly labelled synthetic/mock. No production BIS system connection exists, and the UI must never imply one.

---

## Glossary

- **Sarathi**: The conversational assistant layer powering the application.
- **BIS**: Bureau of Indian Standards — the national standards body of India.
- **IS**: Indian Standard — a numbered standard published by BIS.
- **ISI Mark**: A product certification mark issued by BIS under CRS or voluntary certification schemes.
- **CRS**: Compulsory Registration Scheme — a mandatory product certification pathway under BIS.
- **BIS LIMS**: BIS Laboratory Information Management System — the publicly accessible directory of BIS-recognised laboratories.
- **Licence**: A BIS-issued authorisation for a manufacturer to use the ISI Mark.
- **Evidence Card**: A structured UI component that surfaces the source metadata for a specific record used to generate a response.
- **Service Trace**: A right-panel metadata display showing safe system metadata (intent, query type, route, evidence source, status, next action) — NOT chain-of-thought.
- **Grounding Gate**: The internal system step that decides whether sufficient evidence exists to answer, ask for clarification, or abstain.
- **HUID / Licence Identifier**: A unique identifier for a BIS licence or hallmark.
- **Abstention**: A first-class product outcome where Sarathi explicitly declines to answer due to insufficient evidence.
- **Demo Mode**: The operating mode of this application — all data is seeded/public-source or mock, no live BIS integration.
- **Freshness Label**: A metadata label attached to any data snapshot recording the date it was retrieved (e.g. "retrieved 28 Sep 2026").
- **Presentation Mode**: A full-screen, navigation-reduced UI mode suitable for video recording and judge demonstrations.
- **Industry User**: A manufacturer, MSME, or business entity seeking standards compliance guidance.
- **Consumer User**: An end consumer seeking product safety or complaint-related guidance.
- **EARS**: Easy Approach to Requirements Syntax — the requirements pattern system used in this document.

---

## Requirements

---

### Requirement 1: Demo Mode Transparency

**User Story:** As a judge or user, I want a persistent, unambiguous indication that the application is a demonstration, so that I am never misled into thinking it is connected to live BIS production systems.

#### Acceptance Criteria

1. THE Application SHALL display a persistent top banner on every page with the exact text: "INTERACTIVE DEMO — Uses seeded/public-source demonstration records. Not connected to BIS production systems."
2. THE Application SHALL never render any text that states "Verified by BIS" for any record in the demo dataset.
3. THE Application SHALL never render language that implies live API access, live registry lookup, or production BIS integration.
4. WHEN a mock or synthetic record is displayed, THE Application SHALL visibly label that record with its source type (DEMO, MOCK, or SYNTHETIC — TEST ONLY) using a distinct visual badge.
5. THE Application SHALL display the exact retrieval date ("retrieved 28 Sep 2026") as a freshness label on all snapshotted records.
6. THE Footer SHALL display: "Interactive concept demonstrator using seeded/public-source demo records. Not connected to BIS production systems."

---

### Requirement 2: Application Navigation

**User Story:** As a user, I want clear top-level navigation, so that I can move between the core sections of the application without confusion.

#### Acceptance Criteria

1. THE Application SHALL provide a persistent navigation bar containing links to: Home, Ask Sarathi, Industry, Consumer, Evidence, How It Works, and Demo Data.
2. WHEN a navigation link is activated, THE Application SHALL route the user to the corresponding page without a full browser reload (client-side routing).
3. THE Application SHALL highlight the currently active navigation item.
4. THE Application SHALL provide a "Presentation Mode" button that is accessible from all pages.
5. WHEN Presentation Mode is activated, THE Application SHALL enlarge the UI, hide secondary navigation elements, increase font size, maintain the Demo Mode banner, and produce a clean 16:9-compatible layout suitable for screen recording.
6. WHEN Presentation Mode is deactivated, THE Application SHALL restore the standard navigation layout.
7. THE Application SHALL be responsive, supporting desktop viewports of 1366×768 and 1920×1080 as primary targets, with functional mobile layouts at 768px and below.

---

### Requirement 3: Home Page

**User Story:** As a first-time visitor, I want a clear, professional home page that explains what BIS Sarathi does and gives me a direct path to the demo, so that I can immediately understand the product's value.

#### Acceptance Criteria

1. THE Home_Page SHALL display the application name "BIS SARATHI" and the tagline "Ask naturally. Verify with BIS evidence. Act through the official BIS service."
2. THE Home_Page SHALL display a subtitle describing Sarathi as "An evidence-first conversational service layer for standards discovery, BIS workflows, verification guidance and laboratory discovery."
3. THE Home_Page SHALL provide a primary CTA button labelled "Launch Interactive Demo" that routes to the Ask Sarathi page.
4. THE Home_Page SHALL provide a secondary CTA button labelled "How it works" that routes to the How It Works page.
5. THE Home_Page SHALL display four capability cards with the titles: Standards Discovery, Certification Guidance, Laboratory Discovery, and Consumer Support — each with a concise description drawn from the seeded domain knowledge, not generic placeholder text.
6. THE Home_Page SHALL display a visible demo mode notice: "Demo mode • Seeded/public-source records • No production BIS connection."
7. THE Home_Page SHALL provide a "Choose your journey" section with distinct entry points for Industry / MSME and Consumer pathways.
8. THE Home_Page SHALL present a government-technology aesthetic: restrained, professional, no excessive gradients, no stock AI imagery, no generic SaaS dashboard styling.

---

### Requirement 4: Ask Sarathi — Conversational Interface

**User Story:** As a user, I want to ask questions about BIS standards and services in natural language and receive grounded, evidence-backed responses, so that I can understand and act on standards information without needing expert knowledge.

#### Acceptance Criteria

1. THE Ask_Sarathi_Page SHALL provide a chat message input field and a send button.
2. THE Ask_Sarathi_Page SHALL display a set of at least six quick-start prompt buttons including: "Which standard applies to packaged drinking water?", "Which labs can test against IS 14543?", "What does IS 14543 cover?", "I want to complain about a product carrying an ISI mark.", "Can you verify this licence?", and "Ask something outside the available evidence."
3. WHEN a quick-start prompt is activated, THE Ask_Sarathi_Page SHALL populate the input field and submit the query, triggering the corresponding deterministic demo response.
4. WHEN a query is submitted, THE Ask_Sarathi_Page SHALL display an animated loading sequence with the steps: "Understanding request", "Extracting product attributes", "Searching BIS evidence", "Checking revision/status", "Preparing grounded response" — in that order.
5. WHEN a response is generated, THE Chat_Interface SHALL display the response with any associated Evidence Cards inline.
6. THE Ask_Sarathi_Page SHALL provide a right-side "Service Trace" panel showing: INTENT, QUERY TYPE, ROUTE, EVIDENCE SOURCES, EVIDENCE STATUS, and NEXT ACTION — populated from safe system metadata only, never chain-of-thought.
7. THE Service_Trace_Panel SHALL provide a "Show Service Trace" toggle that shows or hides the panel.
8. WHEN evidence is insufficient to answer a query, THE Chat_Interface SHALL display the UNABLE TO VERIFY outcome (see Requirement 10 — Abstention).
9. THE Ask_Sarathi_Page SHALL support a "Demo Scenario Switcher" control with the options: Industry, Lab, Consumer, Verification, Complaint, Trust Test — where activating a scenario immediately populates the corresponding journey.

---

### Requirement 5: Industry Journey

**User Story:** As an industry user or MSME, I want a guided multi-step workflow that helps me identify the correct BIS standard for my product, understand certification obligations, and find relevant testing laboratories, so that I can begin the compliance process confidently.

#### Acceptance Criteria

1. THE Industry_Journey SHALL guide the user through seven steps in order: Product Description, Attribute Extraction, Candidate Standards, Applicability and Version Checks, Certification and Regulatory Guidance, Testing and Lab Discovery, and Evidence and Next Action.
2. WHEN the primary demo input "I manufacture packaged drinking water. Which BIS standard should I investigate?" is submitted, THE Industry_Journey SHALL execute the animated loading sequence defined in Requirement 4, Criterion 4.
3. WHEN the loading sequence completes, THE Industry_Journey SHALL display a "Product Understanding" card with the fields: Product (Packaged Drinking Water), Category (Drinking Water), Use (Packaged / Direct Consumption).
4. WHEN the loading sequence completes, THE Industry_Journey SHALL display a "Candidate Standard" card showing IS 14543 — "Packaged Drinking Water (other than Packaged Natural Mineral Water)" with version awareness: "2024 record found" and "Earlier 2016 record also found."
5. THE Industry_Journey SHALL display a "Why this was surfaced" card listing the match reasons: product-category match, packaging/use match, BIS source record, and version metadata available.
6. THE Industry_Journey SHALL display an Evidence Card for IS 14543 with the fields: Source (BIS official source), Record (IS 14543), Source type (Official BIS), Retrieved (28 Sep 2026), and a button to open the official source URL in a new tab.
7. THE Industry_Journey SHALL display a Certification and Regulatory Guidance card sourced only from seeded data — THE Industry_Journey SHALL NOT fabricate clause numbers, specific regulatory obligations, or requirements not present in the seeded dataset.
8. THE Industry_Journey SHALL provide a "Find testing laboratories" action that transitions to the Lab Discovery step.

---

### Requirement 6: Laboratory Discovery

**User Story:** As an industry user, I want to discover BIS-recognised laboratories that can test my product against a specific standard, so that I can plan my testing and certification pathway.

#### Acceptance Criteria

1. WHEN the user activates "Find testing laboratories" from the Industry Journey, THE Lab_Discovery_View SHALL display the selected standard (IS 14543) and a list of seeded laboratory records.
2. THE Lab_Discovery_View SHALL display a location filter (State/Any) enabling the user to narrow results.
3. THE Lab_Discovery_View SHALL label all laboratory data with: "Public BIS LIMS snapshot — retrieved 28 Sep 2026."
4. EACH Laboratory_Record SHALL display: lab name, city/state, standard numbers in scope, scope/category, validity date (where available in the seeded dataset), source URL, and retrieved_at date.
5. THE Lab_Discovery_View SHALL display a notice: "Verify current laboratory status on BIS LIMS before booking/testing."
6. THE Lab_Discovery_View SHALL NOT display a hard-coded total laboratory count as a permanent figure — THE Lab_Discovery_View SHALL reference only the seeded snapshot records present in the demo dataset.
7. WHEN a source URL is available for a laboratory record, THE Lab_Discovery_View SHALL render a link that opens the official BIS LIMS page in a new tab.

---

### Requirement 7: Consumer Journey

**User Story:** As a consumer, I want plain-language explanations of BIS standards and guidance on what I can do about product safety concerns, so that I can understand my rights and take the appropriate action.

#### Acceptance Criteria

1. THE Consumer_Journey SHALL handle the demo query "What does IS 14543 mean?" by displaying a plain-language explanation of IS 14543 sourced from the seeded dataset.
2. THE Consumer_Journey SHALL display an Evidence Card with: Source, Record (IS 14543), Retrieved date, and Revision/status metadata.
3. THE Consumer_Journey SHALL display an "Official Source" button that opens the official BIS resource in a new tab.
4. THE Consumer_Journey SHALL provide three action buttons: "Find a laboratory", "Ask about certification status", and "Prepare a complaint."
5. WHEN "Find a laboratory" is activated from the Consumer Journey, THE Application SHALL route to the Lab Discovery view.
6. WHEN "Prepare a complaint" is activated from the Consumer Journey, THE Application SHALL route to the Complaint Journey.

---

### Requirement 8: Complaint Preparation Journey

**User Story:** As a consumer who believes a product's ISI marking is incorrect, I want help structuring a formal complaint, so that I can prepare a complete, accurate complaint before submitting it through the official BIS channel.

#### Acceptance Criteria

1. WHEN the demo query "I purchased a product carrying an ISI mark and I think the marking may be incorrect" is submitted, THE Complaint_Journey SHALL extract and display the following fields: Product, Issue Category, Brand/Manufacturer, Licence/Identifier, Purchase Context, Description, Desired Resolution, and Attachments.
2. WHEN required fields are missing, THE Complaint_Journey SHALL identify the missing fields and prompt the user to provide them with specific action buttons (e.g. "Add product", "Add licence/mark number", "Add purchase details").
3. THE Complaint_Journey SHALL display a structured complaint draft once sufficient fields are provided.
4. THE Complaint_Journey SHALL display a notice: "AI prepares the draft. The user reviews and confirms before any official action."
5. THE Complaint_Journey SHALL provide "Edit", "Review", and "Open official complaint channel" buttons.
6. WHEN "Open official complaint channel" is activated, THE Application SHALL open the official BIS complaint URL in a new tab.
7. THE Complaint_Journey SHALL NOT submit any data to any backend, server, or external service.
8. THE Complaint_Journey SHALL NOT display a "Submit to BIS" button or any button that implies automated submission to BIS systems.

---

### Requirement 9: Licence/Mark Verification Journey

**User Story:** As a user, I want to verify a BIS licence or ISI mark identifier, so that I can understand whether a product's claimed certification is plausible — with a clear understanding that the demo result is not a live BIS registry lookup.

#### Acceptance Criteria

1. THE Verification_Journey SHALL accept a licence/identifier input — the primary demo input SHALL be "DEMO-LIC-001."
2. WHEN "DEMO-LIC-001" is submitted, THE Verification_Journey SHALL display a result visibly labelled "DEMO VERIFICATION RECORD."
3. THE Verification_Result SHALL display: Status (Sample/Mock), Source (Demo dataset), and a notice that it is "Not connected to BIS production registry."
4. THE Verification_Result SHALL NOT display any text that states "Verified by BIS."
5. THE Verification_Result SHALL NOT use a green verified badge or visual treatment that implies live production verification.
6. THE Verification_Result SHALL display a warning banner distinguishing the demo result from a live BIS registry lookup.

---

### Requirement 10: Abstention — Unable to Verify

**User Story:** As a judge or user, I want to see that Sarathi explicitly declines to answer when it lacks sufficient evidence, so that I can trust that the system will not fabricate or hallucinate BIS information.

#### Acceptance Criteria

1. WHEN the query "Does BIS require certification for a completely new product category that is not covered in the available evidence?" is submitted, THE Grounding_Gate SHALL determine that available evidence is insufficient and trigger the abstention outcome.
2. WHEN the abstention outcome is triggered, THE Chat_Interface SHALL display a response labelled "UNABLE TO VERIFY" with the message: "I could not not verify this reliably from the available BIS evidence. I will not guess."
3. THE Abstention_Response SHALL display a "Why?" explanation with two stated reasons: "No authoritative evidence found" and "Insufficient current regulatory data."
4. THE Abstention_Response SHALL provide a CTA button labelled "Open official BIS resource" that opens the official BIS website in a new tab.
5. THE Abstention_Response SHALL be styled distinctly from a standard answer — using a warning/neutral colour treatment rather than a success/answer colour treatment.
6. THE Application SHALL treat abstention as a first-class positive product feature, not as an error state.

---

### Requirement 11: Evidence Page

**User Story:** As a judge or transparency-conscious user, I want to browse all evidence records used by the system, so that I can verify the sourcing and understand what data underpins the demo.

#### Acceptance Criteria

1. THE Evidence_Page SHALL display all seeded evidence records in a searchable card layout.
2. EACH Evidence_Card SHALL display: source, standard/record identifier, record type, retrieved date, authority, version/revision, why used, and official URL.
3. EACH Evidence_Card SHALL carry a source badge from the set: OFFICIAL BIS, PUBLIC BIS LIMS, DEMO, MOCK, or SYNTHETIC — TEST ONLY.
4. THE Evidence_Page SHALL provide a search/filter input enabling filtering by standard number, source type, or record type.
5. THE Evidence_Page SHALL visually distinguish OFFICIAL BIS and PUBLIC BIS LIMS records from DEMO, MOCK, and SYNTHETIC records — they SHALL NOT share the same visual treatment.

---

### Requirement 12: Demo Data Transparency Page

**User Story:** As a judge or auditor, I want a dedicated page that fully documents the demo dataset, so that I can understand exactly what data the application uses and how it was sourced.

#### Acceptance Criteria

1. THE Demo_Data_Page SHALL contain three sections: "Public/source-derived records", "Mock verification records", and "Synthetic test records."
2. THE Demo_Data_Page SHALL explain for each section the provenance of the records and why they are used.
3. THE Demo_Data_Page SHALL display exact retrieval dates for all snapshotted records.
4. THE Demo_Data_Page SHALL include a statement: "Mock records are used only to demonstrate interaction flows where live authorized BIS integration is unavailable."
5. THE Demo_Data_Page SHALL NOT present mock or synthetic records in a manner that could be mistaken for authoritative BIS records.

---

### Requirement 13: How It Works Page

**User Story:** As a judge or evaluator, I want a clear visual explanation of the system architecture and evidence pipeline, so that I can assess the technical design and the grounding mechanism.

#### Acceptance Criteria

1. THE How_It_Works_Page SHALL display a visual pipeline with the steps: USER → LANGUAGE + INTENT → QUERY PLANNER → STRUCTURED LOOKUP / HYBRID RETRIEVAL → EVIDENCE VALIDATION → GROUNDING GATE → ANSWER / CLARIFY / ABSTAIN → NEXT OFFICIAL ACTION.
2. EACH pipeline step SHALL be accompanied by a short plain-language explanation (no jargon, no internal implementation detail).
3. THE How_It_Works_Page SHALL display three outcome states with their labels and descriptions: HIGH / SUPPORTED (Answer with evidence), MEDIUM / NEEDS CLARIFICATION (Ask for additional information), LOW / UNABLE TO VERIFY (Abstain and route to official source).
4. THE How_It_Works_Page SHALL include the statement: "The model explains the evidence. BIS evidence decides."
5. THE How_It_Works_Page SHALL NOT expose internal chain-of-thought or implementation details beyond what is described in the pipeline.

---

### Requirement 14: Seeded Data Integrity

**User Story:** As a system, I want all responses to be derived only from the seeded dataset, so that no information is fabricated, hallucinated, or sourced from untrained model knowledge during the demo.

#### Acceptance Criteria

1. THE Seeded_Dataset SHALL contain at minimum: IS 14543 standard record (both 2024 and 2016 associations), at least three BIS LIMS laboratory records for IS 14543 sourced from publicly available BIS LIMS data, the DEMO-LIC-001 mock verification record, and at least one synthetic test record.
2. THE Application SHALL source all chat responses from the seeded dataset using deterministic lookup — THE Application SHALL NOT generate responses using live LLM inference at runtime.
3. THE Application SHALL NOT invent BIS standard numbers, clause numbers, laboratory names, or regulatory requirements not present in the seeded dataset.
4. THE Application SHALL NOT use placeholder text (lorem ipsum or generic filler) anywhere in the UI.
5. THE Application SHALL NOT display any label that uses the word "live" to describe demo data.
6. ALL demo journeys SHALL work deterministically from a clean browser without any external dependencies, API keys, or network requests to BIS or third-party services.

---

### Requirement 15: Visual Design and Quality

**User Story:** As a judge, I want a polished, credible, professional UI that looks like a real government-technology product, so that I can evaluate the product concept on its merits without being distracted by poor visual quality.

#### Acceptance Criteria

1. THE Application SHALL use a restrained professional colour palette appropriate to Indian government-technology products — no excessive gradients, no stock AI imagery.
2. THE Application SHALL use subtle animations only — no gratuitous motion, no distracting transitions.
3. THE Application SHALL not contain any dead (non-functional) buttons, broken routes, or non-functional UI elements.
4. THE Application SHALL not contain lorem ipsum or generic placeholder text in any user-visible area.
5. THE Application SHALL be built with React / Next.js, TypeScript, Tailwind CSS, and shadcn/ui or equivalent component library.
6. THE Application SHALL require no backend, no authentication, and no API keys to run.
7. THE Application SHALL work from a clean browser without external runtime dependencies.
8. THE Footer SHALL contain: application name, "SIH 2026 • PS 26107 • UDDAN", the demo disclaimer, and external links to Official BIS, BIS Standards, BIS LIMS, and BIS Care — each opening in a new tab.
