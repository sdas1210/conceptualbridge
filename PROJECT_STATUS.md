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

# Developer Maintenance Suite Progress Update (Added: 2026-07-19)

## Current Status

**Version:** Developer Maintenance Suite v0.4 (Citation Remover Complete / Proof Reader Core Complete / Maintenance Dashboard Added)

This session substantially advanced the isolated browser-based maintenance workspace. The earlier Citation Removal Engine foundation was completed, a new Proof Reader / Character Validation Engine was created, and a common Maintenance Suite landing page was introduced.

## Maintenance Architecture

Current structure:

```text
Maintenance Dashboard
├── Citation Removal Engine
└── Proof Reader / Character Validation Engine
```

Each utility remains modular with its own HTML, CSS and JavaScript. Browser-local TXT processing remains preferred so the Student Portal and shared quiz runtime are unaffected.

### UI Design Direction

- ✅ Maintenance landing page introduced.
- ✅ Compact tool cards with icons and short descriptions.
- ✅ Visual language aligned with the main Conceptual Bridge `index.html`.
- ✅ Animated blue gradient and glassmorphic cards/controls adopted.
- ✅ Subscribe/promotional elements excluded from Developer Maintenance.
- ✅ Individual tools use `← Maintenance Home` navigation.
- ✅ Citation Remover converted to glassmorphic theme.
- 🟡 Proof Reader glassmorphic conversion prepared / being applied.

Implementation rule: HTML, CSS and JavaScript must remain in their correct files. CSS must not be pasted after `</html>` or into JavaScript, as this can cause syntax errors such as `Unexpected token '*'`.

## Citation Removal Engine

**Status:** ✅ Core Workflow Complete and Tested

### Completed

- ✅ TXT upload and local file reading.
- ✅ File name, size and total-line metadata.
- ✅ Sequential line scanning and Processing Console progress.
- ✅ Citation detection/removal logic implemented.
- ✅ `cleanedText` generated.
- ✅ Lines Scanned and Citations Removed counters.
- ✅ Tested example successfully removed 600 citations.
- ✅ Remaining-citation integrity check.
- ✅ Question-structure integrity check.
- ✅ Download safety gate.
- ✅ Download Output activates only after successful validation.
- ✅ Cleaned TXT browser download.
- ✅ New file upload resets previous processing/download state.
- ✅ Glassmorphic UI and Maintenance Home navigation.

### Validation Safety Flow

```text
Upload TXT
↓
Scan and remove matching citations
↓
Check remaining citations
↓
Integrity Check
↓
Structure Check
↓
Validation passes
↓
Enable Download Output
```

### Future Refinements

- Preserve original filename automatically.
- Preserve original CRLF/LF line endings.
- Harden whitespace preservation so only intended citation text changes.

## Proof Reader / Character Validation Engine

**Status:** ✅ Core Workflow Implemented

A browser-based interactive Proof Reader was created from the existing Python proof-reading concept.

### Purpose

Scan English/Bengali question TXT assets for unexpected Unicode characters and provide an interactive line editor for correction.

### Completed

- ✅ TXT upload and file information.
- ✅ Processing Console and Validation Statistics.
- ✅ Character Validation Report.
- ✅ Text Editing Window.
- ✅ JavaScript character validator for English, Bengali, numbers, whitespace, standard punctuation and selected typographic punctuation.
- ✅ Invalid-character and affected-line counting.
- ✅ PASSED / FAILED validation state.
- ✅ Unicode code point and affected line/context reporting.
- ✅ First unresolved error automatically displayed.
- ✅ Physical line-by-line Previous/Next navigation.
- ✅ Edit/Save workflow with navigation lock while editing.
- ✅ Saved edits stored in in-memory `workingLines`.
- ✅ Re-Validate scans edited working content.
- ✅ New earlier errors become the next displayed error.
- ✅ Session-only Pass system.
- ✅ Pass scoped by line number + invalid character.
- ✅ Passed errors excluded from later validation in the same uploaded-file session.
- ✅ Pass state clears on new file upload.
- ✅ Editing a passed line invalidates old Pass decisions for that line.
- ✅ Download Corrected TXT workflow introduced.
- ✅ Corrected output filename uses `_corrected.txt`.

### Example Workflow

```text
Errors: 34, 38, 48
↓
Line 34 displayed
↓
Edit → Save → Re-Validate
↓
If fixed, Line 38 displayed
```

If editing line 36 introduces a new invalid character:

```text
Save → Re-Validate
↓
Line 36 becomes earliest unresolved error
↓
Pass
↓
Line 38 displayed
```

### Browser Save Decision

`Save` updates the in-memory working TXT. The browser does not silently overwrite the original local/server file. Corrected content is exported through Download Corrected TXT. Permanent server/GitHub writes would require a separate secure backend.

### Future Refinements

