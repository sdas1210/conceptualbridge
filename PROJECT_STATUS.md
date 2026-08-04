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

# Developer Workspace Progress Update (Added: 2026-07-18)

## Current Status

**Version:** Developer Engine v0.2 (Metadata Inspector Foundation)

This session focused on extending the Developer Workspace into a
dedicated question inspection tool while keeping the Student Portal
completely untouched.

### Completed

#### Developer Inspector UI

-   ✅ Added dedicated **Developer Inspector** sidebar.
-   ✅ Added permanent read-only metadata panel.
-   ✅ Inspector integrated as a third workspace panel.
-   ✅ Layout prepared for future validation and editing tools.

#### Inspector Fields

The following metadata fields were introduced:

-   Question ID
-   Difficulty
-   Level
-   Marks
-   Question Type
-   Correct Answer
-   Image
-   Notification
-   Exam
-   Topic
-   Sub Topic

#### Developer Quiz Engine

-   ✅ `renderExamWindow()` selected as the single rendering entry point
    for future inspector updates.
-   ✅ Inspector designed to refresh whenever the active question
    changes.
-   ✅ Foundation prepared for centralized metadata rendering through
    `updateDeveloperInspector()`.

#### Parser Review

The shared parser (`services/questionParser.js`) was reviewed.

Verified available metadata:

-   ✅ Difficulty
-   ✅ Level
-   ✅ Marks
-   ✅ Question Type
-   ✅ Exam
-   ✅ Subject
-   ✅ Topic
-   ✅ Sub Topic
-   ✅ Notification
-   ✅ Shift
-   ✅ Image Path

#### Developer API Review

The Developer API (`api/developer/questions.js`) was reviewed.

Confirmed:

-   ✅ Shared parser integration.
-   ✅ Topic API.
-   ✅ File API.
-   ✅ Load API.
-   ✅ Metadata is forwarded directly from the parser.
-   ✅ Architecture remains shared between Student and Developer
    portals.

### Remaining Developer Tasks

#### High Priority

1.  Add permanent Question ID support inside the parser.
2.  Store both `correct` index and `correctLetter`.
3.  Connect `updateDeveloperInspector()` with live question rendering.
4.  Add validation console below the metadata panel.
5.  Add duplicate Question ID detection.
6.  Add missing image validation.
7.  Add metadata editing tools.
8.  Add Save / Undo workflow.

### Engineering Decision

The Developer Workspace will evolve independently of the Student Portal.

Architecture roadmap:

Developer Toolbar

↓

Question Viewer

↓

Developer Inspector

↓

Validation Console

↓

Editing Tools

↓

Bulk Maintenance Utilities

No Student Portal logic will be modified while implementing Developer
Workspace features.

------------------------------------------------------------------------

# Development Timeline (Updated)

  Date         Milestone
  ------------ ---------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  2026-07-18   Developer Metadata Inspector Foundation
  Next         Developer Validation Console
  Next         Question ID System
  Next         Metadata Editing Tools

------------------------------------------------------------------------

# Documentation Note

This document continues to serve as the single source of truth for the
Conceptual Bridge project.

All future work must preserve existing sections and append new
milestones without removing previous project history.

------------------------------------------------------------------------

# Developer Maintenance Suite (Planned) (Added: 2026-07-18)

## Current Status

**Version:** Developer Maintenance Suite v0.1 (Planning)

A dedicated maintenance workspace will be integrated into the existing
Developer Portal for long-term question bank management.

### Planned Modules

#### Question ID System

-   Generate permanent IDs only for questions without IDs.
-   Never modify existing Question IDs.
-   ID format:
    -   `QuestionID|Q00000001`
    -   `QuestionID|Q00000002`

#### Validation Tools

-   Missing Question IDs
-   Duplicate Question IDs
-   Missing Images
-   Metadata Validation
-   Question Structure Validation

#### Future Modules

-   Maintenance Dashboard
-   Bulk Metadata Editor
-   Duplicate Question Detector
-   Image Validator
-   Export Validation Report
-   Search by Question ID
-   Question Usage Analytics

### Engineering Decision

The Maintenance Suite will be integrated into the existing Developer
Workspace:

Developer Toolbar ↓ Question Viewer ↓ Developer Inspector ↓ Validation
Console ↓ Maintenance Suite

