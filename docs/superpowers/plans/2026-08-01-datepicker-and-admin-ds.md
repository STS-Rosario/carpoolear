# DatePicker + admin DS Implementation Plan

> **For agentic workers:** Use TDD (`test:` / `feat:`) per area. Prefer inline execution.

**Goal:** Semantic DatePicker chrome, then migrate all Admin* form-control/btn leftovers to App*.

**Spec:** `docs/superpowers/specs/2026-08-01-datepicker-and-admin-ds-design.md`

## Task 1: DatePicker

- Failing tests: no `form-control` in DatePicker.vue; semantic surface classes; AppField CSS updated
- Implement + update dependent selectors
- Wrap UpdateProfile / AdminSearchTrips if needed
- Commit

## Task 2+: Admin by area

1. Support tickets + templates  
2. Identity validation + MP rejected  
3. Cars catalog + changelogs  
4. Users / migrations / trips search / maintenance / misc cards & pagination  

Each area: failing view tests → implement → commit.