- Preserve source CRLF/LF line endings in downloaded output.
- Add modified-line / unsaved-change tracking.
- Optional downloadable validation report.
- Complete visual verification of glassmorphic styling.

## Maintenance Dashboard

**Status:** ✅ Added

A mother/landing page now provides centralized navigation.

### 🧹 Citation Remover

Detects and removes unwanted trailing citations while preserving question structure and validating output before download.

### 🔍 Proof Reader

Detects unexpected Unicode characters, shows affected lines, supports navigation/editing, session-only Pass, re-validation and corrected TXT download.

### Dashboard Design

- ✅ Compact centered container.
- ✅ Icon + short description per tool.
- ✅ Direct Open Tool navigation.
- ✅ Animated blue gradient.
- ✅ Glassmorphic cards.
- ✅ Responsive desktop/mobile layout.
- ✅ Style aligned with Conceptual Bridge `index.html`.
- ✅ Subscribe/promotional UI removed.

## Current Maintenance File Structure

```text
maintenance/
├── maintenance.html
├── citation-remover.html
├── citation-remover.css
├── citation-remover.js
├── proof-reader.html
├── proof-reader.css
└── proof-reader.js
```

## Maintenance Engineering Decisions

1. Keep maintenance utilities isolated from Student Portal runtime logic.
2. Prefer browser-local TXT processing where server execution is unnecessary.
3. Keep each tool independently testable.
4. Use a common Maintenance Dashboard.
5. Maintain consistent glassmorphic Conceptual Bridge branding.
6. Require validation safety before processed output download.
7. Never automatically delete unexpected Proof Reader characters; corrections remain user-controlled.
8. Session-only Pass decisions must not become permanent character whitelists.
9. Permanent server/GitHub writes require a separate secure backend.

------------------------------------------------------------------------

# Immediate Next Starting Point

1. Finish and verify Proof Reader glassmorphic styling.
2. End-to-end test: Upload → Validate → Navigate → Edit → Save → Re-Validate → Pass → Download Corrected TXT.
3. Preserve original CRLF/LF line endings in corrected downloads.
4. Verify Citation Remover output formatting preservation.
5. Add new maintenance utilities only after both current tools are stable.

The Mobile Refactoring, Authentication, Developer Inspector and other existing roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated)

| Date | Milestone |
|---|---|
| 2026-07-10 | Mobile Refactoring Roadmap |
| 2026-07-14 | Developer Workspace Foundation |
| 2026-07-16 | Authentication Workspace Foundation |
| 2026-07-17 | Quiz Portal UI Enhancements |
| 2026-07-17 | Authentication Dropdown & Logout Foundation |
| 2026-07-18 | Developer Metadata Inspector Foundation |
| 2026-07-18 | Maintenance Suite / Citation Remover Foundation |
| 2026-07-19 | Citation Remover Core Completed |
| 2026-07-19 | Proof Reader Validation & Editing Workflow |
| 2026-07-19 | Maintenance Dashboard & Glassmorphic UI Direction |
| Next | Proof Reader UI Verification & End-to-End Testing |
| Next | Output / Line-Ending Preservation Hardening |
| Next | Additional Maintenance Utilities |

------------------------------------------------------------------------

# Documentation Note

This remains the single source of truth for the Conceptual Bridge project. All previous history is preserved. This update supersedes only the earlier Maintenance Suite current-status/next-step state, while retaining the historical development record.

------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-07-20)

## Current Status

**Version:** Developer Maintenance Suite v0.7 (Five-Tool Workflow / Final Merger Foundation)

This update records all maintenance work completed after the 2026-07-19 milestone. Previous project history remains preserved.

## Maintenance Dashboard

`developer/maintenance/maintenance.html` is now the central mother / entry page for all current maintenance HTML utilities:

```text
Maintenance Home
├── Citation Remover
├── Proof Reader
├── Shift Extractor
├── Answer Key Builder
└── Final Merger
```

### Dashboard Decisions

- ✅ All maintenance HTML utilities must be reachable from `maintenance.html`.
- ✅ Common Conceptual Bridge glassmorphic design retained.
- ✅ Compact cards use icons, short descriptions and direct navigation.
- ✅ Subscribe/promotional UI excluded.
- ✅ Responsive grid expanded for five tools.
- ✅ Old three-card-specific `last-child` layout behavior should be removed.
- ✅ Future maintenance HTML tools must also be registered on this mother page.

## Citation Remover

**Status:** ✅ Stable Core Workflow

Previously completed functionality remains preserved: browser-local TXT processing, citation scanning/removal, statistics, remaining-citation validation, structure integrity validation, safe download gating and glassmorphic Maintenance Suite UI.

## Proof Reader / Character Validation Engine

**Status:** ✅ Core Interactive Workflow Working

