# MASTER DEVELOPMENT WORKFLOW

This document is the starting point for a new software development project.

It defines both:

1. the project-specific context, and
2. the standard AI-assisted development workflow.

The **PROJECT CONTEXT** section changes for every project.

The **DEVELOPMENT WORKFLOW** section should normally remain unchanged between projects.

---

# PART A — PROJECT CONTEXT

Complete this section when starting a new project.

Information may be incomplete during the first discussion.

If information is unknown, write:

TBD

Do not invent missing project decisions merely to complete this template.

## PROJECT IDENTITY

Project Name:

Project Type:

Project Status:
[ ] Greenfield
[ ] Existing Project
[ ] Legacy / Modernization

Primary Purpose:

Primary Users:

Business Problem:

Expected Outcome:

---

## INITIAL REQUIREMENTS

Describe the initial idea, problem, or requirements.

These requirements may still be rough.

They will be refined during Discovery & Planning.

Initial Requirements:

[WRITE HERE]

---

## TECHNOLOGY CONTEXT

Programming Language:

Framework:

Frontend:

Backend:

Database:

Runtime:

External Services / APIs:

Authentication:

Other Important Technologies:

If the technology stack has not been decided yet, write:

TBD — architecture recommendation required.

---

## DEVELOPMENT ENVIRONMENT

Primary IDE / Editor:

Operating System:

Package Manager:

Build Tool:

Version Control:

Repository:

AI Coding Agent:

Optional IDE AI / Specialist:

---

## TARGET ENVIRONMENT

Development:

Staging:

Production:

Hosting / Infrastructure:

Target Devices:

Target Operating Systems:

Target Browsers:

Other Runtime Constraints:

---

## EXISTING SYSTEM CONTEXT

Complete this section only when applicable.

Existing Architecture:

Existing Database:

Existing APIs:

Existing Integrations:

Legacy Constraints:

Compatibility Requirements:

Known Technical Debt:

---

## PROJECT CONSTRAINTS

Examples:

- budget limitations
- offline requirement
- specific hosting
- specific OS support
- legacy compatibility
- security requirements
- regulatory requirements
- prohibited technologies
- dependency restrictions
- deadline

Constraints:

[WRITE HERE]

---

## AVAILABLE REFERENCES

Examples:

- existing repository
- screenshots
- UI design
- Figma
- existing application
- API documentation
- database schema
- interview notes
- Excel files
- PDF documents
- legacy source code

References:

[WRITE HERE]

---

# PART B — DEVELOPMENT WORKFLOW

## 1. DEVELOPMENT PHILOSOPHY

Use incremental, controlled development.

The preferred cycle is:

CONTEXT

→ REQUIREMENT

→ ANALYSIS

→ SMALL MILESTONE

→ IMPLEMENT

→ VERIFY

→ REVIEW

→ USER TEST

→ PASS

→ CHECKPOINT

→ NEXT MILESTONE

Prefer:

SMALL CHANGE
→ OBSERVE
→ VERIFY
→ LEARN
→ CONTINUE

over:

LARGE PROMPT
→ LARGE IMPLEMENTATION
→ MANY PROBLEMS DISCOVERED AT THE END

AI development speed must not justify uncontrolled scope.

---

## 2. ROLES

### PRODUCT OWNER / USER

Responsible for:

- explaining business needs
- providing domain knowledge
- validating expected behavior
- performing real-world testing where applicable
- accepting or rejecting milestones
- making final product decisions

### CHATGPT — ARCHITECT / PLANNER / REVIEWER

Responsible for:

- discovery
- requirement analysis
- challenging unclear assumptions
- helping determine appropriate technology when undecided
- defining MVP scope
- identifying risks
- designing the development strategy
- breaking work into milestones
- defining acceptance criteria
- preparing Coding Agent prompts
- reviewing implementation reports
- analyzing test failures
- controlling development scope

ChatGPT must NOT rush into implementation merely because an initial requirement has been provided.

### CODING AGENT — IMPLEMENTER

Responsible for:

- inspecting the repository
- understanding the existing implementation
- implementing explicitly assigned milestones
- performing technical verification
- reporting changes
- reporting additional findings

The Coding Agent does not independently control the product roadmap.

### OPTIONAL SPECIALIST / IDE AI

May assist with:

- framework-specific diagnostics
- IDE diagnostics
- database issues
- platform-specific problems
- build errors
- specialized technical analysis

Its role is advisory unless explicitly assigned otherwise.

---

# 3. DISCOVERY FIRST

For a new project, do NOT immediately generate coding instructions.

First determine whether sufficient information exists regarding:

- business problem
- users
- primary workflow
- scope
- critical requirements
- data
- integrations
- security
- target environment
- technical constraints
- expected MVP

Ask targeted questions when important information is genuinely missing.

Do not ask questions merely to fill every field in this template.

Only gather information that materially affects product or engineering decisions.

---

# 4. STACK DECISION

The technology stack may already be decided, partially decided, or completely undecided.

If decided:

Evaluate whether it is reasonable for the project and identify important risks.

If partially decided:

Recommend the missing components.

If undecided:

Recommend an appropriate stack based on:

- project requirements
- complexity
- developer familiarity
- maintainability
- deployment environment
- cost
- ecosystem maturity
- expected scale

Do not choose technology merely because it is currently popular.

---

# 5. REQUIREMENT ANALYSIS

Requirements should primarily describe:

PROBLEM

→ EXPECTED BEHAVIOR

rather than implementation.

For every significant requirement, consider:

- affected workflow
- dependencies
- edge cases
- data requirements
- security implications
- compatibility
- failure scenarios
- regression risk
- acceptance conditions

Separate:

MUST HAVE

SHOULD HAVE

NICE TO HAVE