------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-07-18)

## Current Status

**Version:** Developer Maintenance Suite v0.2 (Isolated Tool Foundation
/ Citation Remover Phase 2 In Progress)

This session established the maintenance-tool development approach and
began converting an existing Python Citation Removal Engine into an
isolated browser-based JavaScript tool.

### Architecture Decisions

-   Develop and test maintenance utilities in an isolated environment
    before integrating them into the main Developer Portal.
-   Preserve the core working principles of existing Python utilities
    when converting them to JavaScript.
-   Prefer browser-local file processing where possible, avoiding
    unnecessary server/Vercel execution.
-   Existing `services/` can serve as shared reusable logic; a literal
    `shared/` folder is not required now.
-   Keep maintenance tools modular, preferably with a dedicated HTML
    interface and corresponding JS file for each major tool.
-   Later unify stable tools under a common Developer Maintenance
    Dashboard.

Examples: - `citation-remover.html` + `citation-remover.js` -
`id-generator.html` + `id-generator.js` - `validator.html` +
`validator.js` - `duplicate-checker.html` + `duplicate-checker.js` -
`image-validator.html` + `image-validator.js`

### Citation Removal Engine

The existing Python Citation Removal Engine was selected as the first
proof-of-concept.

Core workflow preserved:

Upload/select TXT → Read file → Scan lines → Detect trailing citation
block containing `cite:` → Remove matching block → Generate cleaned
output.

### Phase 1 --- UI Foundation

**Status:** ✅ Implemented and tested

Implemented: - ✅ TXT file upload. - ✅ File name display. - ✅ File
size display. - ✅ Total line count. - ✅ Processing Console. - ✅
Statistics panel. - ✅ Lines Scanned counter. - ✅ Citations Removed
counter. - ✅ Output File field. - ✅ Start Processing disabled until a
file is loaded. - ✅ Download Output reserved for generated output. - ✅
Developer-style dark interface.

Verified: - ✅ Uploaded TXT loads successfully. - ✅ Metadata reads
successfully. - ✅ Console logging works. - ✅ Start Processing invokes
`processFile()`. - ✅ Console displays `Starting Processing...`.

### Phase 2 --- Processing Engine

**Status:** 🟡 In Progress

Global processing state introduced:

``` javascript
let originalText = "";
let cleanedText = "";
let totalLines = 0;
let removedCount = 0;
let scannedCount = 0;
```

Uploaded content is stored in `originalText` for later processing.

Current workflow:

Upload TXT → Store original text → Split into lines → Reset counters →
Scan lines → Apply citation-removal rules → Build cleaned output →
Update statistics → Prepare downloadable `citeremoved.txt`.

### Current Tested Point

The tool currently reaches:

1.  Upload file.
2.  Read metadata.
3.  Store file content.
4.  Enable processing.
5.  Invoke `processFile()`.
6.  Log `Starting Processing...`.

### Immediate Next Implementation

Complete and test the line-scanning loop:

``` javascript
for (let i = 0; i < lines.length; i++) {
    scannedCount++;
    const line = lines[i];
}
```

Periodic console updates can show: - `Scanning Line 1` -
`Scanning Line 101` - `Scanning Line 201`

First test target: - `Lines Scanned` reaches the total uploaded line
count. - Console periodically displays scan progress. - Do not add
citation-removal logic until this scan loop is confirmed working.

### Remaining Citation Remover Tasks

1.  Complete sequential line scan.
2.  Port Python `endsWith("]")` rule.
3.  Find final `[` block using JavaScript equivalent of `rfind`.
4.  Detect `cite:` case-insensitively.
5.  Remove only matching trailing citation block.
6.  Preserve non-matching lines.
7.  Update statistics.
8.  Build `cleanedText`.
9.  Enable Download Output.
10. Generate downloadable `citeremoved.txt`.
11. Add completion/error states.
12. Later consider asynchronous batch processing/progress bar for very
    large files.

### Cost / Deployment Decision

-   Prefer browser-local processing where server access is unnecessary.
-   Browser-local file processing has no Vercel function execution cost.
-   Server-side maintenance tools can be considered later when required.

### Future Integration Strategy