Previously completed functionality remains preserved: Unicode/unexpected-character validation, Character Validation Report, Text Editing Window, physical Previous/Next line navigation, Edit/Save lock behavior, Re-Validate, session-only Pass, corrected TXT download and glassmorphic UI.

Error navigation behavior remains:

```text
Errors: 34, 38, 48
↓
Open line 34
↓
Edit → Save → Re-Validate
↓
If fixed → line 38 becomes next unresolved error
```

If editing another physical line introduces an earlier invalid character, re-validation starts from that earliest unresolved error. Pass applies only to the current uploaded-file session.

## Shift Extractor

**Status:** ✅ Added

Purpose:

- Read TXT question assets containing `Shift|`.
- Extract/process Shift data.
- Normalize Shift formatting.
- Apply the developed AM/PM modifier handling.
- Supply standardized Shift values for later question-processing stages.

Example:

```text
Shift| 27/11/2025 9:00 AM 10:30 AM
```

becomes:

```text
Shift| 27/11/2025 9:00 AM - 10:30 AM
```

The same normalization principle is used inside Final Merger when Shift data already exists in the English file; no separate Shift file is required there.

## Answer Key Builder

**Status:** ✅ Added and Refined

Completed behavior:

- ✅ Default Total Questions = 100.
- ✅ Total Questions editable (for example 10, 20, 100).
- ✅ Initial Question Number defaults to 1 and is editable (for example 101 or 505).
- ✅ Current Question Number reflects configured initial number and progress.
- ✅ Dynamic Answer Progress, Answered, Remaining and percentage/status.
- ✅ Interactive Answer Grid.
- ✅ Clicking a question in the Answer Grid changes its visual state/color.
- ✅ Output validation before download.
- ✅ Standard downloadable answer TXT retained.
- ❌ Development-only `AnsDev.txt` output removed.

## Final Merger

**Status:** ✅ Four-File Validator / Merger Foundation Implemented

The former Difficulty Processor has been expanded into a complete final question assembly tool and renamed conceptually to **Final Merger**.

Recommended files:

```text
final-merger.html
final-merger.css
final-merger.js
```

### Four Required TXT Inputs

1. **English Question File** — filename ending in `E`, e.g. `100E.txt`; contains English `Q|`, `A|`, `B|`, `C|`, `D|` and `Shift|`.
2. **Bengali Question File** — filename ending in `B`, e.g. `100B.txt`; contains corresponding Bengali `Q|`, `A|`, `B|`, `C|`, `D|`.
3. **Answer File** — standard answer format such as `Ansopt.txt`.
4. **Difficulty Rating File** — supplies question-aligned numeric difficulty ratings.

English/Bengali files must share the same base identifier, e.g. `101E.txt` ↔ `101B.txt`.

### File Information and Validation

The interface reports English/Bengali block counts, answer count, difficulty question/value counts and expected output count.

Before merging, each question is checked for:

```text
English: Q| A| B| C| D| Shift|
Bengali: Q| A| B| C| D|
Answer: A/B/C/D
Difficulty: numeric value + question alignment
```

Validation includes:

- ✅ E/B filename pairing.
- ✅ English/Bengali block counts.
- ✅ Answer and difficulty counts.
- ✅ Required English and Bengali fields.
- ✅ Shift presence and normalization.
- ✅ Valid A/B/C/D answers.
- ✅ Numeric difficulty values.
- ✅ Difficulty question alignment against corresponding English `Q|`.
- ✅ Detailed issue report.
- ✅ Failed validation blocks final merge.

## Leading-Whitespace Comparison Rule

A false mismatch caused by a space immediately after `Q|` was fixed conceptually.

These are treated equivalently for alignment:

```text
Q|Which of the following...
Q| Which of the following...
Q|    Which of the following...
```

Leading whitespace after the prefix is ignored using the equivalent of:

```javascript
String(content || "").trimStart().substring(0, 10)
```

Internal question spacing is not intentionally removed.

## Difficulty Rating Compatibility

Final Merger must support both difficulty-source formats.

### Format A — Numbered

```text
Question 1: What is the capital of India?
Difficulty Rating: 7.25
```

### Format B — Q-Pipe

Confirmed from the latest sample:

```text
Q| Who joined as the Mission Director of Atal Innovation Mission under NITI Aayog in 2025?
Difficulty Rating: 7.88

Q| Who authored 'Careless People: A Cautionary Tale of Power, Greed, and Lost Idealism', published in 2025?
Difficulty Rating: 5.12
```

For Q-Pipe format:

- Each `Q|` starts a difficulty record.
- Question numbers are assigned sequentially by `Q|` order.
- `Difficulty Rating:` supplies the numeric value.
- The corresponding English question is still compared before accepting the rating.
- Leading whitespace after `Q|` is ignored.

Thus the parser supports both `Question N:` and `Q|` formats without weakening alignment validation.

## Shift Handling Inside Final Merger

No separate Shift file is required. Shift is read from the English question block.