when useful.

---

# 6. MVP DEFINITION

Before implementation begins, establish a sufficiently clear MVP.

The MVP should answer:

- What problem are we solving?
- Who uses it?
- What is the primary workflow?
- What functionality is essential?
- What is explicitly excluded?
- What constitutes a usable first version?

Avoid allowing NICE TO HAVE features to silently become MVP requirements.

---

# 7. MILESTONE DESIGN

Break implementation into small milestones.

Each milestone should have ONE primary objective.

Prefer vertical slices that produce observable behavior.

Example:

M3A — Create invoice

M3B — Edit invoice

M3C — Submit invoice

rather than:

M3 — Complete invoice module with reporting, permissions, export, notifications, and redesign.

A milestone should be independently testable whenever reasonably possible.

---

# 8. MILESTONE STATUS

Use:

PLANNED

→ READY

→ IN PROGRESS

→ CODE COMPLETE

→ TECHNICAL VERIFICATION

→ USER TEST

→ PASS / FINDINGS

→ DONE

Generated code does not mean DONE.

---

# 9. ACCEPTANCE CRITERIA

Acceptance criteria should describe observable behavior.

Prefer:

"When the user submits a valid invoice, the invoice enters Pending Approval status."

Avoid:

"Create InvoiceService using Repository Pattern."

Architecture supports the requirement.

Architecture is not itself the product requirement unless explicitly required.

---

# 10. CODING AGENT HANDOFF

ChatGPT prepares the implementation prompt only when the milestone is sufficiently defined.

Each Coding Agent task should contain:

MILESTONE ID

OBJECTIVE

CONTEXT

CURRENT BEHAVIOR

REQUIRED BEHAVIOR

ACCEPTANCE CRITERIA

CONSTRAINTS

VERIFICATION REQUIREMENTS

The Coding Agent receives ONE active milestone at a time unless there is a specific reason to combine them.

---

# 11. IMPLEMENTATION PRINCIPLES

For existing projects:

PRESERVE
→ UNDERSTAND
→ MODIFY MINIMALLY

Repository is the source of truth.

Coding Agent must inspect before editing.

Prefer:

- existing architecture
- existing conventions
- existing dependencies
- small focused changes

Avoid:

- unrelated refactoring
- speculative abstractions
- unnecessary dependencies
- architecture migrations
- framework upgrades
- unrelated formatting
- implementing future milestones

unless explicitly approved.

For greenfield projects, architectural freedom is greater, but implementation should still proceed incrementally.

---

# 12. TECHNICAL VERIFICATION

Verification depends on the project stack.

Use relevant checks such as:

- build
- compilation
- lint
- static analysis
- type checking
- unit tests
- integration tests
- API tests
- database tests
- browser tests
- emulator tests
- physical device tests
- container build
- deployment verification

Do not perform meaningless checks merely to satisfy a checklist.

Never claim a verification was performed when it was not.

---

# 13. USER ACCEPTANCE TEST

Where applicable, test using the real user workflow.

Recommended format:

MILESTONE:

RESULT:
PASS / FAIL / PASS WITH FINDINGS

ENVIRONMENT:

STEPS:

EXPECTED:

ACTUAL:

FINDINGS:

SCREENSHOT / LOG:

Real-world behavior takes precedence over assumptions made during implementation.

---

# 14. FAILURE LOOP

When testing fails:

FAIL

→ ANALYZE

→ IDENTIFY ROOT CAUSE

→ DEFINE FIX SCOPE

→ IMPLEMENT FIX

→ VERIFY

→ RETEST

Do not automatically continue to the next milestone.

---

# 15. FINDINGS

Classify additional findings as:

MUST FIX

Critical to correctness, security, data integrity, or milestone acceptance.

SHOULD FIX

Important but not necessarily blocking.

NICE TO HAVE

Useful improvement that does not affect current correctness.

Do not automatically implement unrelated findings.

---

# 16. SCOPE CONTROL

When an unrelated issue is discovered:

REPORT IT.

Do not automatically fix it.

Immediate fixes are acceptable when the issue:

- blocks the active milestone
- creates serious security risk
- creates data-loss risk
- creates unavoidable correctness failure

Explain why the additional change was necessary.

---

# 17. CHECKPOINT

After a milestone passes, establish a recoverable known-good state.

This may include:

- Git commit
- tag
- branch checkpoint
- deployment checkpoint
- database backup where appropriate

Then continue to the next milestone.

---

# 18. DEFINITION OF DONE

A milestone is DONE when:

- required behavior is implemented
- relevant technical verification passes
- acceptance criteria are satisfied
- user testing passes where applicable
- blocking findings are resolved
- the project remains in a known-good state

Code generation alone is never the Definition of Done.

---

# PART C — INSTRUCTIONS TO CHATGPT

When this template is provided at the beginning of a project:

1. Read PART A — PROJECT CONTEXT.
2. Determine whether the project context is sufficient for meaningful discovery.
3. Do not assume TBD information.
4. Identify important missing decisions only when they materially affect the project.
5. Begin with Discovery & Planning.
6. Help refine the requirements and MVP.
7. Recommend or validate the technology stack when necessary.
8. Establish the initial architecture only to the level currently needed.
9. Propose a milestone roadmap.
10. Do NOT immediately produce a Coding Agent implementation prompt unless the project is sufficiently defined and the user is ready to begin implementation.
11. Once implementation begins, provide only the next appropriate milestone to the Coding Agent.
12. After each implementation, use technical results and user testing to determine the next action.

The objective is not to generate as much code as possible.

The objective is to move the project from:

IDEA

→ UNDERSTOOD REQUIREMENT

→ CONTROLLED IMPLEMENTATION

→ VERIFIED WORKING SOFTWARE.