Isolated Maintenance Tool → Test Core Logic → Stabilize UI/Output →
Reuse Shared Services → Integrate into Developer Maintenance Dashboard →
Secure Behind Developer Authentication.

The Student Portal must remain unaffected during maintenance-tool
development.

------------------------------------------------------------------------

# Immediate Next Starting Point

Continue **Citation Removal Engine --- Phase 2** from the existing
working `processFile()` foundation.

**Next task:** Implement and test the line-scanning loop first. After
that, port the citation-removal algorithm from Python to JavaScript and
enable output download.

------------------------------------------------------------------------

------------------------------------------------------------------------

# Quiz Portal Progress Update (Added: 2026-07-27)

## Current Status

**Version:** Quiz Portal v0.6 (Mathematics Engine & KaTeX Integration)

### Completed This Session

#### Mathematics Rendering

-   ✅ KaTeX integrated into Mathematics Question rendering.
-   ✅ Dedicated Common/Equation section introduced.
-   ✅ Responsive equation sizing using `clamp()`.
-   ✅ Common section enlarged for better mathematical readability.
-   ✅ Common section kept independent from global KaTeX sizing.

#### KaTeX Expansion

-   ✅ KaTeX rendering extended to answer options.
-   ✅ Global KaTeX rendering strategy discussed for future-proof
    architecture.
-   ✅ Review mode KaTeX integration identified and partially
    implemented.
-   ✅ Rendering workflow documented for future cleanup into a
    centralized renderer.

#### UI Improvements

-   ✅ Mathematics common section now supports responsive scaling.
-   ✅ Horizontal scrolling enabled for exceptionally long equations
    instead of forcing undesirable wrapping.
-   ✅ Global KaTeX styling enlarged while allowing the Common section
    to preserve its own sizing rules.

#### Instruction Flow

-   ✅ Instruction page scroll activation logic reviewed.
-   ✅ Footer layout reviewed.
-   ✅ Minor cleanup performed around duplicated scroll logic.

------------------------------------------------------------------------

# Immediate Priority - Next Development Session

## Highest Priority Tasks

### 1. Mathematics Tutorial Corner (Highest Priority)

-   Activate the Tutorial Corner for the Mathematics section.
-   Ensure Math tutorial questions load using the Mathematics parser.
-   Verify bilingual rendering and KaTeX support.

### 2. Default Language Workflow

-   Redesign the default language selection behaviour.
-   Decide whether the language should be selected globally or
    remembered between sessions.

### 3. JSON Driven Quiz Engine

Replace the fixed 10-question selection with a JSON-driven
configuration.

Planned capabilities:

-   Select questions by Topic.
-   Select questions by Sub-Topic.
-   Flexible question count.
-   Future support for weighted/randomized selection.

### 4. Tutorial Download Module

Create the download section inside the Tutorial Corner.

Planned features:

-   Download English version.
-   Download Bengali version.
-   Future PDF support.
-   Future Study / Practice workflow integration.

------------------------------------------------------------------------

# Engineering Notes

Current direction for the Mathematics module:

Question ↓

Common Equation ↓

Options ↓

Review

↓

Unified KaTeX Rendering Pipeline

Future rendering will move toward a single centralized renderer so every
new section (Solutions, Hints, Review, Tutorials, etc.) automatically
supports KaTeX without duplicated rendering code.

------------------------------------------------------------------------

------------------------------------------------------------------------

# Quiz Portal Progress Update (Added: 2026-07-27 --- CSS Foundation Cleanup)

## Current Status

**Version:** Quiz Portal v0.7 (CSS Architecture Foundation)

### Completed This Session

#### Phase A --- CSS Foundation Cleanup

-   ✅ Began a structured CSS architecture refactoring with **no
    functional changes**.
-   ✅ Introduced section-based organization across the stylesheet.
-   ✅ Desktop and mobile logic preserved.
-   ✅ JavaScript behaviour intentionally left untouched.
-   ✅ Existing UI preserved while improving maintainability.

#### CSS Architecture

The stylesheet is now organized into logical sections:

1.  Root Variables
2.  Global Foundation
3.  Header
4.  Main Workspace
5.  Question Panel
6.  Review Mode
7.  Action Bar
8.  Dashboard
9.  Wizard
10. Report
11. Mobile Foundation
12. Mobile Layout
13. Mobile Header

