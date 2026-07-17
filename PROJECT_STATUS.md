# Conceptual Bridge Quiz Portal

## Project Information

**Project Name:** Conceptual Bridge Quiz Portal

**Current Version:** 0.4 (Planning)

**Status:** Mobile UI Refactoring

------------------------------------------------------------------------

# Current Status

## Desktop Version

✔ Stable

✔ Exam Flow Complete

✔ Review Mode Complete

✔ Performance Report Complete

✔ Parser Integrated

✔ API Stable

No further desktop UI modifications planned for now.

------------------------------------------------------------------------

# Mobile Version

## Current Status

Basic responsive CSS exists.

Several earlier scrolling issues have been resolved.

The current mobile layout is functional but is still using the desktop
architecture.

Instead of continuing to patch CSS, the mobile version will be
redesigned with a dedicated responsive layout while keeping the desktop
version completely untouched.

------------------------------------------------------------------------

# Mobile Refactoring Philosophy

Desktop Layout ↓

Remain exactly as it is.

↓

Mobile Layout

Will use dedicated responsive CSS.

No desktop logic will be modified.

No duplicate HTML pages.

No duplicate JavaScript.

Responsive CSS will completely rearrange the interface only for screens
≤768px.

------------------------------------------------------------------------

# Mobile Refactoring Roadmap

## Phase 1 --- Core Layout

Status: Pending

Tasks:

-   Full-width responsive containers
-   Comfortable spacing
-   Eliminate horizontal scrolling
-   Sticky mobile header
-   Sticky bottom navigation
-   Minimum 44px touch targets
-   Responsive typography

------------------------------------------------------------------------

## Phase 2 --- Instruction Pages

Status: Pending

Current desktop flow

Instruction Page 1

↓

Instruction Page 2

↓

Exam

Mobile redesign

Header

↓

Scrollable Instructions

↓

Avatar

↓

Bottom Navigation

No nested flex scrolling.

Natural mobile scrolling.

------------------------------------------------------------------------

## Phase 3 --- Question Screen

Status: Pending

Tasks

-   Single-column layout
-   Responsive question card
-   Larger answer options
-   Improved spacing
-   Responsive images
-   Sticky action buttons
-   Better language selector placement

------------------------------------------------------------------------

## Phase 4 --- Question Palette

Status: Pending

Desktop

Right sidebar palette

Mobile

Floating Palette Button

↓

Bottom Sheet

↓

Question Grid

This will maximize question reading space.

------------------------------------------------------------------------

## Phase 5 --- Review Mode

Status: Pending

Current review mode will be redesigned for mobile.

Question

↓

Selected Answer

↓

Correct Answer

↓

Learn Module

↓

Next Question

Vertical stacking only.

------------------------------------------------------------------------

## Phase 6 --- Performance Report

Status: Pending

Responsive metrics

Improved cards

Better button layout

Cleaner spacing

------------------------------------------------------------------------

## Phase 7 --- Animations

Status: Pending

Smooth transitions

Bottom sheet animation

Modal animation

Touch feedback

Native mobile feel

------------------------------------------------------------------------

# Technical Goals

✔ Desktop UI remains untouched

✔ No duplicated HTML

✔ No duplicated JavaScript

✔ Responsive CSS only

✔ Maintainable architecture

✔ Future-proof design

------------------------------------------------------------------------

# Long-Term Goals

Future features after mobile completion

-   Image rendering
-   Explanation module
-   AI short notes
-   Bookmark questions
-   Question paper mode
-   Performance analytics
-   Offline mode
-   Dark theme

------------------------------------------------------------------------

# Tomorrow's Starting Point

Begin Mobile Refactoring

Start with

Phase 1

Core Mobile Layout

Goal:

Create a clean mobile foundation before redesigning any individual
screen.

Desktop must remain pixel-perfect.

Only mobile layout will evolve.

------------------------------------------------------------------------

# Developer Workspace (Added: 2026-07-16)

## Status

**Current Version:** Developer Engine v0.1 (Foundation Complete)

The Developer Workspace is a separate interface built on the same parser
and rendering engine as the Student Portal.

### Completed

#### Developer API

-   ✅ topics API
-   ✅ files API
-   ✅ load API
-   ✅ Shared questionParser.js
-   ✅ Parsed questions returned from TXT files

#### Developer Quiz Engine

