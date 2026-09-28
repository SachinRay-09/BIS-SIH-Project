# SIH26107 — BIS Sarathi v2.0
## Evidence-First Intelligent Assistant for Indian Standards & BIS Services

**PS ID:** 26107  
**PS Title:** AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers  
**Organisation:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA)  
**Theme:** Smart Automation  
**Category:** Software  
**Working Name:** **BIS Sarathi**  

> **Core proposition:** BIS Sarathi is not a generic chatbot over BIS documents. It is an evidence-first service orchestration layer that converts natural-language requests into the correct BIS information or workflow, validates the evidence, explains the result, and sends the user to the official BIS service when an action or authoritative document is required.

---

## 0. What changed in v2.0

This version keeps the original SIH26107 solution direction but makes it substantially more realistic, defensible, and implementable.

### Major upgrades

1. **From “RAG + tools” to evidence-first service orchestration.**  
   The LLM is no longer treated as the source of truth. A query planner decides whether the request needs deterministic lookup, rules, hybrid retrieval, or a structured workflow.

2. **Real BIS ecosystem data is the target architecture.**  
   Public BIS sources such as the Standards portal, BIS Care and BIS LIMS are treated as service/data sources. A local snapshot/cache can be used for the hackathon when an authorized live API is unavailable.

3. **BIS LIMS replaces fictional lab records as the conceptual source.**  
   The public BIS LIMS site currently exposes a recognized-lab directory and searchable lab scopes/IS-number associations. A prototype may use a dated local snapshot of this public data and must show the retrieval date.

4. **Standards recommendation becomes a structured reasoning pipeline.**  
   Product description → attribute extraction → candidate standards → applicability evidence → version/status check → certification/testing links. The assistant must be allowed to ask a clarification question rather than forcing one answer.

5. **Version and amendment awareness is first-class.**  
   Every standard record should carry revision/year/status/publication/amendment metadata where available.

6. **Confidence becomes an evidence-grounding score.**  
   A single cosine-similarity threshold is not enough. Confidence must combine retrieval relevance, source authority, entity match, evidence coverage, freshness/version validity, and ambiguity penalties.

7. **Citations become evidence cards.**  
   The response should show what source was used, what record/section supports the answer, and when the source was last retrieved.

8. **The legal constraint is converted into a data-access policy.**  
   Public/authorized source material is authoritative evidence. Synthetic data is for training/testing only. Demo/mock registry data is visibly labelled and never presented as official BIS status.

9. **BIS Care is positioned as an existing service to integrate with, not a weak competitor.**  
   BIS Care already supports 12 languages and multiple consumer functions. Sarathi's value is conversational orchestration across services, evidence explanation, decision support and guided workflows—not merely multilingual chat.

10. **Complaint handling becomes a reviewable draft workflow.**  
    Extract → classify → draft → user reviews/consents → official BIS submission/channel.

11. **Privacy, auditability and safe failure are explicitly designed.**  
    PII minimization, redacted logs, user confirmation, evidence provenance and abstention are part of the product rather than optional polish.

12. **MVP scope is narrowed.**  
    Two complete user journeys plus one deliberate “I cannot verify this” journey are more important than many partially working features.

---

# 1. Executive Summary

BIS Sarathi is a conversational, evidence-first assistant for industries, MSMEs, consumers and other users who need to navigate Indian Standards and BIS services.

It accepts a natural-language request such as:

- “I manufacture reusable stainless-steel bottles. Which Indian Standards should I investigate?”
- “Which BIS certification route should I follow?”
- “Which recognized laboratory can test this product?”
- “What does this IS number cover?”
- “I want to complain about a product carrying a BIS mark.”

Sarathi determines the task, extracts relevant entities, selects the appropriate information/service path, retrieves evidence from authorized/public BIS sources, checks source and version metadata, and produces an answer with evidence and a clear next action.

### The key design principle

> **The model explains the evidence. It does not invent the evidence.**

### The three things Sarathi should always do

1. **Identify** — determine what the user is trying to accomplish.
2. **Verify** — obtain the answer from the appropriate authoritative or explicitly labelled source.
3. **Act / guide** — explain the result and route the user to the next official BIS step.

---

# 2. Problem Recap — Directly Mapped to PS26107

BIS publishes thousands of Indian Standards and operates services covering product certification, hallmarking, laboratory recognition, conformity assessment and consumer affairs. Users can struggle to identify applicable standards, certification requirements, schemes, licensing procedures, testing requirements, related standards and technical information because the knowledge is distributed across multiple portals, records, documents and service interfaces.

### Expected solution capabilities

The assistant should be able to:

- Answer questions related to Indian Standards.
- Recommend applicable standards from product descriptions.
- Guide users through BIS certification schemes and processes.
- Answer consumer-related queries.
- Guide users regarding hallmarking.
- Suggest relevant testing laboratories.
- Support multilingual interaction.
- Provide document/standard/clause references where applicable.

### Design response to each PS requirement

| PS need | Sarathi capability |
|---|---|
| Standard questions | Hybrid retrieval + evidence cards |
| Applicable standards | Attribute extraction + standards graph + applicability ranking |
| Certification | Scheme/rules/document retrieval + guided checklist |
| Consumer queries | Consumer workflow + evidence-backed explanations |
| Hallmarking | Dedicated hallmark/HUID intent + structured flow |
| Testing labs | BIS LIMS-backed lab/scope lookup |
| Multilingual | Language detection + translation/Indic language handling while preserving identifiers |
| Source-backed answers | Evidence provenance + version/freshness metadata |

---

# 3. Product Identity — Not “Just Another Chatbot”

The product should be described as:

> **A conversational intelligence layer over the BIS information and service ecosystem.**