Input:

```text
Shift| 27/11/2025 9:00 AM 10:30 AM
```

Normalized output:

```text
Shift| 27/11/2025 9:00 AM - 10:30 AM
```

Final Merger should keep this normalization self-contained rather than depending on another maintenance page at runtime.

## Final Merge Format

After validation passes, English and Bengali fields are combined and the final order is:

```text
Q|
A|
B|
C|
D|
Shift|
Correct|
Difficulty|
```

Example:

```text
Q|What is the capital of India? / ভারতের রাজধানী কী?
A|Delhi / দিল্লি
B|Mumbai / মুম্বাই
C|Kolkata / কলকাতা
D|Chennai / চেন্নাই
Shift| 27/11/2025 9:00 AM - 10:30 AM
Correct|A
Difficulty|7.25
```

`Difficulty|` is written immediately after `Correct|`.

Final integrity validation verifies generated block count, `Correct|` count and `Difficulty|` count before enabling download. Default output is currently `Final.txt`.

## Current Maintenance File Structure

```text
developer/
└── maintenance/
    ├── maintenance.html
    ├── citation-remover.html / .css / .js
    ├── proof-reader.html / .css / .js
    ├── shift-extractor.html / .css / .js
    ├── answer-key-builder.html / .css / .js
    └── final-merger.html / .css / .js
```

## Current End-to-End Maintenance Workflow

```text
Raw Question TXT
↓
Citation Remover
↓
Proof Reader
↓
Shift Extractor / Shift normalization where required
↓
Answer Key Builder
↓
English E.txt + Bengali B.txt + Ansopt.txt + Difficulty Rating TXT
↓
Final Merger
↓
Structural Validation
↓
Difficulty Alignment Validation
↓
Shift Normalization
↓
Bilingual Merge
↓
Correct| Injection
↓
Difficulty| Injection
↓
Final Integrity Validation
↓
Final.txt
```

## Engineering Decisions Confirmed

1. Maintenance utilities remain isolated from Student Portal runtime logic.
2. Browser-local TXT processing remains preferred where server execution is unnecessary.
3. `maintenance.html` is the single mother page for maintenance HTML utilities.
4. Each tool remains modular with its own HTML/CSS/JS.
5. Final Merger validates before generation rather than blindly combining files.
6. English/Bengali blocks are positionally paired; difficulty additionally requires English-question alignment.
7. Leading whitespace after question prefixes must not create false mismatches.
8. Shift is read directly from English blocks and normalized.
9. Difficulty parsing supports both `Question N:` and `Q|` formats.
10. `Difficulty|` is written immediately after `Correct|`.
11. Downloads remain gated behind successful validation.
12. Future maintenance HTML tools must be added to `maintenance.html`.

## Immediate Next Starting Point

1. Test Final Merger with a small 2–3 question dataset.
2. Verify both Difficulty formats (`Question N:` and `Q|`).
3. Verify real `Ansopt.txt` parsing.
4. Verify all Shift AM/PM normalization cases.
5. Verify exact bilingual output formatting.
6. Test failures: missing Bengali option, Shift, answer, difficulty, misaligned difficulty and E/B filename mismatch.
7. Test a full production-size question set only after small-set validation passes.
8. Remove obsolete CSS selectors from the old Difficulty Processor if still present.
9. Continue preserving the common glassmorphic Maintenance Suite design.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-20)

| Date | Milestone |
|---|---|
| 2026-07-10 | Mobile Refactoring Roadmap |
| 2026-07-14 | Developer Workspace Foundation |
| 2026-07-16 | Authentication Workspace Foundation |
| 2026-07-17 | Quiz Portal UI Enhancements |
| 2026-07-17 | Authentication Dropdown & Logout Foundation |
| 2026-07-18 | Developer Metadata Inspector Foundation |
| 2026-07-18 | Maintenance Suite / Citation Remover Foundation |
| 2026-07-19 | Citation Remover Core Completed |
| 2026-07-19 | Proof Reader Validation & Editing Workflow |
| 2026-07-19 | Maintenance Dashboard & Glassmorphic UI Direction |
| 2026-07-20 | Shift Extractor Added |
| 2026-07-20 | Answer Key Builder Added and Refined |
| 2026-07-20 | Maintenance Home Expanded to Five Tools |
| 2026-07-20 | Difficulty Processor Expanded into Final Merger |
| 2026-07-20 | Four-File Validation and Bilingual Merge Workflow Added |
| 2026-07-20 | Dual Difficulty Rating Format Support Defined |
| Next | Final Merger Small-Set End-to-End Testing |
| Next | Production-Size Final Merger Validation |
| Next | Maintenance Output Hardening |

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-20)

This document remains the single source of truth for the Conceptual Bridge project. All historical sections are preserved. This update supersedes only older Maintenance Suite current-status and immediate-next-step descriptions where later implementation has advanced beyond them.

