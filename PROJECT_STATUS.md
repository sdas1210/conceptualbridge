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