### What Sarathi is not

- Not a replacement for BIS's official service portals.
- Not a free mirror of licensed Indian Standard text.
- Not a generic LLM that claims to know every BIS rule.
- Not an autonomous system that silently submits consumer actions.

### What Sarathi is

- A natural-language front door to BIS information and workflows.
- An evidence-grounded standards exploration engine.
- A service router that knows when to use retrieval versus structured data.
- A guided decision-support system for MSMEs and consumers.
- A controlled layer that can abstain when evidence is insufficient.

### Memorable positioning line

> **“Ask naturally. Verify with BIS evidence. Act through the official service.”**

---

# 4. Users and Primary Journeys

## 4.1 Industry / MSME Persona

### Goal
Understand what standards, certification route, documentation and testing steps are relevant to a product.

### Primary flow

```text
Product description / HSN / technical specification
                    ↓
             Product attribute extraction
                    ↓
          Candidate Indian Standards
                    ↓
        Applicability + version checks
                    ↓
       Certification / scheme mapping
                    ↓
       Required testing / documents
                    ↓
        Relevant BIS-recognized labs
                    ↓
       Evidence + next official action
```

### Example interaction

**User:**
> “We manufacture stainless-steel reusable water bottles for retail sale. What BIS standards and certification route should we investigate?”

**Sarathi should not immediately declare one standard as legally mandatory.**

It should respond in a structured form:

```text
Potential standards to investigate

1. IS XXXX:YYYY
   Why surfaced:
   • product category match
   • material match
   • intended-use match

   Evidence:
   • BIS catalogue / standard scope

Certification route
   • Candidate route: [verified / requires confirmation]
   • Reason: [evidence]

What I still need
   • intended capacity
   • intended use / market segment

Next step
   [View official BIS record]
   [Find testing laboratory]
```

The system must distinguish between:

- **candidate standard**
- **verified applicable standard**
- **mandatory requirement**
- **voluntary / informational standard**

Those are not interchangeable.

---

## 4.2 Consumer Persona

### Goal
Verify information, understand a BIS mark/HUID/standard, locate support, and prepare a complaint.

### Primary flow

```text
Text / identifier / optional image
                ↓
        Identifier extraction
                ↓
        Official lookup adapter
                ↓
        Status / record response
                ↓
     Plain-language explanation
                ↓
    Complaint / support workflow
                ↓
          User review
                ↓
      Official BIS service
```

### Example interaction

```text
User: “The product says ISI. Is this licence valid?”

Sarathi:
• identifies the licence number
• queries the authoritative/approved lookup source
• reports the returned status
• explains what the status means
• shows source + retrieval time
• provides official verification path
```

### Complaint flow

```text
Free-text complaint
        ↓
Entity extraction
        ↓
Issue classification
        ↓
Missing information detection
        ↓
Structured complaint draft
        ↓
USER REVIEWS / CONFIRMS
        ↓
Official BIS complaint channel
```

The assistant should never silently submit a complaint on behalf of the user.

---

# 5. Revised System Architecture

## 5.1 High-level architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                         USER CHANNELS                              │
│ Web app / mobile web / WhatsApp or approved channel               │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                   LANGUAGE + QUERY UNDERSTANDING                   │
│ Language detection | translation | intent | entity extraction     │
│ Product | IS number | HUID | licence | location | issue type      │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                    DETERMINISTIC QUERY PLANNER                     │
│                                                                    │
│ Exact identifier → direct lookup                                  │
│ Product description → standards recommender                       │
│ Certification question → scheme/rules workflow                   │
│ Lab request → BIS LIMS / indexed lab scope                       │
│ Knowledge question → hybrid retrieval                              │
│ Complaint → structured guided workflow                             │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
┌─────────────────────────┐    ┌──────────────────────────────────┐
│ HYBRID KNOWLEDGE ENGINE │    │ STRUCTURED SERVICE CONNECTORS   │
│                         │    │                                  │
│ • BM25 / lexical search │    │ • Standards catalogue adapter   │
│ • dense retrieval       │    │ • BIS LIMS adapter              │
│ • metadata filtering    │    │ • verification adapter          │
│ • optional reranking    │    │ • complaint workflow            │
│ • evidence assembly     │    │ • future e-BIS/BIS Care APIs    │
└────────────┬────────────┘    └──────────────────┬───────────────┘
             │                                    │
             └────────────────┬───────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                    EVIDENCE VALIDATION LAYER                       │
│ Source authority | entity match | version | freshness | conflict │
│ evidence coverage | applicability rules | ambiguity detection    │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                       GROUNDING GATE                               │
│                                                                    │
│ HIGH → answer                                                     │
│ MEDIUM → answer with qualification / ask clarification            │
│ LOW → abstain + official verification route                       │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                       RESPONSE LAYER                              │
│ Explanation | evidence cards | status | confidence | next action │
│ LLM used primarily for explanation / summarisation                 │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                    AUDIT + FEEDBACK LOOP                          │
│ Query logs | redacted failures | KB gaps | source freshness      │
│ human review queue | evaluation reports                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5.2 The critical architectural rule

> **The LLM is an explanation engine, not an authority engine.**

The system should prefer:

1. exact structured lookup;
2. deterministic rules;
3. authoritative indexed evidence;
4. hybrid retrieval;
5. LLM synthesis only after evidence is assembled.

The LLM should never be allowed to manufacture:

- an IS number;
- a licence status;
- a HUID status;
- a laboratory recognition status;
- a certification requirement;
- a legal/mandatory claim;
- a clause that was not present in the evidence.

---

# 6. BIS Data / Knowledge Architecture

## 6.1 Source hierarchy

The solution should explicitly classify information sources.

### Tier A — Public authoritative BIS sources

