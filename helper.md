The objective is:

“Judge asks a question → Sarathi understands intent → finds evidence → explains → shows source → routes to action.”

That needs to be instantly visible.

9. What the website should actually contain

I would structure it like this:

Home

BIS SARATHI

Ask naturally. Verify with BIS evidence. Act through the official service.

Then:

Choose your journey

Industry / MSME

Consumer

and underneath a small strip:

Interactive Concept Demonstrator
Demo data / public-source snapshots • Not connected to BIS production systems

Main Demo Console

The heart of the website should look like an actual application rather than a marketing landing page.

Left side:

Ask Sarathi

Chat interface.

Example quick-start buttons:

Which standard applies to packaged drinking water?

Which labs can test against this standard?

What does IS 14543 cover?

I want to complain about a product carrying an ISI mark.

Can you verify this licence?

Ask something outside the available evidence

Right side: “Sarathi reasoning path”

Don't show chain-of-thought.

Show safe system metadata:

INTENT
Standards recommendation

QUERY TYPE
Product → Standard

ROUTE
Standards catalogue + rules

EVIDENCE
3 records retrieved

STATUS
Supported by available evidence

NEXT ACTION
View official BIS record

This is incredibly valuable because it tells the judge:

This isn't just ChatGPT with a pretty UI.

10. The Industry demo

Use your packaged drinking water example because it connects directly to your PPT and can demonstrate version awareness.

Screen 1

User:

“I manufacture packaged drinking water. Which BIS standard should I investigate?”

Then animate:

Detecting intent...
Extracting product attributes...
Searching standards...
Checking version/status...

Then show:

Product understanding
Product
Packaged Drinking Water

Category
Drinking Water

Use
Packaged / Direct Consumption

Then:

Candidate standard

IS 14543

Packaged Drinking Water
(other than Packaged Natural Mineral Water)

2024 record found

Earlier 2016 record also found

Then:

Why surfaced

✓ Product-category match
✓ Packaging/use match
✓ BIS source record
✓ Version metadata available

Then an evidence card:

EVIDENCE

Source
BIS Standards / BIS LIMS

Record
IS 14543

Retrieved
28 Sep 2026

Source type
Official BIS

[Open official source]

Don't invent clause numbers.

Your own design explicitly says the system must not fabricate clause numbers merely because a template expects one.

11. Then do the lab journey

User clicks:

Find testing laboratories

Now the UI changes to:

STANDARD
IS 14543

TESTING
Relevant laboratory records

LOCATION
Any / select state

Then show a few real publicly sourced BIS LIMS records captured into the demo dataset.

Current BIS LIMS is publicly exposing a recognized-lab directory and IS-number search; its current pages show 429 recognized-lab records, and the IS-number search for 14543 returns both 2024 and older 2016 associations.

Don't hard-code “429 labs” into the product as a permanent number, though. Put:

Public BIS LIMS snapshot — retrieved 28 Sep 2026

That is much more aligned with your architecture's freshness model.

12. Consumer demo

Start:

“What does IS 14543 mean?”

Show:

Plain-language explanation

IS 14543 specifies requirements and test methods for packaged drinking water other than packaged natural mineral water.

Then:

Evidence

Source → BIS product manual / BIS source
Record → IS 14543
Retrieved → date
Revision → shown

Then:

Related actions

Find testing laboratories

Understand certification status

Ask another question

13. Verification demo

This is where you must be VERY careful.

Use something like:

Licence / HUID
DEMO-LIC-001

Then:

Result

Sample / Mock Record

Status: Sample
Source: Demo dataset
Not connected to the BIS production registry

Your solution plan explicitly defines that exact sort of safe prototype behaviour.

Do not write:

Verified by BIS

Do not use a green “Verified” tick that visually implies production verification.

Instead:

DEMO RESULT

with a distinct warning banner.

14. Complaint workflow

This can look excellent even with zero backend.

User enters:

“I purchased a packaged product carrying an ISI mark but I think the marking is incorrect.”

Sarathi extracts:

PRODUCT
Unknown

ISSUE
Possible misuse / marking concern

IDENTIFIER
Not provided

PURCHASE DETAILS
Missing

Then:

I need 3 more details before I can prepare the complaint draft.

Buttons:

Add product

Add licence/mark number

Add purchase details

Then show the structured complaint:

COMPLAINT DRAFT

Product:
...

Brand / manufacturer:
...

Issue:
...

Identifier:
...

Purchase context:
...

Description:
...

Attachments:
...

Then:

[Review before submission]

Never make a fake “Submit to BIS” button actually submit anything.

Your underlying design is explicitly built around extraction → drafting → user review → confirmation → official BIS channel.

15. The feature that could make the demo memorable: ABSTENTION

This is the scene I'd absolutely put in the video.

Ask:

“Is BIS going to introduce compulsory certification for a completely new material category next month?”

Your system should respond:

Unable to verify

I could not verify this reliably from the available BIS evidence.
I will not guess.

Then:

Why?

No authoritative evidence found
+
Insufficient current regulatory data

Then:

Open official BIS resource

That directly demonstrates your “grounding gate” concept. Your solution document explicitly proposes this as a product feature.

That is much more compelling than another fancy chatbot animation.