#### Engineering Decisions

-   ✅ Refactoring is documentation/organization only.
-   ✅ No selector renaming.
-   ✅ No CSS optimization yet.
-   ✅ No visual redesign.
-   ✅ Foundation prepared for future technical-debt cleanup.

------------------------------------------------------------------------

# Immediate Priority --- Next Development Session

## Highest Priority

### Phase B --- CSS Technical Debt Cleanup

Planned work:

1.  Remove duplicated CSS declarations.
2.  Consolidate repeated styles.
3.  Reduce safe inline styles by moving them into reusable classes.
4.  Improve maintainability without changing UI or functionality.
5.  Prepare the stylesheet for future mobile enhancements.

### Engineering Principle

Desktop behaviour must remain pixel-perfect.

All future CSS cleanup must preserve:

-   Existing UI
-   Existing JavaScript
-   Existing HTML structure
-   Existing functionality

Only internal CSS quality and maintainability should improve.

------------------------------------------------------------------------

------------------------------------------------------------------------

# Authentication Progress Update (Added: 2026-07-27 --- Milestone 1 Complete)

## Current Status

**Version:** Authentication Module v1.0 (Milestone 1 Completed)

### Completed This Session

#### Firebase Authentication

-   ✅ Email & Password Sign Up
-   ✅ Email & Password Login
-   ✅ Google Sign-In
-   ✅ Password Reset
-   ✅ Email Verification
-   ✅ Unverified email login prevention
-   ✅ Automatic sign-out after account creation
-   ✅ Authentication state managed through `onAuthStateChanged()`

#### User Experience

-   ✅ Glassmorphism authentication modal finalized.
-   ✅ Login, Sign Up, Reset Password and Verification panels completed.
-   ✅ Toast notification system implemented.
-   ✅ Loading indicators added to all asynchronous authentication
    actions.
-   ✅ Keyboard Enter support for all authentication forms.
-   ✅ Automatic focus management between authentication panels.
-   ✅ Responsive profile dropdown integrated.
-   ✅ Complete logout cleanup workflow implemented.

#### Architecture

-   ✅ Reusable authentication helper functions.
-   ✅ Centralized loading wrapper.
-   ✅ Class-based dropdown management.
-   ✅ Modular `auth.js` architecture preserved.
-   ✅ Authentication UI isolated from future Firestore implementation.

### Engineering Decision

Milestone 1 (Authentication Core) is now considered complete and frozen.

Further authentication changes will only be made if required by future
modules such as Firestore User Profiles, Premium Membership, User
Dashboard, or Role-Based Access Control.

------------------------------------------------------------------------

# Immediate Priority --- Next Development Session

## Milestone 2 --- Firestore User Profiles

Planned objectives:

1.  Create Firestore user profile documents after successful
    registration.
2.  Store user metadata (UID, Name, Email, Provider, Created Date,
    etc.).
3.  Load profile data after authentication.
4.  Prepare foundation for Premium Membership.
5.  Prepare foundation for Quiz History and Analytics.
6.  Maintain separation between Authentication and Firestore logic.

### Engineering Principle

Authentication is now treated as a stable foundation.

Milestone 2 will extend functionality without redesigning the completed
authentication workflow.

------------------------------------------------------------------------

# Developer Workspace Progress Update (Added: 2026-07-27 --- Question ID Foundation)

## Current Status

**Version:** Developer Engine v0.3 (Question ID Infrastructure)

### Completed This Session

#### Parser Foundation

-   ✅ Reviewed `questionParser.js` and `mathParser.js`.
-   ✅ Confirmed Mathematics parser already supports `QuestionID`.
-   ✅ Added `QuestionID` support to the shared GACA parser.
-   ✅ GACA parser now exposes `QuestionID` consistently with the
    Mathematics parser.
-   ✅ Parser architecture intentionally preserved with no functional
    refactoring.

### Engineering Review

-   No validation logic changed.
-   No rendering logic changed.
-   No API behaviour changed.
-   Student Portal and Exam Corner remain unaffected by this parser-only
    update.
-   This session establishes the backend foundation for future Developer
    Workspace features.

------------------------------------------------------------------------

# Next Deployment Session (Developer Workspace)