Examples:

- BIS Standards portal / public standards catalogue
- public standard number, title and scope/abstract information
- BIS Care information and service/help content
- BIS LIMS public laboratory information
- public BIS scheme/guidance documents
- official BIS notices and publications

### Tier B — Authorized BIS data

Potential production sources:

- licensed standards text/corpus
- authorized internal APIs
- authorized service registries
- approved e-BIS/BIS Care integrations

### Tier C — Supporting external sources

Only when permitted and clearly labelled.

### Tier D — Synthetic/demo data

Used for:

- model development
- unit tests
- retrieval evaluation
- UI demonstrations where no public live data is available

**Never present Tier D as authoritative BIS information.**

---

## 6.2 Legal/content-access policy

BIS sells the full text of most Indian Standards. Therefore the prototype must not be designed around indiscriminate scraping or redistribution of full standards text.

Instead:

```text
PUBLIC / AUTHORIZED METADATA
           ↓
Standard number / title / scope / status / related service
           ↓
Relevant evidence
           ↓
Explain in plain language
           ↓
Link to official BIS source / authorized document
```

### Production-ready policy

Each stored document/chunk should carry:

```text
source_id
source_type
source_url
access_class
license_status
retrieved_at
publication_date
revision_year
amendment_metadata
authority_level
```

This allows the system to enforce different retrieval policies for public, authorized and synthetic content.

---

# 7. Standards Knowledge Model

A pure document store is not enough.

Build a structured **Standards Knowledge Graph / Compliance Graph** above the document index.

```text
PRODUCT
  │
  ├──────── applies / candidate ─────→ INDIAN STANDARD
  │                                     │
  │                                     ├── revision
  │                                     ├── amendment
  │                                     ├── status
  │                                     └── related standards
  │
  ├──────── certification route ────→ SCHEME / QCO / LICENCE PATH
  │
  └──────── requires testing ───────→ TEST / METHOD
                                         │
                                         ▼
                                  BIS RECOGNIZED LAB
```

### Why this matters

This lets Sarathi answer relationships, not just passages:

> “Which labs can perform the testing associated with this standard?”

> “What certification path is associated with this product category?”

> “Is there a newer revision of this standard?”

> “What information is still missing before I can narrow this recommendation?”

---

# 8. Standards Recommendation Engine v2

## 8.1 Pipeline

```text
Product description / HSN / specification
                    ↓
           Product entity extraction
                    ↓
        Normalize terms / ontology mapping
                    ↓
       Candidate standard retrieval
       • lexical search
       • dense retrieval
       • category filters
                    ↓
          Candidate reranking
                    ↓
       Applicability evidence check
                    ↓
       Version / amendment / status
                    ↓
    Certification / testing relationship
                    ↓
             Final result
```

## 8.2 Product attribute schema

```json
{
  "product_type": "",
  "material": [],
  "intended_use": "",
  "capacity": "",
  "power_rating": "",
  "dimensions": "",
  "market_context": "",
  "hsn_code": "",
  "other_attributes": {}
}
```

Only fields relevant to the product category need to be populated.

## 8.3 Output contract

Each candidate should contain:

```json
{
  "is_number": "",
  "title": "",
  "status": "",
  "revision": "",
  "match_score": 0.0,
  "applicability_status": "candidate|verified|uncertain",
  "why_surfaced": [],
  "evidence": [],
  "certification_route": "",
  "testing_path": [],
  "clarifications_needed": []
}
```

### Important language rule

Never collapse:

> “This standard is semantically similar”

into:

> “This standard is legally applicable.”

The first is a model/retrieval result. The second requires evidence.

---

# 9. BIS LIMS Laboratory Discovery

## 9.1 Realistic source

Use the public BIS LIMS laboratory directory as the target data source for the prototype.

The current public BIS LIMS site exposes a recognized-laboratory directory and also supports searching laboratory capability by Indian Standard. A current crawl shows **430 recognized laboratories** in the directory.

Official source:

- https://lims.bis.gov.in/home/labs/
- https://lims.bis.gov.in/home/search_is_number/

## 9.2 Prototype strategy

If a live authorized API is not available:

```text
BIS LIMS public pages
        ↓
Scheduled/manual snapshot
        ↓
Normalize fields
        ↓
Local PostgreSQL/SQLite cache
        ↓
Search by IS / test / geography
```

The UI must say:

> **“Data snapshot retrieved on DD-MM-YYYY. Verify current laboratory status on BIS LIMS before booking/testing.”**

## 9.3 Lab schema

```text
lab_id
lab_code
lab_name
address
state
district
contact
validity_date
status
is_number
product_scope
test_scope
source_url
retrieved_at
```

## 9.4 Ranking

Lab ranking can use:

```text
1. Exact IS/test-scope match
2. Recognition/status validity
3. Geographic distance
4. Product/test relevance
5. Data freshness
```

Do not rank solely by distance.

---

# 10. Verification Architecture

Verification features such as licence/HUID checking are high-risk because a wrong answer can mislead a consumer.

## Architecture

```text
User identifier
     ↓
Input validation
     ↓
Identifier type detection
     ↓
Authorized lookup adapter
     ↓
Source response
     ↓
Record validation
     ↓
Response
```

## Prototype mode

Where live integration is not authorized/available:

```text
DEMO VERIFICATION RECORD
Status: Sample / Mock
Source: Demo dataset
Not connected to the BIS production registry
```

Never display a mock result using wording such as “Verified by BIS”.

---

# 11. Evidence Cards

Every useful answer should render evidence visually.

### Example