Future sessions should continue appending milestones rather than deleting historical development records.

------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-07-21)

## Current Status

**Version:** Developer Maintenance Suite v0.8 (Answer Key Builder Desktop Split-Window Refactor In Progress)

This update records the latest Answer Key Builder work after the 2026-07-20 milestone. All previous project history remains preserved.

## Answer Key Builder — Updated Architecture

The Answer Key Builder is being refined as a desktop maintenance utility designed to work comfortably when the browser occupies approximately half of the desktop screen.

The earlier PDF-reference workflow has been removed from the intended architecture. The tool now works with question TXT source files and the interactive answer-entry system.

### Current Page Structure

```text
1. Session Configuration
2. Source File Uploader
3. Question Block Editor
4. Answer Selection
5. Answer Progress
6. Answer Grid
7. Output Validation
8. Processing Console

Actions:
- New Session
- Download Ansopt.txt
```

## Source File Modes

### Single Source Mode

```text
1 File — Question TXT
```

- One TXT question file.
- One full-width Question Block Editor.
- Question blocks displayed one block at a time.

### Bilingual Source Mode

```text
2 Files — English TXT + Bengali TXT
```

- English and Bengali TXT files uploaded separately.
- Question Block Editor switches to two-column split mode.
- English/Bengali blocks at the same positional index are displayed together.
- Both editors use the same shared block position.

Updated intended JavaScript mapping:

```text
sourceMode = 1 → Single TXT
sourceMode = 2 → English TXT + Bengali TXT
```

Legacy internal container IDs such as `twoFileUploader` and `threeFileUploader` may temporarily remain to avoid unnecessary regressions.

## PDF Viewer Removal

**Status:** Removed from the intended Answer Key Builder workflow; cleanup verification remains.

Removed:

- Reference PDF upload from single mode.
- Reference PDF upload from bilingual mode.
- PDF Viewer card and iframe.
- PDF zoom controls and placeholder.

Obsolete JavaScript references/functions to remove or verify absent:

```text
singlePdfInput
bilingualPdfInput
pdfViewer
pdfPlaceholder
pdfZoomInBtn
pdfZoomOutBtn
pdfZoomResetBtn
pdfZoomDisplay
currentPdfUrl
pdfZoom
handlePdfSelection()
clearPdfViewer()
changePdfZoom()
resetPdfZoom()
applyPdfZoom()
```

Obsolete CSS selectors to remove if still present:

```text
.pdf-controls
#pdfZoomDisplay
.pdf-viewer-container
.pdf-viewer
.viewer-placeholder
```

Engineering rule: PDF functionality must be removed rather than merely hidden so deleted HTML elements cannot create null-reference runtime errors.

## Question Block ↔ Answer Synchronization

Strict positional synchronization is now the design rule:

```text
Block 1 ↔ Answer Slot 1
Block 2 ↔ Answer Slot 2
Block 3 ↔ Answer Slot 3
...
```

With Initial Question No. = 1:

```text
Block 1 → Question 1 → answers[0]
Block 2 → Question 2 → answers[1]
```

With Initial Question No. = 101:

```text
Block 1 → Displayed Question 101 → answers[0]
Block 2 → Displayed Question 102 → answers[1]
```

The displayed question number does not determine the internal answer slot. Block position/index is canonical.

The following navigation paths must remain synchronized:

```text
Question Block Previous / Next
Answer Selection Previous / Next
Answer Grid click
Automatic advance after answer selection
```

Both `currentIndex` and `currentSourceBlockIndex` must represent the same positional question/block.

## Answer Selection and UI Refresh Fix

Answer capture was confirmed by Processing Console output such as:

```text
Question 1 answered: B
Question 2 answered: C
```

A UI-refresh problem was identified: answers could be stored internally while Answer Grid, Answer Progress and Output Validation remained unchanged.

After saving an answer, the workflow must call:

```javascript
updateGridItem(answeredIndex);
updateProgress();
validateOutput();
```

before automatic advancement.

A variable-name issue was also identified:

```text
Incorrect: initialQuestionNumber
Correct:   initialQuestion
```

Expected answer workflow:

```text
Select A/B/C/D
↓
Save answers[currentIndex]
↓
Update Answer Grid
↓
Update Answer Progress
↓
Update Output Validation
↓
Advance synchronized TXT block + answer question
```

## Answer Progress / Validation Expectations

After each answer:

- Answered increments.
- Remaining decrements.
- Percentage/status updates.
- Answer Grid displays the selected answer.
- Answers Selected updates.
- Missing Answers updates.
- Ansopt Entries updates.
- Validation Status recalculates.

Example after two answers in a 100-question session:

```text
Answered: 2
Remaining: 98
Status: 2% — IN PROGRESS

Answers Selected: 2
Missing Answers: 98
Ansopt Entries: 2
```