## Session 2 --- Developer API Integration

### Objective

Expose `QuestionID` from the Developer API to the Developer Workspace.

### Planned Files

-   `api/developer/questions.js`
-   Any developer-only API helper required for question loading.

### Planned Tasks

1.  Verify `QuestionID` is returned in the API response.
2.  Preserve existing API response structure.
3.  Avoid any changes to Student Portal APIs.
4.  Verify compatibility with both GACA and Mathematics parsers.

### Expected Outcome

Developer Workspace receives `QuestionID` together with all existing
metadata, preparing the Metadata Inspector for live Question ID display.

------------------------------------------------------------------------

# Engineering Principle

Developer Workspace enhancements must remain isolated from
Student-facing functionality.

Architecture:

TXT File ↓ Subject Parser ↓ Developer API ↓ Developer Workspace ↓
Developer Inspector

Each deployment session should introduce one isolated functional
enhancement and complete verification before proceeding to the next
session.

------------------------------------------------------------------------

# PDF Generation Engine Progress Update (Added: 2026-07-28)

## Current Status

**Version:** PDF Engine v0.1 (Framework Foundation Complete)

### Completed This Session

-   ✅ Modular PDF architecture established (`pdf-entry.js`,
    `pdf-loader.js`, `pdf-generator.js`).
-   ✅ Unified Entry → Loader → Generator pipeline completed.
-   ✅ Study and Practice buttons use the same PDF workflow.
-   ✅ Tutorial API integrated with the PDF loader.
-   ✅ jsPDF successfully integrated.
-   ✅ First downloadable PDF generated.
-   ✅ Reusable Header, Information Block and Footer functions created.
-   ✅ Dynamic Question Count implemented using `questionArray.length`.
-   ✅ Dynamic Mode (Study / Practice) added.
-   ✅ Dynamic Generated Date added.
-   ✅ Layout constants (`HEADER_HEIGHT`, `INFOBOX_HEIGHT`,
    `FOOTER_HEIGHT`) introduced.
-   ✅ `questionStartY` and `currentY` prepared for future rendering.

### Engineering Decisions

-   PDF loading remains isolated inside `pdf-loader.js`.
-   `pdf-generator.js` focuses only on rendering.
-   Layout foundation is completed before question rendering.

## Next Development Session

### Phase 3.4 --- Question Rendering Engine

1.  Fine-tune the document layout.
2.  Render Question 1.
3.  Introduce reusable `drawQuestion()`.
4.  Add automatic text wrapping.
5.  Begin page-break handling.
6.  Preserve reusable header and footer for all pages.

### Future Roadmap

-   Render all questions.
-   Study vs Practice formatting.
-   Automatic page numbering.
-   Logo integration.
-   Watermark support.
-   Mathematics / KaTeX compatible PDF rendering.

------------------------------------------------------------------------

# Exam Corner Progress Update (Added: 2026-07-28)

## Current Status

**Version:** Exam Corner v0.2 (Full Mock Availability Foundation)

### Completed This Session

#### Full Mock Availability

-   ✅ Added dedicated `api/full-mock-status.js`.
-   ✅ Server-side readiness validation introduced.
-   ✅ Full Mock now requires a minimum of **30 questions** in each
    required subject bank.
-   ✅ `exams.html` automatically enables/disables the **Launch Full
    Mock Simulator** button based on API status.
-   ✅ No question counts are exposed to students.

#### Backend Protection

-   ✅ Added backend validation in `fetch-questions.js`.
-   ✅ Direct `topic=ALL` requests are blocked until all required
    subject banks are ready.
-   ✅ Introduced reusable `hasMinimumQuestions()` helper.
-   ✅ Manual URL bypass protection implemented.

### Engineering Decisions

-   Full Mock availability is enforced by the backend.
-   The UI only reflects server readiness.
-   Current implementation intentionally keeps the Full Mock locked
    because the GI and GS repositories are not yet populated.
-   The architecture is prepared for future expansion without modifying
    the Student Portal workflow.

## Deferred Work

-   Implement the CBT-1 **3:3:1:3** subject distribution after GI and GS
    question banks are available.
-   Refine combined paper generation once all four repositories are
    populated.

------------------------------------------------------------------------