```text
┌─────────────────────────────────────────────┐
│ EVIDENCE                                    │
│                                             │
│ Source: BIS Standards Catalogue             │
│ Standard: IS XXXX:YYYY                      │
│ Record: Scope / Product                     │
│ Retrieved: 21 Sep 2026                      │
│                                             │
│ Why used: supports product-category match   │
│                                             │
│ [Open official source]                      │
└─────────────────────────────────────────────┘
```

For authorized full text:

```text
Source: IS XXXX:YYYY
Clause: 7.2
Page: 18
Version: YYYY
```

For public metadata:

```text
Source: BIS Standards Catalogue
Field: Scope
```

The system should never fabricate a clause number simply because every answer template expects one.

---

# 12. Confidence / Grounding Model v2

The original “cosine similarity > threshold” approach is too weak for a government information assistant.

## 12.1 Proposed grounding score

```text
Grounding Score =
    0.25 × retrieval_relevance
  + 0.20 × source_authority
  + 0.15 × entity_identifier_match
  + 0.15 × evidence_coverage
  + 0.10 × freshness/version_validity
  + 0.10 × cross-source_agreement
  - 0.10 × ambiguity_penalty
  - 0.10 × conflict_penalty
```

The exact weights must be calibrated using the evaluation set; they are not final values.

## 12.2 Output states

### HIGH

Answer directly.

### MEDIUM

Answer with qualification or ask for missing information.

### LOW

Abstain.

Example:

> “I could not verify this reliably from the available BIS evidence. I do not want to guess. Please verify the current requirement using the official BIS service.”

## 12.3 What confidence must NOT be

Do not ask the LLM:

> “How confident are you from 0–100?”

That can be an auxiliary signal at most, not the primary trust mechanism.

---

# 13. RAG Architecture v2

## Retrieval stack

Use a **hybrid retriever**:

```text
User query
   │
   ├── lexical / BM25
   │
   ├── dense embeddings
   │
   └── metadata filters
         ↓
      top-N pool
         ↓
      reranker
         ↓
   evidence selection
```

### Metadata filters

Filter on:

- source type
- IS number
- revision/year
- document status
- scheme
- product category
- language
- authority level
- freshness

### Why hybrid retrieval

Queries containing exact identifiers such as:

- `IS 2062`
- `HUID`
- `CRS`
- `licence number`

benefit from lexical/exact matching, while natural-language product descriptions benefit from semantic retrieval.

---

# 14. Model Strategy — What We Actually Train

## 14.1 Intent classifier

Intent labels:

```text
standard_lookup
standards_recommendation
certification_guidance
hallmarking
lab_recommendation
consumer_verification
consumer_complaint
general_faq
```

### Baseline

TF-IDF + LinearSVC.

### Optional upgrade

DistilBERT or another small encoder classifier if time and compute permit.

### Dataset

Start with approximately 30–50 human-written examples per intent, then use synthetic paraphrases only after manual review.

Keep a completely separate, human-verified evaluation split.

---

## 14.2 Retrieval model

Start with a strong open sentence-transformer.

Fine-tune only after the baseline retrieval pipeline works.

### Training data

```text
query → correct evidence/document
query → hard negative evidence/document
```

Examples should cover:

- standard number variants
- spelling variation
- Indian product terminology
- HUID / CRS / licence terms
- Hindi/English mixed queries where appropriate
- ambiguous wording

### Evaluation split

The evaluation set must never be generated from the exact training records and should include hard negatives.

---

# 15. Multilingual Architecture

BIS Care already provides multilingual support. Therefore multilingualism should not be presented as “fixing a missing language feature.”

Sarathi's multilingual value is:

- natural-language interaction across languages;
- preservation of identifiers such as IS numbers and HUIDs;
- multilingual explanation of technical BIS information;
- consistent routing into the same controlled backend.

## Pipeline

```text
User language
      ↓
Language detection
      ↓
Translation / multilingual encoder
      ↓
Canonical internal representation
      ↓
Planner + retrieval + tools
      ↓
Evidence-backed answer
      ↓
Translate / render in user language
```

### Identifier preservation rule

Do not translate or alter:

- IS numbers
- HUIDs
- licence numbers
- lab codes
- product codes
- official scheme names unless a safe localized label is available

---

# 16. Complaint Workflow — Safer Design

```text
User free text
      ↓
Extract product / issue / identifier
      ↓
Ask for missing mandatory information
      ↓
Generate structured draft
      ↓
User review
      ↓
Consent / confirmation
      ↓
Official BIS complaint channel
```

### Example structured output

```json
{
  "product": "",
  "issue_category": "",
  "brand_or_manufacturer": "",
  "licence_number": "",
  "purchase_context": "",
  "description": "",
  "desired_resolution": "",
  "attachments": []
}
```

### Safety rule

The AI drafts and structures. The user confirms the final action.

---

# 17. Data Freshness and Version Control

Standards information changes. Therefore the KB should not be treated as timeless.

## Every indexed record should support

```text
created_at
retrieved_at
published_at
revision_year
status
amendment_ids
supersedes
superseded_by
source_url
```

## Freshness policy

```text
Recent + authoritative
        ↓
preferred

Old but still valid
        ↓
usable with status shown

Superseded / expired
        ↓
never silently answer as current
```

### Example UI

```text
IS XXXX:2025
Current record

Earlier revision: IS XXXX:2019
Status: superseded
```

---

# 18. Privacy, Security and Auditability

Because users may submit identifiers, business information and complaints, the prototype should demonstrate basic privacy-by-design.

## Minimum controls

- TLS/HTTPS for network traffic.
- Minimal data retention.
- PII redaction before application logs where possible.
- Do not use sensitive user data for model training by default.
- Explicit user confirmation before submission.
- Audit record of important service actions.
- Clear demo/mock-data labels.
- Role separation for admin/editor operations.
- Secret keys only in environment variables/secrets manager.