## Scroll Behavior Fix

An unwanted downward page jump was traced to normal Answer Grid highlighting using `scrollIntoView()`.

Normal answer selection must now behave as:

```text
Select Answer
↓
Save / refresh UI
↓
Advance Question + TXT Block
↓
KEEP CURRENT PAGE SCROLL POSITION
```

Automatic scrolling should occur only when all required answers have been completed:

```text
Final Answer
↓
100% Complete
↓
Validation / completion state
↓
Automatically move to Answer Grid
```

Normal per-question `scrollIntoView()` must remain removed. Completion-only scrolling may target an `answerGridSection` element.

## Half-Screen Desktop Layout

The Answer Key Builder is intentionally desktop-oriented but must work comfortably when the browser occupies approximately half a desktop display.

Design goals:

- Container approximately 900–920px maximum where appropriate.
- No forced full-monitor width.
- No horizontal page overflow.
- Compact cards and controls.
- Single TXT editor uses available width.
- Bilingual mode splits the available editor width into English/Bengali columns.
- Answer Grid adapts to constrained width.
- Desktop split-window use is prioritized over mobile optimization.

## Question Block Editor Control Visibility

A control-layout issue was identified in bilingual and narrow split-window mode.

Cause:

```css
button {
    min-width: 150px;
}
```

The global minimum width forces `Edit` and `Save` to become too wide inside each half-width editor, causing Previous/Next arrow controls to become cramped or visually hidden.

This is a **CSS issue**, not a JavaScript issue.

Target layout:

```text
| ← |     [ Edit ] [ Save ]     | → |
```

Recommended compact override in `answer-key-builder.css`:

```css
.editor-controls {
    grid-template-columns: 42px minmax(0, 1fr) 42px;
}

.editor-controls > button {
    min-width: 42px;
    width: 42px;
}

.editor-center-controls button {
    min-width: 0;
    flex: 1 1 0;
    max-width: 110px;
}
```

Optional smaller navigation glyphs:

```text
⬅ → ←
➡ → →
```

The existing HTML button structure is already suitable; only compact CSS sizing is required.

## Current Answer Key Builder File State

```text
developer/
└── maintenance/
    ├── answer-key-builder.html
    ├── answer-key-builder.css
    └── answer-key-builder.js
```

### HTML

- ✅ Sections renumbered 1–8.
- ✅ Single TXT upload retained.
- ✅ English TXT upload retained.
- ✅ Bengali TXT upload retained.
- ✅ PDF upload fields removed.
- ✅ PDF Viewer card removed.
- ✅ Single and bilingual Question Block Editor structures retained.
- ✅ Answer Selection / Progress / Grid / Validation / Console retained.
- ✅ `Ansopt.txt` download retained.

### CSS

- ✅ Glassmorphic Conceptual Bridge theme retained.
- ✅ Half-screen desktop overrides introduced.
- ✅ Single/bilingual editor layouts exist.
- 🟡 Compact editor-control override needs final application/verification.
- 🟡 Obsolete PDF Viewer CSS should be removed if still present.
- 🟡 Duplicate/older CSS rules can be consolidated only after functional testing.

### JavaScript

- ✅ TXT parsing/loading foundation retained.
- ✅ Single and bilingual source loading retained.
- ✅ Positional block/question synchronization established conceptually.
- ✅ Answer capture confirmed.
- ✅ Grid/progress/validation refresh requirements corrected.
- ✅ Normal answer-selection auto-scroll removed in intended latest behavior.
- ✅ Completion-only Answer Grid scroll introduced.
- 🟡 Verify every old `sourceMode === 2/3` assumption uses the new `1/2` mapping.
- 🟡 Verify all obsolete PDF DOM references/functions are removed.
- 🟡 Full regression testing remains required.

## Immediate Testing Checklist

1. Load one TXT file in Single Source mode.
2. Confirm Block 1 displays correctly.
3. Run a 5–10 question test session.
4. Verify each selected answer updates Grid, Progress and Validation.
5. Verify block/question auto-advance remains synchronized.
6. Confirm page does not jump downward after each answer.
7. Click Answer Grid items and confirm the matching source block opens.
8. Test Previous/Next from Question Block Editor and Answer Selection.
9. Test Edit → Save without damaging hidden block metadata.
10. Complete all answers and verify automatic movement to Answer Grid occurs only at completion.
11. Test bilingual mode with matching E/B files.
12. Verify English/Bengali editor controls remain visible in half-screen mode.
13. Confirm browser console has no errors referencing removed PDF elements.
14. Confirm `Ansopt.txt` is enabled only after successful validation.

## Engineering Decisions Confirmed

