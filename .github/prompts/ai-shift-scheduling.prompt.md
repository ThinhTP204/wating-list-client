---
description: "Use when designing or implementing AI-assisted shift scheduling with availability input, staffing demand, conflict UI, and explainable AI preview."
name: "Design AI Shift Scheduling"
argument-hint: "target screen, time range, and constraints"
agent: "agent"
---

You are implementing AI-assisted shift scheduling for Wokki.

Goal:

- Build a realistic manager-like scheduling flow where AI proposes a draft and admin remains in control.

Context Inputs (must be modeled):

1. Employee availability input

- Employee marks each date as: available, busy, preferred.
- Source should map to EmployeeAvailability-like records.

2. Shift templates from admin

- Reusable shift definitions, including split shifts.
- Example: morning 08:00-12:00, split 10:00-14:00 + 17:00-21:00.

3. Staffing requirements

- Required headcount by day-of-week and shift.
- Example: Saturday evening requires 5, Monday morning requires 2.

4. Skills and roles constraints

- Enforce minimum role coverage per shift (lead, cashier, etc.).
- Prevent low-experience-only shift groups.

5. Historical quality data

- Attendance, punctuality, reliability, past performance in peak shifts.

Required UI Workflow:
Step 1: Employee Input

- Create employee screen: Dang ky lich ranh.
- UI: calendar with day status selection (available, busy, preferred).

Step 2: Admin Requirement Setup

- Create admin demand grid:
  - Columns: Monday -> Sunday
  - Rows: shift templates
  - Cells: required staff count and optional required role/skill

Step 3: AI Generate and Preview

- Add a dedicated button on shift scheduling screen:
  - Label: ✨ Sap xep lich ca bang A.I
- On click:
  - Show loading animation/state while generating draft.
  - Render AI-assigned shift cards with distinct visual treatment.
  - Each AI card must expose explainability text on click.
  - Example reason: selected because employee is available and under weekly target hours.

Conflict UI Requirements:

- If no candidate can fill a slot, show a high-visibility conflict card.
- Include AI guidance note with actionable fallback:
  - cross-branch support
  - overtime incentive
  - manager manual override
- Allow admin to resolve manually and re-run AI for unresolved slots.

Reference Types:

```ts
interface Availability {
  employeeId: string;
  date: string;
  status: "available" | "busy" | "preferred";
}

interface StaffingDemand {
  dayOfWeek: number; // 0-6
  shiftConfigId: string;
  minStaff: number;
  requiredSkill?: string;
}

interface AISuggestedShift {
  employeeId: string;
  shiftConfigId: string;
  date: string;
  confidenceScore: number; // 0-100
  reason: string;
}
```

Implementation Order (must follow):

1. Employee availability UI and data storage.
2. Admin staffing demand UI.
3. Rule-based scheduler MVP:

- Prioritize available employees.
- Enforce min-staff and required roles.
- Balance weekly hours where possible.

4. AI optimization layer (LLM/ML) for hard conflicts and better fairness.

Guardrails:

- AI output must be draft by default.
- Admin confirmation is required before publish.
- Every AI assignment must have a readable reason.

Output Format:

1. Files to create or update
2. Data models and API contracts
3. UI component plan by screen
4. Rule engine pseudocode for MVP
5. AI integration plan
6. Conflict handling plan
7. Validation checklist and commands

References:

- .github/copilot-instructions.md
- .github/instructions/frontend.instructions.md
- CLAUDE.md
- .claude/rules/001-fsd-architecture.md
- .claude/rules/002-coding-standards.md