## Audit event example

```json
{
  "request_id": "uuid",
  "timestamp": "",
  "intent": "lab_recommendation",
  "sources_used": [],
  "tool_calls": [],
  "grounding_score": 0.0,
  "outcome": "answered|clarified|abstained",
  "user_action": ""
}
```

Never log raw sensitive payloads unnecessarily.

---

# 19. Responsible AI / Safe Failure

A strong government-facing assistant should demonstrate that it knows when it should stop.

## Deliberate demo

Ask something outside the indexed evidence:

> “Does BIS require certification for a completely new product category that is not covered in our current data?”

The assistant should say:

```text
I could not verify this from the available BIS evidence.
I will not guess.

You can verify the current requirement here:
[Official BIS resource]

Would you like me to help prepare the information needed for verification?
```

This is a product feature, not an error state.

---

# 20. Technology Stack v2

| Layer | Recommendation | Purpose |
|---|---|---|
| Frontend | React / Next.js | Web application |
| Backend | Python + FastAPI | API/orchestration |
| Query understanding | scikit-learn / Transformers | intent + entities |
| Retrieval | BM25 + sentence-transformers | hybrid search |
| Reranking | cross-encoder | improve evidence ordering |
| Vector DB | Qdrant / Chroma / FAISS | dense retrieval |
| Relational DB | PostgreSQL / SQLite | structured records |
| Graph layer | PostgreSQL relations initially; Neo4j optional | standards/service relationships |
| Document parsing | PyMuPDF / BeautifulSoup | ingestion |
| LLM | provider-agnostic wrapper | explanation / extraction |
| Multilingual | Bhashini / IndicTrans2 | language handling |
| Lab source | BIS LIMS public snapshot / authorized adapter | laboratory discovery |
| Monitoring | structured logs + metrics | audit and evaluation |

### Architecture principle

Avoid unnecessary infrastructure during the hackathon.

A practical 36-hour build can start with:

```text
FastAPI
+ PostgreSQL/SQLite
+ Qdrant/Chroma
+ sentence-transformers
+ one LLM provider
+ React
```

Add graph-specific infrastructure only when it provides measurable benefit.

---

# 21. Recommended Repository Structure

```text
bis-sarathi/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   ├── verification.py
│   │   │   ├── labs.py
│   │   │   └── health.py
│   │   ├── core/
│   │   │   ├── planner.py
│   │   │   ├── intent.py
│   │   │   ├── entities.py
│   │   │   ├── retrieval.py
│   │   │   ├── reranker.py
│   │   │   ├── evidence.py
│   │   │   ├── confidence.py
│   │   │   ├── freshness.py
│   │   │   ├── translation.py
│   │   │   └── safety.py
│   │   ├── services/
│   │   │   ├── standards.py
│   │   │   ├── certification.py
│   │   │   ├── labs.py
│   │   │   ├── verification.py
│   │   │   └── complaints.py
│   │   ├── adapters/
│   │   │   ├── bis_standards.py
│   │   │   ├── bis_lims.py
│   │   │   ├── bis_care.py
│   │   │   └── ebis.py
│   │   ├── models/
│   │   │   ├── intent_classifier.py
│   │   │   ├── retrieval_model.py
│   │   │   └── saved/
│   │   └── db/
│   │       ├── schema.sql
│   │       └── bis.db
│   ├── data/
│   │   ├── raw/
│   │   ├── snapshots/
│   │   ├── processed/
│   │   ├── synthetic/
│   │   └── gold_eval/
│   ├── scripts/
│   │   ├── ingest_standards.py
│   │   ├── ingest_lims.py
│   │   ├── build_index.py
│   │   └── refresh_metadata.py
│   ├── eval/
│   │   ├── retrieval_eval.py
│   │   ├── intent_eval.py
│   │   ├── grounded_answer_eval.py
│   │   └── eval_set.jsonl
│   ├── requirements.txt
│   └── .env.example
├── web/
│   ├── src/
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── data-policy.md
│   └── demo-script.md
└── README.md
```

---

# 22. API Design

## POST /chat

```json
{
  "message": "Which standard applies to my product?",
  "language": "en",
  "session_id": "uuid",
  "persona": "industry"
}
```

Response:

```json
{
  "answer": "...",
  "intent": "standards_recommendation",
  "entities": {},
  "evidence": [],
  "grounding": {
    "score": 0.0,
    "state": "high"
  },
  "actions": [],
  "needs_clarification": false
}
```

## GET /standards/search

Inputs:

```text
q
is_number
category
status
year
```

## GET /labs/search

Inputs:

```text
is_number
test_type
location
status
```

## POST /complaints/draft

Input:

```json
{
  "text": "..."
}
```

Output:

```json
{
  "draft": {},
  "missing_fields": [],
  "requires_user_confirmation": true
}
```

---

# 23. Evaluation Plan v2

The prototype must produce evidence that it works.

## Core evaluation dimensions

### A. Retrieval quality

- Precision@k
- Recall@k
- MRR / nDCG where useful
- exact identifier retrieval rate

### B. Groundedness

Human-reviewed percentage of answers where every factual claim is supported by retrieved evidence.

### C. Citation correctness

Percentage of answers whose cited source actually supports the claim made.

### D. Intent routing

- intent accuracy
- macro F1
- confusion matrix

### E. Structured workflow accuracy

- standards recommendation candidate relevance
- lab scope matching
- complaint field extraction accuracy
- verification input parsing accuracy

### F. Abstention quality

Measure separately:

- true abstentions
- false abstentions
- dangerous false answers

A government assistant should optimize strongly against unsupported answers.

### G. Latency

Report:

- median
- P95

Do not only report average latency.

---