1. Answer Key Builder is a desktop maintenance utility optimized for split-window use.
2. PDF reference/viewer functionality is removed from the architecture.
3. Source input is either one TXT or paired English/Bengali TXT files.
4. Block position is the canonical link between source questions and answer slots.
5. Initial Question Number changes displayed numbering, not positional answer mapping.
6. All navigation mechanisms must synchronize block and answer indices.
7. Selecting an answer must refresh Grid, Progress and Validation before advancing.
8. Normal answer selection must not move the browser page.
9. Automatic movement to Answer Grid occurs only after all answers are completed.
10. Editor controls must override the global 150px button minimum in constrained layouts.
11. Student Portal/runtime logic must remain unaffected.
12. Functional verification comes before CSS consolidation or legacy-ID renaming.

------------------------------------------------------------------------

# Immediate Next Starting Point (Updated: 2026-07-21)

Continue **Answer Key Builder stabilization**:

1. Apply and verify compact Question Block Editor control CSS.
2. Remove obsolete PDF Viewer CSS.
3. Verify JavaScript contains no remaining PDF references.
4. Verify source-mode mapping:
   - `1 = Single TXT`
   - `2 = English + Bengali`
5. Run small Single TXT end-to-end test.
6. Run small bilingual E/B end-to-end test.
7. Verify no page jump during normal answer selection.
8. Verify completion-only automatic scroll to Answer Grid.
9. Verify final `Ansopt.txt` generation and validation.
10. Consolidate duplicate/obsolete CSS only after stabilization.

The Mobile Refactoring, Authentication, Developer Inspector, Final Merger and wider Maintenance Suite roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-21)

| Date | Milestone |
|---|---|
| 2026-07-10 | Mobile Refactoring Roadmap |
| 2026-07-14 | Developer Workspace Foundation |
| 2026-07-16 | Authentication Workspace Foundation |
| 2026-07-17 | Quiz Portal UI Enhancements |
| 2026-07-17 | Authentication Dropdown & Logout Foundation |
| 2026-07-18 | Developer Metadata Inspector Foundation |
| 2026-07-18 | Maintenance Suite / Citation Remover Foundation |
| 2026-07-19 | Citation Remover Core Completed |
| 2026-07-19 | Proof Reader Validation & Editing Workflow |
| 2026-07-19 | Maintenance Dashboard & Glassmorphic UI Direction |
| 2026-07-20 | Shift Extractor Added |
| 2026-07-20 | Answer Key Builder Added and Refined |
| 2026-07-20 | Maintenance Home Expanded to Five Tools |
| 2026-07-20 | Final Merger Four-File Workflow |
| 2026-07-21 | Answer Key Builder TXT-Only Refactor |
| 2026-07-21 | PDF Viewer Removed from Answer Key Builder Architecture |
| 2026-07-21 | Block ↔ Answer Positional Synchronization Refined |
| 2026-07-21 | Half-Screen Desktop Layout and Scroll Behavior Refined |
| Next | Answer Key Builder End-to-End Regression Testing |
| Next | Final Merger Production Validation |
| Next | Maintenance Suite Output Hardening |

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-21)

This document remains the single source of truth for the Conceptual Bridge project.

All historical sections are preserved. This update supersedes only older descriptions of the current Answer Key Builder architecture where the PDF-based design and earlier file-count workflow are no longer applicable.

Future sessions should continue preserving historical milestones and appending new progress updates rather than replacing earlier project history.


------------------------------------------------------------------------

# Free Tutorial Corner Progress Update (Added: 2026-07-22)

## Current Status

**Version:** Free Tutorial Corner v0.2 (Multi-Tutorial Loading / Study-Practice UI Foundation)

This update records the latest work on the Free Tutorial Corner. All previous project history remains preserved.

## Tutorial Loading Architecture

The current `tutorials.html` loads tutorial metadata from numbered TXT files inside the `Video/` directory.

Current configured loader:

```javascript
const uploadedVideoFiles = [1,2,3,4,5,6];
```

For every configured number, the page attempts to load the corresponding `Video/{number}.txt`.

The loading loop already safely handles missing files using:

```javascript
if (!response.ok) continue;
```

Therefore, a configured tutorial number whose TXT file does not yet exist is skipped rather than rendered.

### Confirmed Behavior

```text
Configured: [1,2,3,4,5,6]

Video/1.txt exists → Load
Video/2.txt exists → Load
Video/3.txt missing → Skip
Video/4.txt missing → Skip
...
```

A missing tutorial TXT file must not stop successfully available tutorial files from loading.

## Tutorial Metadata Flow

```text
tutorials.html
↓
Video/{number}.txt
↓
parseTextFileData()
↓
Tutorial Table Row
├── Video Title
├── Attribute Tags
├── ENG / BEN selector where applicable
├── Play Video
├── Download PDF
└── Take 10Q Test
```

Tutorial TXT metadata maps the corresponding tutorial test through `Test_Source| questions/<subject>/<file>.txt`.

The existing `compileMiniTest()` routing remains:

