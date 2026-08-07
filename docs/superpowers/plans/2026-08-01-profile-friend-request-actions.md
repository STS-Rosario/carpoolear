# Profile Friend-Request Actions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or implement inline with TDD). Steps use RED → GREEN → commit.

**Goal:** Profile outgoing invite shows Enviando → Cancelar (danger); incoming shows cream banner above tabs with Rechazar/Aceptar.

**Architecture:** `Profile.vue` owns incoming banner; `ProfileInfo.vue` owns invite/cancel; friends store APIs unchanged.

**Tech Stack:** Vue 2 Options API, Pinia, AppButton, home-prompt-banner CSS, Vitest source tests.

---

### Task 1: ProfileInfo outgoing invite/cancel

**Files:**
- Modify: `src/components/sections/ProfileInfo.view.test.js`
- Modify: `src/components/sections/ProfileInfo.vue`
- Modify: `src/language/i18n.js`

**Steps:**
1. RED: Update tests — `pending_sent` uses danger + `cancelarSolicitudAmistad` + `cancelRequest`; invite shows `enviandoSolicitudAmistad` while loading; remove accept/reject expectations from ProfileInfo; wire `cancelFriend`.
2. GREEN: Implement ProfileInfo + i18n ES/EN keys.
3. Run ProfileInfo tests; commit `test:` then `feat:`.

### Task 2: Profile incoming banner above tabs

**Files:**
- Modify: `src/components/views/Profile.view.test.js`
- Modify: `src/components/views/Profile.vue`
- Possibly: `src/styles/components/profile-page.css` for banner spacing

**Steps:**
1. RED: Assert banner between header and tabset, `home-prompt-banner`, `solicitudAmistadPendiente`, tertiary destructive Rechazar + primary Aceptar, friends store accept/reject + profile state update.
2. GREEN: Implement banner in Profile.vue.
3. Run Profile + ProfileInfo tests; commit.

### Task 3: Verify

Run focused vitest for ProfileInfo, Profile, related i18n if any.