# 24. Golden Evaluation Set

Do not use synthetic Q&A alone.

Create a manually verified gold set containing:

```text
50–100 queries initially
```

Cover:

- straightforward factual questions
- ambiguous product descriptions
- outdated standard references
- exact IS-number lookups
- lab questions
- certification questions
- multilingual queries
- deliberately unsupported questions

Every evaluation record should contain:

```json
{
  "query": "",
  "intent": "",
  "expected_sources": [],
  "expected_entities": {},
  "expected_outcome": "answer|clarify|abstain",
  "gold_notes": ""
}
```

---

# 25. MVP Scope — What Must Actually Work

## Must work

### Journey A — Industry

```text
Product description
→ standards candidates
→ evidence
→ certification guidance
→ testing/lab recommendation
```

### Journey B — Consumer

```text
Identifier / question
→ verification or explanation
→ evidence
→ complaint draft
```

### Journey C — Trust test

```text
Unsupported question
→ evidence failure
→ abstention
→ official verification path
```

## Nice to have

- multilingual voice input
- OCR from product/label photos
- WhatsApp channel
- richer graph traversal
- live API connectors
- advanced reranking
- domain-specific small-model fine-tuning

### MVP rule

> **A small number of end-to-end journeys that are real beats a broad catalogue of half-working features.**

---

# 26. Prototype-to-Production Strategy

## Phase 0 — Demo vertical slice

Build one product category end-to-end.

Success criteria:

- five deliberately chosen questions work;
- evidence cards are correct;
- low-confidence fallback works;
- one lab workflow works;
- one complaint workflow works.

## Phase 1 — Knowledge foundation

- ingest public BIS metadata;
- index official scheme/help material;
- ingest BIS LIMS snapshot;
- implement freshness metadata;
- create the first standards graph relationships.

## Phase 2 — Core intelligence

- planner;
- hybrid retrieval;
- evidence validator;
- grounding gate;
- explanation layer.

## Phase 3 — Structured services

- standards recommender;
- certification guidance;
- lab search;
- verification adapter;
- complaint draft workflow.

## Phase 4 — Evaluation

- golden set;
- retrieval metrics;
- citation correctness;
- abstention quality;
- P95 latency.

## Phase 5 — Multilingual / channels

- additional languages;
- WhatsApp or approved consumer channel;
- image/OCR only after text workflow is reliable.

## Phase 6 — Production integration

- authorized APIs;
- authentication;
- access controls;
- monitoring;
- human escalation;
- controlled data refresh.

---

# 27. Production Connector Strategy

The production architecture should treat external BIS services as **adapters**.

```text
Sarathi Core
     │
     ├── StandardsAdapter
     ├── LIMSAdapter
     ├── VerificationAdapter
     ├── CertificationAdapter
     └── ComplaintAdapter
```

### Why adapters matter

The team can build the entire product without hard-coding one external implementation.

For example:

```text
BIS_LIMS_PUBLIC_SNAPSHOT
BIS_LIMS_AUTHORIZED_API
```

can both implement:

```python
find_labs(is_number, test_type, location)
```

This makes migration from prototype to pilot much cleaner.

---

# 28. Demo Data Policy

### Label every demo source

Examples:

> **PUBLIC BIS SNAPSHOT — retrieved 21 Sep 2026**

> **DEMO RECORD — not connected to BIS production registry**

> **SYNTHETIC TRAINING EXAMPLE — not authoritative**

Never hide these distinctions.

---

# 29. UX Design Principles

## 29.1 The UI should look like a government service, not a generic AI toy

Prefer:

- structured cards;
- standard numbers;
- status badges;
- evidence panels;
- source links;
- guided forms;
- map/lab results;
- clear next actions.

Avoid:

- excessive glowing AI visuals;
- giant “AI confidence” numbers without explanation;
- long chatbot paragraphs;
- decorative AI graphics that do not demonstrate functionality.

## 29.2 User should always know what Sarathi is doing

Show:

```text
Understanding request…
Checking standards…
Validating evidence…
```

Then show the result.

Do not expose chain-of-thought. Show only safe operational states.

---

# 30. Recommended Product UI

## Industry home

```text
┌───────────────────────────────────────────────────────┐
│ BIS SARATHI                                           │
│ What are you trying to do?                            │
│                                                       │
│ [ Find my standard ]                                  │
│ [ Understand certification ]                         │
│ [ Find a testing laboratory ]                        │
│ [ Ask about BIS ]                                    │
│                                                       │
│ Or describe your product…                            │
│ [______________________________________________]      │
└───────────────────────────────────────────────────────┘
```

## Result screen

```text
PRODUCT UNDERSTANDING
✓ Stainless steel
✓ Reusable bottle
⚠ Capacity not provided

POTENTIAL STANDARDS
[Candidate 1]
Why surfaced: …
Evidence: …

[Candidate 2]
Why surfaced: …
Evidence: …

NEXT STEP
[Answer capacity question]
[Find relevant lab]
[Open official BIS source]
```

---

# 31. Revised PPT Strategy — SIH Six-Slide Submission

The SIH template has a maximum of six slides including the title slide. It explicitly encourages points, diagrams, infographics and pictures instead of paragraphs.

Use the official six-slide structure but make each slide tell one story.

## Slide 1 — Title

### BIS SARATHI
**Evidence-grounded AI assistant for Indian Standards & BIS services**

Include:

- PS ID 26107
- organisation
- theme
- category
- team ID/name
- one-line product proposition

Small disclaimer:

> Prototype concept — not an official BIS application.

---

## Slide 2 — Proposed Solution

Headline:

> **One conversational front door. Multiple BIS workflows.**

Main visual:

