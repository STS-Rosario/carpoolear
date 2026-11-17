# Un litro “¿Qué es esto?” modal shows full page content

**Date:** 2026-11-17  
**Branch:** `feat/un-litro-info-modal-page-content` (from `feat/club-carpoolear-sellado-exemption`)  
**Out of scope:** Backend Blade page, Club sellado exemption behavior, changing `/un-litro-para-carpoolear` route

## Goal

Replace the short 4-paragraph Un litro explanation modal with the full informational content from `/un-litro-para-carpoolear`, in a large scrollable modal with close controls.

## Decisions

| Topic | Choice |
| --- | --- |
| Base branch | Tip of Club sellado exemption branch |
| Content reuse | Extract shared `UnLitroParaCarpoolearContent` used by page + modal |
| Modal chrome | Existing Modal X + footer **Cerrar** |
| Size | Large modal (`size="large"`), body scrolls |

## Design

1. Extract markup + styles from `UnLitroParaCarpoolear.vue` into `UnLitroParaCarpoolearContent.vue`.
2. Page becomes layout wrapper + content component.
3. `UnLitroInfoCard` “¿Qué es esto?” opens large modal rendering the content component (no short i18n paragraphs).
4. Extend `Modal.vue` with `size="large"` for wider max-width / viewport-friendly height.