# Immediate Priority --- Next Development Session

## Full Mock Generation Phase

1.  Create GI and GS question repositories.
2.  Populate each repository with validated questions.
3.  Implement fixed CBT-1 3:3:1:3 question distribution.
4.  Verify combined paper generation.
5.  Perform end-to-end Full Mock testing.

------------------------------------------------------------------------

# PDF Engine Progress Update (Added: 2026-07-29 --- Browser Compatibility Investigation)

## Current Status

**Version:** PDF Engine v0.2 (Architecture Frozen / Browser
Compatibility Investigation)

### Completed This Session

#### PDF Engine V2

-   ✅ Rebuilt the PDF generator into a cursor-based rendering engine.
-   ✅ Modular rendering pipeline preserved:
    -   `createNewPage()`
    -   `checkRemainingSpace()`
    -   `drawHeader()`
    -   `drawInformationBox()`
    -   `drawQuestion()`
    -   `drawFooter()`
-   ✅ Dynamic page-break logic implemented.
-   ✅ Dynamic text wrapping implemented.
-   ✅ Study and Practice modes share the same rendering pipeline.
-   ✅ Layout constants centralized.

#### Unicode Migration

-   ✅ Migration from jsPDF to pdf-lib completed.
-   ✅ Noto Sans Bengali TrueType fonts integrated.
-   ✅ Browser font loading using `FontFace` explored.
-   ✅ Canvas-based text measurement implemented to eliminate dependency
    on `widthOfTextAtSize()`.

#### Root Cause Investigation

The original assumption was that `font.widthOfTextAtSize()` triggered
the browser compatibility issue.

After refactoring:

-   ✅ All layout measurements now use HTML5 Canvas.
-   ✅ `widthOfTextAtSize()` removed from rendering calculations.

However, testing proved that the error still occurs during actual PDF
text rendering.

Verified call chain:

`PDFPage.drawText()` ↓ `PDFFont.encodeText()` ↓
`CustomFontEmbedder.encodeText()` ↓ `fontkit.layout()` ↓
`ReferenceError: regeneratorRuntime is not defined`

### Engineering Conclusion

This session confirmed that the PDF Engine architecture is **not** the
source of the problem.

Current evidence indicates that the browser UMD build of
**@pdf-lib/fontkit** is incompatible with the current browser-only
deployment environment when encoding custom Unicode fonts.

### Decisions

-   ✅ Freeze PDF Engine V2 architecture.
-   ✅ Do not redesign the rendering engine.
-   ✅ Do not return to jsPDF.
-   ✅ Stop debugging layout code.
-   ✅ Shift investigation to the browser compatibility of
    pdf-lib/fontkit.

------------------------------------------------------------------------

# Next Development Session --- PDF Browser Compatibility

## Immediate Starting Point

Resume directly from the font compatibility investigation.

Do **not** revisit layout, wrapping, pagination or rendering
architecture.

### Phase 1

Create a minimal standalone browser test:

1.  Load pdf-lib.
2.  Load fontkit.
3.  Register fontkit.
4.  Embed Noto Sans Bengali.
5.  Draw a single Bengali string.
6.  Save the PDF.

Objective:

Determine whether the failure exists independently of the Conceptual
Bridge codebase.

### Phase 2

If the minimal test fails:

-   Compare browser-compatible versions of `pdf-lib` and
    `@pdf-lib/fontkit`.
-   Investigate alternative browser-safe fontkit builds.
-   Verify whether the issue is version-specific.

### Phase 3

Once Unicode rendering is stable:

-   Reconnect the existing PDF Engine V2.
-   End-to-end testing.
-   Final UI polishing.
-   Freeze PDF Engine v1.0.

------------------------------------------------------------------------

# PDF Download Module Roadmap

## Milestone 1 --- Foundation

-   ✅ Entry / Loader / Generator architecture
-   ✅ Tutorial integration
-   ✅ Dynamic layout engine

## Milestone 2 --- Browser Compatibility

-   🔄 Resolve Unicode custom font rendering in browser.
-   🔄 Validate browser compatibility.

## Milestone 3 --- Rendering Completion

-   Render all questions.
-   Correct answer highlighting in Study mode.
-   Practice mode formatting.
-   Automatic pagination.