```text
CONSUMER                         INDUSTRY / MSME
   │                                   │
   ▼                                   ▼
Verify / Explain / Complain       Product / Standard / Certify
            \                       /
             \                     /
              ▼                   ▼
            BIS SARATHI
       Evidence + service layer
```

Include one realistic UI screenshot/card for each persona.

Do not spend the slide on generic AI features.

---

## Slide 3 — Technical Approach

Headline:

> **The LLM explains. BIS evidence decides.**

Visual:

```text
User
 ↓
Language + Entities
 ↓
Query Planner
 ├─ exact lookup
 ├─ standards recommender
 ├─ lab/service connector
 └─ hybrid RAG
 ↓
Evidence Validator
 ↓
Grounding Gate
 ├─ Answer
 ├─ Clarify
 └─ Abstain
 ↓
Answer + Evidence + Action
```

Bottom strip:

> BIS Standards Portal | BIS LIMS | BIS Care | Official scheme/help content | Authorized production connectors

---

## Slide 4 — Feasibility & Viability

Headline:

> **Prototype now → authorized BIS integrations later**

Left:

```text
36-HOUR DEMO
✓ Web app
✓ Hybrid retrieval
✓ Standards recommender
✓ BIS LIMS snapshot
✓ Evidence cards
✓ Complaint draft
✓ Safe fallback
```

Right:

```text
PRODUCTION
→ Authorized APIs/data feeds
→ Live verification
→ Freshness/version updates
→ Authentication
→ Audit logs
→ Human escalation
```

Risk table:

| Risk | Control |
|---|---|
| Wrong standard | applicability + evidence checks |
| Outdated information | revision/freshness metadata |
| Hallucination | grounding gate + abstention |
| Ambiguous product | clarification workflow |
| Mock data confusion | explicit source labels |
| Complaint errors | user confirmation |

---

## Slide 5 — Impact & Benefits

Use ecosystem scale where it is useful and label the source/date.

Current official BIS LIMS data shows **430 recognized laboratories** in the public directory.

Current BIS Care information says the app supports **12 languages** and already provides several consumer/service capabilities.

Use these numbers to establish ecosystem complexity, not as “impact generated by Sarathi”.

Main impact flow:

```text
Natural language request
        ↓
Correct BIS information
        ↓
Correct next action
        ↓
Less portal/document navigation
        ↓
Lower friction for MSMEs + consumers
```

Pilot KPIs:

- task completion time;
- citation correctness;
- retrieval recall@k;
- abstention precision;
- P95 response latency.

Use **Measured / Target** labels.

---

## Slide 6 — Research & References

Keep this clean.

### Official sources

- SIH 2026 PS26107
- BIS Standards Portal — https://standards.bis.gov.in/
- BIS Know Your Standard — https://www.bis.gov.in/know-your-standard/
- BIS Care — https://www.bis.gov.in/bis-apps/
- BIS LIMS — https://lims.bis.gov.in/
- BIS LIMS Lab Search by IS — https://lims.bis.gov.in/home/search_is_number/

### Data policy

> Public / authorized BIS material is used as authoritative evidence. Synthetic data is used for model development and evaluation only. Mock demonstration records are explicitly labelled.

---

# 32. Extended Judge / Demo Deck — Optional 10–12 Slides

The official SIH submission remains six slides.

A separate judge/demo deck may contain:

1. Problem
2. Product overview
3. Industry workflow
4. Consumer workflow
5. Live UI / screenshots
6. Architecture
7. Evidence model
8. Standards graph
9. BIS LIMS integration
10. Evaluation results
11. Privacy / deployment
12. Production roadmap

This deck should not be submitted when the portal requires the official six-slide format.

---

# 33. Live Demo Script

## Scene 1 — Industry

User enters:

> “I manufacture [specific product]. Which Indian Standards should I investigate?”

Sarathi shows:

1. extracted attributes;
2. candidate standards;
3. reasons for each candidate;
4. evidence;
5. clarifying questions, if necessary;
6. certification/testing route.

## Scene 2 — Lab

Ask:

> “Which recognized labs can test this?”

Show:

- standard/test match;
- location;
- recognized status;
- source date;
- official BIS LIMS path.

## Scene 3 — Consumer

Ask:

> “What does this IS number mean?”

Show a concise evidence card.

Then:

> “I want to complain about a product carrying this mark.”

Show:

- structured draft;
- missing fields;
- user confirmation.

## Scene 4 — Trust test

Ask something deliberately outside the current evidence set.

Show:

> **Unable to verify — no guess generated.**

Then open official verification path.

---

# 34. Judge Questions — Strong Answers

## “Did you actually train a model?”

Answer:

> “The core answer engine is RAG, so we are not pretending that retrieval is model training. We trained the intent classifier and plan a domain-tuned retrieval model after establishing a baseline. We evaluate both against a separate human-verified test set.”

## “Why not just use ChatGPT?”

Answer:

> “A generic LLM can explain text, but it should not be treated as the authority for BIS status or requirements. Sarathi separates understanding from evidence retrieval, deterministic service lookups, validation and safe abstention.”

## “Can you scrape all Indian Standards?”

Answer:

> “We deliberately do not build the solution around copying licensed standard text. We use public/authorized evidence and point users to the official source for documents they are entitled to access.”

## “Where do your labs come from?”

Answer:

> “Our target source is BIS LIMS. For the hackathon we can use a dated public snapshot if an authorized live connector is unavailable; the interface is built as an adapter so the snapshot can later be replaced by an authorized integration.”

## “What happens if your AI is wrong?”

Answer:

> “It is not enough to ask the LLM how confident it feels. We score the evidence itself. When evidence is insufficient, contradictory or ambiguous, Sarathi asks for clarification or abstains and directs the user to the official BIS resource.”