-   ✅ developer/quiz-engine.html
-   ✅ Developer toolbar
-   ✅ Topic selector
-   ✅ File selector
-   ✅ Load button
-   ✅ Question counter
-   ✅ Previous / Next navigation foundation
-   ✅ Developer mode bypasses instruction pages
-   ✅ Existing renderExamWindow() reused

#### Architecture

-   ✅ initializeDeveloperMode() introduced
-   ✅ initializeQuizEngine() delegates Developer initialization
-   ✅ Student and Developer share parser and renderer

## Workflow

TXT File → questionParser.js → Developer API → Developer Quiz Engine →
renderExamWindow()

## Cleanup Remaining

-   Add developer profile IDs or remove temporary JS
-   Auto-refresh file list on topic change
-   Remove debug console logs
-   Split developer initialization into helper functions

## Next Session

1.  Finish navigation
2.  Jump to Question
3.  Metadata panel
4.  Validation tools

## Project Note

The Mobile Refactoring roadmap above remains preserved and is postponed
while the Developer Workspace foundation is completed.

------------------------------------------------------------------------

# Authentication Workspace (Added: 2026-07-16)

## Status

**Current Version:** Authentication Module v0.1 (UI Foundation Complete)

The Authentication Workspace introduces a premium login experience built
on Firebase while maintaining the same design language as the Quiz
Portal.

### Firebase Foundation

-   ✅ Firebase Project created
-   ✅ Firebase SDK integrated
-   ✅ Authentication enabled
-   ✅ Google Authentication configured
-   ✅ Authentication state updates navigation button

### Login UI Completed

-   ✅ Custom glassmorphism login modal
-   ✅ Smooth modal animation
-   ✅ Glass shine animation
-   ✅ SVG password show/hide toggle
-   ✅ Forgot Password panel
-   ✅ Separate `loginFormPanel` and `resetPasswordPanel`
-   ✅ Modal resets to Login panel when reopened
-   ✅ OR divider
-   ✅ Premium custom Google button
-   ✅ Browser autofill styling reviewed
-   ✅ Click outside modal to close

### Architecture

-   Reusable modal structure
-   Separate panels for Login and Reset Password
-   Ready for future Create Account and Email Verification panels

## Remaining Authentication Tasks

### High Priority

1.  Connect custom Google button to Firebase
2.  Email & Password Login
3.  Create Account
4.  Password Reset email
5.  Email Verification

### UI Polish

-   Premium SVG close button
-   Fixed modal height
-   Slide animation between panels
-   Loading spinner / progress state
-   Toast notifications
-   Profile dropdown after login

------------------------------------------------------------------------

# Branding Workspace (Planned)

## Favicon Strategy

A dedicated favicon will be designed specifically for Conceptual Bridge
instead of shrinking the homepage logo.

### Planned Directory

Resources/ └── Favicon/

### Assets

-   favicon.ico
-   favicon-16x16.png
-   favicon-32x32.png
-   apple-touch-icon.png
-   android-chrome-192x192.png
-   android-chrome-512x512.png
-   site.webmanifest

### Design Direction

-   Minimal "CB" monogram or bridge-inspired mark
-   Optimized for 16×16 visibility
-   Consistent with Conceptual Bridge branding
-   Shared across desktop, mobile and PWA

------------------------------------------------------------------------

# Development Timeline

  Date         Milestone
  ------------ -------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  Next         Favicon Branding Package
  Next         Firebase Email Authentication

------------------------------------------------------------------------

# Next Development Session

Priority Order:

1.  Design dedicated favicon
2.  Generate favicon package
3.  Integrate favicon across all pages
4.  Connect Google Sign-In button
5.  Email & Password Authentication
6.  Password Reset via Firebase
7.  Firestore User Profile

------------------------------------------------------------------------

# 

------------------------------------------------------------------------

# Mobile Refactoring Progress (Added: 2026-07-17)

## Session Summary

**Status:** Phase 1 Foundation In Progress

This session focused on creating a maintainable mobile CSS foundation
without affecting the desktop experience.

### Completed

#### Mobile Foundation

-   ✅ Dedicated Mobile Foundation section introduced.
-   ✅ Mobile CSS variables added.
-   ✅ Universal `box-sizing` rule standardized.
-   ✅ Horizontal scrolling prevention implemented.
-   ✅ Responsive image sizing enabled.
-   ✅ Touch-friendly minimum button height added.
-   ✅ Mobile body scrolling refined.
-   ✅ Stage Two mobile scrolling improved.