## Milestone 4 --- Mathematics Support

-   KaTeX / Mathematics compatibility.
-   Equation rendering verification.

## Milestone 5 --- Professional Output

-   Conceptual Bridge branding.
-   Logo.
-   Watermark.
-   Metadata.
-   Print optimization.

## Milestone 6 --- Release Candidate

-   Cross-browser testing.
-   Large document testing.
-   Performance optimization.
-   Production release.

------------------------------------------------------------------------

# Session Resume Marker

When the next development session begins, start **only** from:

**PDF Engine v0.2 --- Browser Compatibility Investigation**

The rendering engine is considered architecturally stable.

The next objective is to identify and resolve the browser-compatible
Unicode font embedding issue before adding any new PDF features.

------------------------------------------------------------------------

# PDF Engine Progress Update (Added: 2026-07-31 --- Browser Diagnostics Completed)

## Current Status

**Version:** PDF Engine v0.3 (Browser Runtime Validated)

### Completed This Session

#### PDF Diagnostics Workspace

-   ✅ Created dedicated browser diagnostics page for the PDF subsystem.
-   ✅ Verified runtime loading of `pdf-lib` browser UMD library.
-   ✅ Verified runtime loading of `fontkit` browser UMD library.
-   ✅ Confirmed download engine initialization.

#### Dependency Verification

-   ✅ Identified missing third-party browser libraries during
    architecture review.
-   ✅ Added browser UMD builds:
    -   `vendor/pdf-lib/pdf-lib.min.js`
    -   `vendor/pdf-lib/fontkit.umd.min.js`
-   ✅ Connected diagnostics page to the required libraries through
    script tags.

#### Font Resource Resolution

Initial diagnostics reported:

-   PDF Library → PASS
-   FontKit → PASS
-   Font File → FAIL
-   Unicode Rendering → FAIL
-   PDF Generation → FAIL

Root cause:

The Bengali font path was referenced relatively:

    fonts/NotoSansBengali-Regular.ttf

Because the diagnostics page resides under:

    developer/diagnostics/

the browser attempted to load:

    /developer/diagnostics/fonts/NotoSansBengali-Regular.ttf

resulting in HTTP 404.

Resolution:

Updated the font paths to root-relative URLs:

    /fonts/NotoSansBengali-Regular.ttf
    /fonts/NotoSansBengali-Bold.ttf

#### Final Verification

Browser diagnostics now report:

-   ✅ PDF Library
-   ✅ FontKit
-   ✅ Font File
-   ✅ Unicode Rendering
-   ✅ PDF Generation
-   ✅ Download Engine

This validates the complete browser-side Unicode PDF pipeline.

### Engineering Decisions

-   The PDF engine architecture remains unchanged.
-   The issue was confirmed to be resource path resolution rather than
    the rendering engine.
-   Diagnostics page retained as a permanent developer maintenance
    utility.
-   Future PDF features should be implemented on this validated
    foundation.

------------------------------------------------------------------------

# Immediate Priority --- Next Development Session

## PDF Engine Integration

1.  Integrate the validated PDF pipeline into the production Quiz
    Portal.
2.  Create a reusable PDF service for Study and Practice downloads.
3.  Connect the renderer to live quiz data.
4.  Extend the diagnostics page with Browser Compatibility detection so
    the final pending status becomes PASS/FAIL automatically.

------------------------------------------------------------------------

# Quiz Portal Progress Update (Added: 2026-07-31 --- QUESTION_STATE Refactoring)

## Current Status

**Version:** Quiz Portal v0.8 (JavaScript Readability & State
Management)

### Completed This Session

#### QUESTION_STATE Migration

-   ✅ Introduced centralized `QUESTION_STATE` constants.
-   ✅ Replaced hard-coded numeric question states with named constants.
-   ✅ Updated initialization logic to use `QUESTION_STATE`.
-   ✅ Updated question state transitions (Not Visited, Not Answered,
    Answered, Review).
-   ✅ Updated palette rendering to use named state constants.
-   ✅ Restored and verified `updateQuestionStatistics()` after
    refactoring.
-   ✅ Preserved existing desktop behaviour while improving code
    readability.

#### Review Mode

-   ✅ Review palette continues to distinguish incorrectly answered
    questions.