---

# 35. Common Weaknesses to Avoid

Do not claim:

- “We indexed all 20,000+ standards” unless authorized and actually true.
- “Our AI knows all BIS rules.”
- “95% accuracy” without a reproducible evaluation set.
- “Verified by BIS” for mock data.
- “Applicable standard” when you only have semantic similarity.
- “BIS Care is not multilingual.”
- “The LLM decides the correct BIS rule.”

Avoid making the deck look like a consumer ChatGPT clone.

---

# 36. Metrics Dashboard for the Team

Track these during development:

```text
Retrieval
  Recall@3
  Recall@5
  MRR

Grounding
  Evidence-supported claim rate
  Citation correctness
  False-answer rate

Routing
  Intent macro-F1
  Tool-routing accuracy

Workflow
  Standards candidate relevance
  Lab scope matching
  Complaint extraction accuracy

Safety
  False answer rate on out-of-scope queries
  Abstention precision

Performance
  P50 latency
  P95 latency
```

### Important

Do not put every metric on the SIH slide.

Pick 3–4 strongest measured numbers once the prototype has real evidence.

---

# 37. Data Refresh Strategy

Public data snapshots should carry:

```text
source_url
retrieved_at
hash/checksum
record_count
parser_version
```

If the content changes:

```text
old snapshot
    ↓
change detection
    ↓
re-ingest affected records
    ↓
re-embed affected content
    ↓
re-index
    ↓
run regression evaluation
```

This makes “freshness” an engineering process rather than a presentation claim.

---

# 38. Human Review Loop

Low-confidence and conflict cases should enter a review queue.

```text
Low-confidence query
        ↓
Store structured failure metadata
        ↓
Human review
        ↓
Classify reason
 ├─ missing source
 ├─ ambiguous query
 ├─ retrieval failure
 ├─ outdated data
 └─ wrong routing
        ↓
Fix source / rules / model / UX
        ↓
Re-run evaluation
```

This creates a defensible path for continuous improvement.

---

# 39. Development Priorities

## Priority 1 — Trust

- evidence cards
- correct source handling
- abstention
- no fabricated claims

## Priority 2 — One complete workflow

- product → standard → certification/testing → lab

## Priority 3 — Second complete workflow

- consumer → verification → complaint draft

## Priority 4 — Evaluation

- golden set
- metrics
- regression tests

## Priority 5 — Expansion

- multilingual
- OCR
- WhatsApp
- extra domains

---

# 40. Final Product Definition

### BIS Sarathi in one sentence

> **BIS Sarathi turns natural-language requests into evidence-backed BIS guidance and service workflows, using controlled retrieval and structured connectors rather than relying on the LLM as the source of truth.**

### 30-second stage pitch

> “BIS runs standards, certification, hallmarking, laboratory recognition and consumer services across a large information ecosystem. Users often know the question they want to ask but not which BIS portal, standard, scheme or laboratory they need. We built BIS Sarathi as a conversational intelligence layer over that ecosystem. An industry user can describe a product and receive candidate standards, evidence, certification guidance and relevant testing labs. A consumer can verify information, understand what it means and prepare a complaint. Behind the interface, a query planner chooses structured lookups or hybrid retrieval, an evidence layer checks source, status and freshness, and a grounding gate prevents unsupported answers. When the evidence is insufficient, Sarathi does not guess—it sends the user to the official BIS source. The prototype is intentionally designed so public snapshots and demo adapters can be replaced by authorized BIS integrations in production.”

---

# 41. Official / Research References

The following should be used when updating implementation details and the final PPT:

1. **Smart India Hackathon 2026 Problem Statement PS26107**  
   Source in project file: PS description and expected solution.

2. **BIS Standards Portal**  
   https://standards.bis.gov.in/

3. **BIS Know Your Standard**  
   https://www.bis.gov.in/know-your-standard/

4. **BIS Care App**  
   https://www.bis.gov.in/bis-apps/

5. **BIS LIMS — Recognized Laboratories**  
   https://lims.bis.gov.in/home/labs/

6. **BIS LIMS — Search by IS Number**  
   https://lims.bis.gov.in/home/search_is_number/

7. **BIS LIMS — Main dashboard**  
   https://lims.bis.gov.in/

---

# 42. Implementation Checklist

## Before demo

- [ ] Product-to-standard recommendation works for one real vertical.
- [ ] Candidate recommendation includes reasons, not just scores.
- [ ] Standard status/revision metadata is visible.
- [ ] Lab results come from a dated BIS LIMS snapshot or clearly labelled demo source.
- [ ] Evidence cards open an official source.
- [ ] No mock record is labelled as official.
- [ ] Complaint flow requires user confirmation.
- [ ] Out-of-scope query triggers safe fallback.
- [ ] All important LLM calls are behind one provider interface.
- [ ] Golden evaluation set exists.
- [ ] Metrics are measured, not estimated.
- [ ] Logs redact unnecessary PII.

## Before SIH submission

- [ ] Six-slide official SIH template only.
- [ ] Team ID/name completed.
- [ ] All screenshots show functional UI.
- [ ] No unsupported claims.
- [ ] Current BIS Care multilingual facts are described correctly.
- [ ] Current BIS LIMS/public-source facts are dated in the notes or references.
- [ ] PDF exported and visually inspected.

---

# 43. The Final Strategic Shift

The project should no longer be pitched as:

> **“An AI chatbot for BIS.”**

Pitch it as:

> **“An evidence-first conversational service layer for the BIS ecosystem.”**

That shift changes the technical story, the UI story, the trust story, the feasibility story and the production story at the same time.

The goal is not to make Sarathi appear omniscient.

The goal is to make it appear **useful, controlled, verifiable, and deployable.**