```text
Tutorial TXT → Test_Source → quiz-portal.html?source=<encoded question path>
```

The Student Quiz Portal architecture remains unaffected.

## Missing-File Engineering Decision

It is acceptable to configure future numbered tutorial slots before all corresponding TXT files are ready, provided the current safe-skip behavior remains in place.

```text
Existing TXT → Parse and display
Missing TXT → Skip safely
Malformed existing TXT → Log/debug separately
```

A future optimization may replace numbered probing with an API that returns only existing tutorial metadata files. This is deferred.

## Download PDF Action Expansion

Two compact secondary controls are being introduced directly below **Download PDF**:

```text
Download PDF
[ Study ] [ Practice ]
```

### Study Button

**Status:** UI Foundation / Function Pending

- Small pill-style control.
- Positioned below Download PDF.
- Styled consistently with the compact ENG/BEN controls.
- No final action or routing assigned yet.

### Practice Button

**Status:** UI Foundation / Function Pending

- Small pill-style control.
- Positioned beside Study.
- Styled consistently with the compact ENG/BEN controls.
- No final action or routing assigned yet.

### Current Design Rule

Study and Practice remain UI-only placeholders until their exact behavior is defined.

Existing functionality must remain unchanged:

- ENG / BEN language switching
- Play Video
- Download PDF
- Take 10Q Test
- Tutorial TXT parsing
- `Test_Source` routing

## Tutorial Corner Current File

```text
tutorials.html
```

Relevant JavaScript components:

```text
uploadedVideoFiles
cachedLoadedData
openSubjectFolder()
generateStudioTableLayout()
parseTextFileData()
switchRowLanguageContext()
compileMiniTest()
```

## Engineering Decisions Confirmed

1. Tutorial metadata remains TXT-driven.
2. Numbered tutorial files may be configured ahead of content availability.
3. Missing TXT files must be skipped safely.
4. Existing tutorial rows must continue loading when later numbered files are absent.
5. Study and Practice are compact secondary PDF-area actions.
6. Their behavior will be implemented only after functional requirements are defined.
7. Existing ENG/BEN, video, PDF and 10Q Test behavior must remain untouched.
8. Student Quiz Portal/runtime logic must remain unaffected.
9. Automatic tutorial-file discovery/API remains a future optimization.

------------------------------------------------------------------------

# Immediate Next Starting Point (Updated: 2026-07-22)

1. Verify Study and Practice buttons render correctly below Download PDF.
2. Confirm compact layout at current desktop/table widths.
3. Define the exact Study function.
4. Implement and test Study independently.
5. Define the exact Practice function.
6. Implement and test Practice independently.
7. Verify tutorial loading with mixed existing/missing numbered `Video/*.txt` files.
8. Consider automatic tutorial-file discovery/API only after the current workflow is stable.
9. Continue Answer Key Builder regression testing and Final Merger validation as previously planned.

The Mobile Refactoring, Authentication, Developer Inspector, Maintenance Suite, Answer Key Builder and Final Merger roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-22)

| Date | Milestone |
|---|---|
| 2026-07-10 | Mobile Refactoring Roadmap |
| 2026-07-14 | Developer Workspace Foundation |
| 2026-07-16 | Authentication Workspace Foundation |
| 2026-07-17 | Quiz Portal UI Enhancements |
| 2026-07-17 | Authentication Dropdown & Logout Foundation |
| 2026-07-18 | Developer Metadata Inspector Foundation |
| 2026-07-18 | Maintenance Suite / Citation Remover Foundation |
| 2026-07-19 | Citation Remover Core Completed |
| 2026-07-19 | Proof Reader Validation & Editing Workflow |
| 2026-07-19 | Maintenance Dashboard & Glassmorphic UI Direction |
| 2026-07-20 | Shift Extractor Added |
| 2026-07-20 | Answer Key Builder Added and Refined |
| 2026-07-20 | Final Merger Four-File Workflow |
| 2026-07-21 | Answer Key Builder TXT-Only Refactor |
| 2026-07-21 | Block ↔ Answer Positional Synchronization Refined |
| 2026-07-22 | Free Tutorial Corner Multi-Tutorial Loading Reviewed |
| 2026-07-22 | Missing Tutorial TXT Safe-Skip Behavior Confirmed |
| 2026-07-22 | Study / Practice Compact Button UI Foundation |
| Next | Define and Implement Study Function |
| Next | Define and Implement Practice Function |
| Next | Answer Key Builder End-to-End Regression Testing |
| Next | Final Merger Production Validation |

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-22)

This document remains the single source of truth for the Conceptual Bridge project.

All previous project history has been preserved. This update appends the latest Free Tutorial Corner architecture, multi-file loading behavior, missing-file handling decision, and Study/Practice UI foundation without replacing earlier milestones.

Future development sessions should continue appending progress updates while preserving the historical record.