-   ✅ Review-mode rendering remains compatible with the new state
    constants.

#### Engineering Notes

-   This refactoring was intentionally limited to readability and
    maintainability.
-   No functional changes were introduced to the quiz workflow.
-   Desktop architecture remains unchanged.

### Issues Identified

-   ⚠️ Mobile instruction-page scroll activation requires further
    refinement after the responsive layout changes.
-   ⚠️ The "Next" button activation is affected because the current
    mobile scrolling behaviour differs from the original
    scroll-container design.
-   ⚠️ This issue has been isolated to the mobile instruction workflow
    and is unrelated to the `QUESTION_STATE` migration.

------------------------------------------------------------------------

# Immediate Priority --- Next Development Session

## Mobile Instruction Flow Stabilization

1.  Restore reliable instruction-page scroll detection.
2.  Ensure the "Next" button activates correctly after reaching the
    bottom of the instructions.
3.  Verify consistent behaviour across desktop and mobile layouts.
4.  Preserve desktop functionality while refining the mobile scrolling
    architecture.

### Engineering Principle

The `QUESTION_STATE` refactoring is considered complete.

The next development session should focus on stabilizing the mobile
instruction workflow before proceeding with additional UI refactoring.


------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-08-01 --- Global Metadata Tagger Production Release)

## Current Status

**Version:** Developer Maintenance Suite v1.0 (Global Metadata Tagger Stable)

### Completed This Session

- ✅ Mathematics Topic/SubTopic now use `math.json` correctly.
- ✅ Dynamic Topic → SubTopic dependency verified.
- ✅ Existing metadata preservation verified.
- ✅ Guided metadata creation finalized.
- ✅ Blank Topic/SubTopic supported for both GACA and Mathematics.
- ✅ All remaining metadata fields remain mandatory.
- ✅ TXT reconstruction verified.
- ✅ Duplicate `<main>` HTML removed.
- ✅ Trim-based duplicate detection implemented.
- ✅ Alphabetical `metadata.json` export implemented.
- ✅ Case-insensitive sorting using `localeCompare(b, undefined, { sensitivity: "base" })`.
- ✅ `_updated.txt` download naming implemented.
- ✅ Production regression review completed.

### Engineering Decision

The Global Metadata Tagger is considered production-ready and frozen except for future feature enhancements.

------------------------------------------------------------------------

# Development Timeline (Updated)

| Date | Milestone |
|------|-----------|
| 2026-08-01 | Global Metadata Tagger Production Release |
| Next | Mathematics Parser Development |

------------------------------------------------------------------------

# Current Continuation Point

Begin Mathematics Parser development using the finalized Global Metadata Tagger architecture as the reference implementation.



------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-08-04 --- Question Format Converter Production Release)

## Current Status

**Version:** Developer Maintenance Suite v1.1 (Question Format Converter Stable)

### Completed This Session

#### Question Format Converter

- ✅ Standalone HTML, CSS and JavaScript architecture completed.
- ✅ Browser-only offline processing implemented.
- ✅ Legacy `Q|` conversion to `QEN|` / `QBN|`.
- ✅ Global Metadata validation implemented.
- ✅ Question Block validation implemented.
- ✅ Duplicate and missing tag detection implemented.
- ✅ Mixed-format compatibility (legacy and already converted files).
- ✅ Automatic insertion of `Common|`, `Image|`, `Topic|` and `SubTopic|`.
- ✅ `QuestionID|` preserved and positioned after `SubTopic|`.
- ✅ Blank optional metadata preserved.
- ✅ Standardized Conceptual Bridge output format finalized.
- ✅ Production workflow, file validation, copy/download/reset and drag-drop support completed.
- ✅ Production verification completed.

### Engineering Decision

The Question Format Converter is considered production-ready and frozen except for future bug fixes or new format support.

------------------------------------------------------------------------

# Development Timeline (Updated)

| Date | Milestone |
|------|-----------|
| 2026-08-01 | Global Metadata Tagger Production Release |
| 2026-08-04 | Question Format Converter Production Release |
| Next | Mathematics Parser Development |

------------------------------------------------------------------------

# Current Continuation Point

Begin Mathematics Parser development using the finalized Global Metadata Tagger and Question Format Converter as the preprocessing pipeline.

