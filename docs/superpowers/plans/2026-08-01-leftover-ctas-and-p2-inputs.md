# Leftover CTAs and P2 inputs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate leftover Bootstrap CTAs to AppButton, then P2 inputs off form-control.

**Spec:** `docs/superpowers/specs/2026-08-01-leftover-ctas-and-p2-inputs-design.md`

## Global Constraints

- Legacy `carpoolear/` only; TDD `test:` then `feat:` per slice; no behavior changes

---

### Task 1: Buttons

**Files:** TicketDetail, ConversationList, Notifications, TripSeats (+ view tests)

- [ ] Failing tests for AppButton variants listed in spec
- [ ] Implement
- [ ] Commit test then feat

### Task 2: Inputs

**Files:** ConversationList search, LiveLocationShare URL, ManualIdentityValidation files (+ view tests)

- [ ] Failing tests for AppInput / AppField file pattern; no form-control
- [ ] Implement
- [ ] Commit test then feat