#### Phase 1.1 -- Core Layout

-   ✅ Full-width mobile containers introduced.
-   ✅ Mobile dashboard converted to stacked layout.
-   ✅ Wizard container converted to column layout.
-   ✅ Responsive report button stack added.
-   ✅ Sticky mobile footer retained.

#### Phase 1.2 -- Header

-   ✅ Dedicated mobile header styling added.
-   ✅ Responsive logo sizing.
-   ✅ Single-line exam title with ellipsis.
-   ✅ Mobile timer sizing refined.

### Review Outcome

During implementation it was observed that a broad typography override
for the instruction page conflicted with the existing layout and inline
HTML styling.

Therefore:

-   ❌ Phase 1.3 Instruction Screen redesign was **not adopted**.
-   ✅ Existing instruction page preserved.
-   ✅ Future mobile instruction redesign will be performed
    section-by-section instead of applying large CSS overrides.

### Engineering Decision

Future mobile work will follow an incremental approach:

1.  Foundation
2.  Header
3.  Individual screen redesign
4.  Testing
5.  Next screen

This minimizes regressions while keeping the desktop UI unchanged.

# Documentation Rule

This file is the **master project document** for Conceptual Bridge.

All future development sessions (Quiz Engine, Parser, Mobile UI,
Authentication, Branding, Premium System, Analytics, etc.) must update
this document by preserving all previous content and appending new
modules and milestones instead of replacing or creating isolated status
files.

------------------------------------------------------------------------

# Quiz Portal Progress Update (Added: 2026-07-17)

## Current Status

**Version:** Quiz Portal v0.5 (UI & Tutorial Enhancements)

### Completed

-   ✅ Tutorial API stabilized and loading correctly.
-   ✅ Vercel file path issue resolved.
-   ✅ Tutorial pass mark range updated to 6.01--7.99.
-   ✅ Mobile instruction page scrolling fixed.
-   ✅ Mobile Next button fixed.
-   ✅ Dashboard legend moved below Student Profile.
-   ✅ Five live status counters added.
-   ✅ Dynamic counter updates implemented.
-   ✅ Custom PNG icons integrated.

## Deferred Tasks

1.  Dynamic User ID after authentication.
2.  Initialize Not Visited counter with total questions.
3.  Update Developer Quiz Portal with the same UI improvements.
4.  Secure the Developer Portal.

## Documentation

This remains the master project document. Preserve all existing content
and append future milestones.

------------------------------------------------------------------------

# Authentication Progress Update (Added: 2026-07-17)

## Current Status

**Version:** Authentication Module v0.2 (Core Authentication Flow)

### Completed This Session

#### Authentication UI

-   ✅ Navigation icon sizing refined.
-   ✅ SVG navigation icon styling aligned.
-   ✅ Profile dropdown container integrated.
-   ✅ Premium glassmorphism dropdown menu added.
-   ✅ Dropdown contains:
    -   My Profile
    -   Settings
    -   Log Out

#### Authentication Logic

-   ✅ Login button now behaves contextually:
    -   Logged out → Opens login modal.
    -   Logged in → Opens profile dropdown.
-   ✅ Profile dropdown toggle implemented.
-   ✅ Click-outside detection added to automatically close the
    dropdown.
-   ✅ Logout workflow prepared using Firebase `signOut()`.
-   ✅ Authentication flow continues to rely on `onAuthStateChanged()`
    for UI updates instead of manual DOM replacement.

### Architecture Decisions

-   Desktop-first architecture preserved.
-   Authentication remains modular inside `auth.js`.
-   Navbar is now ready for future:
    -   User Profile
    -   Settings
    -   Premium Membership
    -   Admin Tools
    -   User Dashboard

### Remaining Authentication Tasks

#### High Priority

1.  Complete Firebase Logout integration testing.
2.  Create Account (Sign Up).
3.  Email Verification.
4.  Password Reset email.
5.  Firestore User Profile document.
6.  Premium Membership integration.
7.  Role-based Authentication.
8.  Session management improvements.

------------------------------------------------------------------------

# Development Timeline (Updated)

  Date         Milestone
  ------------ ---------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  Next         Create Account (Sign Up)
  Next         Email Verification
  Next         Firestore User Profile

------------------------------------------------------------------------

# Documentation Note

This document continues to serve as the single source of truth for the
Conceptual Bridge project.

All future work must preserve existing sections and append new
milestones without removing previous project history.
