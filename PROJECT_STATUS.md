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

**Version:** Developer Maintenance Suite v0.4 (Citation Remover Complete
/ Proof Reader Core Complete / Maintenance Dashboard Added)

This session substantially advanced the isolated browser-based
maintenance workspace. The earlier Citation Removal Engine foundation
was completed, a new Proof Reader / Character Validation Engine was
created, and a common Maintenance Suite landing page was introduced.

## Maintenance Architecture

Current structure:

``` text
Maintenance Dashboard
├── Citation Removal Engine
└── Proof Reader / Character Validation Engine
```

Each utility remains modular with its own HTML, CSS and JavaScript.
Browser-local TXT processing remains preferred so the Student Portal and
shared quiz runtime are unaffected.

### UI Design Direction

-   ✅ Maintenance landing page introduced.
-   ✅ Compact tool cards with icons and short descriptions.
-   ✅ Visual language aligned with the main Conceptual Bridge
    `index.html`.
-   ✅ Animated blue gradient and glassmorphic cards/controls adopted.
-   ✅ Subscribe/promotional elements excluded from Developer
    Maintenance.
-   ✅ Individual tools use `← Maintenance Home` navigation.
-   ✅ Citation Remover converted to glassmorphic theme.
-   🟡 Proof Reader glassmorphic conversion prepared / being applied.

Implementation rule: HTML, CSS and JavaScript must remain in their
correct files. CSS must not be pasted after `</html>` or into
JavaScript, as this can cause syntax errors such as
`Unexpected token '*'`.

## Citation Removal Engine

**Status:** ✅ Core Workflow Complete and Tested

### Completed

-   ✅ TXT upload and local file reading.
-   ✅ File name, size and total-line metadata.
-   ✅ Sequential line scanning and Processing Console progress.
-   ✅ Citation detection/removal logic implemented.
-   ✅ `cleanedText` generated.
-   ✅ Lines Scanned and Citations Removed counters.
-   ✅ Tested example successfully removed 600 citations.
-   ✅ Remaining-citation integrity check.
-   ✅ Question-structure integrity check.
-   ✅ Download safety gate.
-   ✅ Download Output activates only after successful validation.
-   ✅ Cleaned TXT browser download.
-   ✅ New file upload resets previous processing/download state.
-   ✅ Glassmorphic UI and Maintenance Home navigation.

### Validation Safety Flow

``` text
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

-   Preserve original filename automatically.
-   Preserve original CRLF/LF line endings.
-   Harden whitespace preservation so only intended citation text
    changes.

## Proof Reader / Character Validation Engine

**Status:** ✅ Core Workflow Implemented

A browser-based interactive Proof Reader was created from the existing
Python proof-reading concept.

### Purpose

Scan English/Bengali question TXT assets for unexpected Unicode
characters and provide an interactive line editor for correction.

### Completed

-   ✅ TXT upload and file information.
-   ✅ Processing Console and Validation Statistics.
-   ✅ Character Validation Report.
-   ✅ Text Editing Window.
-   ✅ JavaScript character validator for English, Bengali, numbers,
    whitespace, standard punctuation and selected typographic
    punctuation.
-   ✅ Invalid-character and affected-line counting.
-   ✅ PASSED / FAILED validation state.
-   ✅ Unicode code point and affected line/context reporting.
-   ✅ First unresolved error automatically displayed.
-   ✅ Physical line-by-line Previous/Next navigation.
-   ✅ Edit/Save workflow with navigation lock while editing.
-   ✅ Saved edits stored in in-memory `workingLines`.
-   ✅ Re-Validate scans edited working content.
-   ✅ New earlier errors become the next displayed error.
-   ✅ Session-only Pass system.
-   ✅ Pass scoped by line number + invalid character.
-   ✅ Passed errors excluded from later validation in the same
    uploaded-file session.
-   ✅ Pass state clears on new file upload.
-   ✅ Editing a passed line invalidates old Pass decisions for that
    line.
-   ✅ Download Corrected TXT workflow introduced.
-   ✅ Corrected output filename uses `_corrected.txt`.

### Example Workflow

``` text
Errors: 34, 38, 48
↓
Line 34 displayed
↓
Edit → Save → Re-Validate
↓
If fixed, Line 38 displayed
```

If editing line 36 introduces a new invalid character:

``` text
Save → Re-Validate
↓
Line 36 becomes earliest unresolved error
↓
Pass
↓
Line 38 displayed
```

### Browser Save Decision

`Save` updates the in-memory working TXT. The browser does not silently
overwrite the original local/server file. Corrected content is exported
through Download Corrected TXT. Permanent server/GitHub writes would
require a separate secure backend.

### Future Refinements

-   Preserve source CRLF/LF line endings in downloaded output.
-   Add modified-line / unsaved-change tracking.
-   Optional downloadable validation report.
-   Complete visual verification of glassmorphic styling.

## Maintenance Dashboard

**Status:** ✅ Added

A mother/landing page now provides centralized navigation.

### 🧹 Citation Remover

Detects and removes unwanted trailing citations while preserving
question structure and validating output before download.

### 🔍 Proof Reader

Detects unexpected Unicode characters, shows affected lines, supports
navigation/editing, session-only Pass, re-validation and corrected TXT
download.

### Dashboard Design

-   ✅ Compact centered container.
-   ✅ Icon + short description per tool.
-   ✅ Direct Open Tool navigation.
-   ✅ Animated blue gradient.
-   ✅ Glassmorphic cards.
-   ✅ Responsive desktop/mobile layout.
-   ✅ Style aligned with Conceptual Bridge `index.html`.
-   ✅ Subscribe/promotional UI removed.

## Current Maintenance File Structure

``` text
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

1.  Keep maintenance utilities isolated from Student Portal runtime
    logic.
2.  Prefer browser-local TXT processing where server execution is
    unnecessary.
3.  Keep each tool independently testable.
4.  Use a common Maintenance Dashboard.
5.  Maintain consistent glassmorphic Conceptual Bridge branding.
6.  Require validation safety before processed output download.
7.  Never automatically delete unexpected Proof Reader characters;
    corrections remain user-controlled.
8.  Session-only Pass decisions must not become permanent character
    whitelists.
9.  Permanent server/GitHub writes require a separate secure backend.

------------------------------------------------------------------------

# Immediate Next Starting Point

1.  Finish and verify Proof Reader glassmorphic styling.
2.  End-to-end test: Upload → Validate → Navigate → Edit → Save →
    Re-Validate → Pass → Download Corrected TXT.
3.  Preserve original CRLF/LF line endings in corrected downloads.
4.  Verify Citation Remover output formatting preservation.
5.  Add new maintenance utilities only after both current tools are
    stable.

The Mobile Refactoring, Authentication, Developer Inspector and other
existing roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated)

  Date         Milestone
  ------------ ---------------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  2026-07-18   Developer Metadata Inspector Foundation
  2026-07-18   Maintenance Suite / Citation Remover Foundation
  2026-07-19   Citation Remover Core Completed
  2026-07-19   Proof Reader Validation & Editing Workflow
  2026-07-19   Maintenance Dashboard & Glassmorphic UI Direction
  Next         Proof Reader UI Verification & End-to-End Testing
  Next         Output / Line-Ending Preservation Hardening
  Next         Additional Maintenance Utilities

------------------------------------------------------------------------

# Documentation Note

This remains the single source of truth for the Conceptual Bridge
project. All previous history is preserved. This update supersedes only
the earlier Maintenance Suite current-status/next-step state, while
retaining the historical development record.

------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-07-20)

## Current Status

**Version:** Developer Maintenance Suite v0.7 (Five-Tool Workflow /
Final Merger Foundation)

This update records all maintenance work completed after the 2026-07-19
milestone. Previous project history remains preserved.

## Maintenance Dashboard

`developer/maintenance/maintenance.html` is now the central mother /
entry page for all current maintenance HTML utilities:

``` text
Maintenance Home
├── Citation Remover
├── Proof Reader
├── Shift Extractor
├── Answer Key Builder
└── Final Merger
```

### Dashboard Decisions

-   ✅ All maintenance HTML utilities must be reachable from
    `maintenance.html`.
-   ✅ Common Conceptual Bridge glassmorphic design retained.
-   ✅ Compact cards use icons, short descriptions and direct
    navigation.
-   ✅ Subscribe/promotional UI excluded.
-   ✅ Responsive grid expanded for five tools.
-   ✅ Old three-card-specific `last-child` layout behavior should be
    removed.
-   ✅ Future maintenance HTML tools must also be registered on this
    mother page.

## Citation Remover

**Status:** ✅ Stable Core Workflow

Previously completed functionality remains preserved: browser-local TXT
processing, citation scanning/removal, statistics, remaining-citation
validation, structure integrity validation, safe download gating and
glassmorphic Maintenance Suite UI.

## Proof Reader / Character Validation Engine

**Status:** ✅ Core Interactive Workflow Working

Previously completed functionality remains preserved:
Unicode/unexpected-character validation, Character Validation Report,
Text Editing Window, physical Previous/Next line navigation, Edit/Save
lock behavior, Re-Validate, session-only Pass, corrected TXT download
and glassmorphic UI.

Error navigation behavior remains:

``` text
Errors: 34, 38, 48
↓
Open line 34
↓
Edit → Save → Re-Validate
↓
If fixed → line 38 becomes next unresolved error
```

If editing another physical line introduces an earlier invalid
character, re-validation starts from that earliest unresolved error.
Pass applies only to the current uploaded-file session.

## Shift Extractor

**Status:** ✅ Added

Purpose:

-   Read TXT question assets containing `Shift|`.
-   Extract/process Shift data.
-   Normalize Shift formatting.
-   Apply the developed AM/PM modifier handling.
-   Supply standardized Shift values for later question-processing
    stages.

Example:

``` text
Shift| 27/11/2025 9:00 AM 10:30 AM
```

becomes:

``` text
Shift| 27/11/2025 9:00 AM - 10:30 AM
```

The same normalization principle is used inside Final Merger when Shift
data already exists in the English file; no separate Shift file is
required there.

## Answer Key Builder

**Status:** ✅ Added and Refined

Completed behavior:

-   ✅ Default Total Questions = 100.
-   ✅ Total Questions editable (for example 10, 20, 100).
-   ✅ Initial Question Number defaults to 1 and is editable (for
    example 101 or 505).
-   ✅ Current Question Number reflects configured initial number and
    progress.
-   ✅ Dynamic Answer Progress, Answered, Remaining and
    percentage/status.
-   ✅ Interactive Answer Grid.
-   ✅ Clicking a question in the Answer Grid changes its visual
    state/color.
-   ✅ Output validation before download.
-   ✅ Standard downloadable answer TXT retained.
-   ❌ Development-only `AnsDev.txt` output removed.

## Final Merger

**Status:** ✅ Four-File Validator / Merger Foundation Implemented

The former Difficulty Processor has been expanded into a complete final
question assembly tool and renamed conceptually to **Final Merger**.

Recommended files:

``` text
final-merger.html
final-merger.css
final-merger.js
```

### Four Required TXT Inputs

1.  **English Question File** --- filename ending in `E`,
    e.g. `100E.txt`; contains English `Q|`, `A|`, `B|`, `C|`, `D|` and
    `Shift|`.
2.  **Bengali Question File** --- filename ending in `B`,
    e.g. `100B.txt`; contains corresponding Bengali `Q|`, `A|`, `B|`,
    `C|`, `D|`.
3.  **Answer File** --- standard answer format such as `Ansopt.txt`.
4.  **Difficulty Rating File** --- supplies question-aligned numeric
    difficulty ratings.

English/Bengali files must share the same base identifier,
e.g. `101E.txt` ↔ `101B.txt`.

### File Information and Validation

The interface reports English/Bengali block counts, answer count,
difficulty question/value counts and expected output count.

Before merging, each question is checked for:

``` text
English: Q| A| B| C| D| Shift|
Bengali: Q| A| B| C| D|
Answer: A/B/C/D
Difficulty: numeric value + question alignment
```

Validation includes:

-   ✅ E/B filename pairing.
-   ✅ English/Bengali block counts.
-   ✅ Answer and difficulty counts.
-   ✅ Required English and Bengali fields.
-   ✅ Shift presence and normalization.
-   ✅ Valid A/B/C/D answers.
-   ✅ Numeric difficulty values.
-   ✅ Difficulty question alignment against corresponding English `Q|`.
-   ✅ Detailed issue report.
-   ✅ Failed validation blocks final merge.

## Leading-Whitespace Comparison Rule

A false mismatch caused by a space immediately after `Q|` was fixed
conceptually.

These are treated equivalently for alignment:

``` text
Q|Which of the following...
Q| Which of the following...
Q|    Which of the following...
```

Leading whitespace after the prefix is ignored using the equivalent of:

``` javascript
String(content || "").trimStart().substring(0, 10)
```

Internal question spacing is not intentionally removed.

## Difficulty Rating Compatibility

Final Merger must support both difficulty-source formats.

### Format A --- Numbered

``` text
Question 1: What is the capital of India?
Difficulty Rating: 7.25
```

### Format B --- Q-Pipe

Confirmed from the latest sample:

``` text
Q| Who joined as the Mission Director of Atal Innovation Mission under NITI Aayog in 2025?
Difficulty Rating: 7.88

Q| Who authored 'Careless People: A Cautionary Tale of Power, Greed, and Lost Idealism', published in 2025?
Difficulty Rating: 5.12
```

For Q-Pipe format:

-   Each `Q|` starts a difficulty record.
-   Question numbers are assigned sequentially by `Q|` order.
-   `Difficulty Rating:` supplies the numeric value.
-   The corresponding English question is still compared before
    accepting the rating.
-   Leading whitespace after `Q|` is ignored.

Thus the parser supports both `Question N:` and `Q|` formats without
weakening alignment validation.

## Shift Handling Inside Final Merger

No separate Shift file is required. Shift is read from the English
question block.

Input:

``` text
Shift| 27/11/2025 9:00 AM 10:30 AM
```

Normalized output:

``` text
Shift| 27/11/2025 9:00 AM - 10:30 AM
```

Final Merger should keep this normalization self-contained rather than
depending on another maintenance page at runtime.

## Final Merge Format

After validation passes, English and Bengali fields are combined and the
final order is:

``` text
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

``` text
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

Final integrity validation verifies generated block count, `Correct|`
count and `Difficulty|` count before enabling download. Default output
is currently `Final.txt`.

## Current Maintenance File Structure

``` text
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

``` text
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

1.  Maintenance utilities remain isolated from Student Portal runtime
    logic.
2.  Browser-local TXT processing remains preferred where server
    execution is unnecessary.
3.  `maintenance.html` is the single mother page for maintenance HTML
    utilities.
4.  Each tool remains modular with its own HTML/CSS/JS.
5.  Final Merger validates before generation rather than blindly
    combining files.
6.  English/Bengali blocks are positionally paired; difficulty
    additionally requires English-question alignment.
7.  Leading whitespace after question prefixes must not create false
    mismatches.
8.  Shift is read directly from English blocks and normalized.
9.  Difficulty parsing supports both `Question N:` and `Q|` formats.
10. `Difficulty|` is written immediately after `Correct|`.
11. Downloads remain gated behind successful validation.
12. Future maintenance HTML tools must be added to `maintenance.html`.

## Immediate Next Starting Point

1.  Test Final Merger with a small 2--3 question dataset.
2.  Verify both Difficulty formats (`Question N:` and `Q|`).
3.  Verify real `Ansopt.txt` parsing.
4.  Verify all Shift AM/PM normalization cases.
5.  Verify exact bilingual output formatting.
6.  Test failures: missing Bengali option, Shift, answer, difficulty,
    misaligned difficulty and E/B filename mismatch.
7.  Test a full production-size question set only after small-set
    validation passes.
8.  Remove obsolete CSS selectors from the old Difficulty Processor if
    still present.
9.  Continue preserving the common glassmorphic Maintenance Suite
    design.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-20)

  Date         Milestone
  ------------ ---------------------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  2026-07-18   Developer Metadata Inspector Foundation
  2026-07-18   Maintenance Suite / Citation Remover Foundation
  2026-07-19   Citation Remover Core Completed
  2026-07-19   Proof Reader Validation & Editing Workflow
  2026-07-19   Maintenance Dashboard & Glassmorphic UI Direction
  2026-07-20   Shift Extractor Added
  2026-07-20   Answer Key Builder Added and Refined
  2026-07-20   Maintenance Home Expanded to Five Tools
  2026-07-20   Difficulty Processor Expanded into Final Merger
  2026-07-20   Four-File Validation and Bilingual Merge Workflow Added
  2026-07-20   Dual Difficulty Rating Format Support Defined
  Next         Final Merger Small-Set End-to-End Testing
  Next         Production-Size Final Merger Validation
  Next         Maintenance Output Hardening

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-20)

This document remains the single source of truth for the Conceptual
Bridge project. All historical sections are preserved. This update
supersedes only older Maintenance Suite current-status and
immediate-next-step descriptions where later implementation has advanced
beyond them.

Future sessions should continue appending milestones rather than
deleting historical development records.

------------------------------------------------------------------------

# Developer Maintenance Suite Progress Update (Added: 2026-07-21)

## Current Status

**Version:** Developer Maintenance Suite v0.8 (Answer Key Builder
Desktop Split-Window Refactor In Progress)

This update records the latest Answer Key Builder work after the
2026-07-20 milestone. All previous project history remains preserved.

## Answer Key Builder --- Updated Architecture

The Answer Key Builder is being refined as a desktop maintenance utility
designed to work comfortably when the browser occupies approximately
half of the desktop screen.

The earlier PDF-reference workflow has been removed from the intended
architecture. The tool now works with question TXT source files and the
interactive answer-entry system.

### Current Page Structure

``` text
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

``` text
1 File — Question TXT
```

-   One TXT question file.
-   One full-width Question Block Editor.
-   Question blocks displayed one block at a time.

### Bilingual Source Mode

``` text
2 Files — English TXT + Bengali TXT
```

-   English and Bengali TXT files uploaded separately.
-   Question Block Editor switches to two-column split mode.
-   English/Bengali blocks at the same positional index are displayed
    together.
-   Both editors use the same shared block position.

Updated intended JavaScript mapping:

``` text
sourceMode = 1 → Single TXT
sourceMode = 2 → English TXT + Bengali TXT
```

Legacy internal container IDs such as `twoFileUploader` and
`threeFileUploader` may temporarily remain to avoid unnecessary
regressions.

## PDF Viewer Removal

**Status:** Removed from the intended Answer Key Builder workflow;
cleanup verification remains.

Removed:

-   Reference PDF upload from single mode.
-   Reference PDF upload from bilingual mode.
-   PDF Viewer card and iframe.
-   PDF zoom controls and placeholder.

Obsolete JavaScript references/functions to remove or verify absent:

``` text
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

``` text
.pdf-controls
#pdfZoomDisplay
.pdf-viewer-container
.pdf-viewer
.viewer-placeholder
```

Engineering rule: PDF functionality must be removed rather than merely
hidden so deleted HTML elements cannot create null-reference runtime
errors.

## Question Block ↔ Answer Synchronization

Strict positional synchronization is now the design rule:

``` text
Block 1 ↔ Answer Slot 1
Block 2 ↔ Answer Slot 2
Block 3 ↔ Answer Slot 3
...
```

With Initial Question No. = 1:

``` text
Block 1 → Question 1 → answers[0]
Block 2 → Question 2 → answers[1]
```

With Initial Question No. = 101:

``` text
Block 1 → Displayed Question 101 → answers[0]
Block 2 → Displayed Question 102 → answers[1]
```

The displayed question number does not determine the internal answer
slot. Block position/index is canonical.

The following navigation paths must remain synchronized:

``` text
Question Block Previous / Next
Answer Selection Previous / Next
Answer Grid click
Automatic advance after answer selection
```

Both `currentIndex` and `currentSourceBlockIndex` must represent the
same positional question/block.

## Answer Selection and UI Refresh Fix

Answer capture was confirmed by Processing Console output such as:

``` text
Question 1 answered: B
Question 2 answered: C
```

A UI-refresh problem was identified: answers could be stored internally
while Answer Grid, Answer Progress and Output Validation remained
unchanged.

After saving an answer, the workflow must call:

``` javascript
updateGridItem(answeredIndex);
updateProgress();
validateOutput();
```

before automatic advancement.

A variable-name issue was also identified:

``` text
Incorrect: initialQuestionNumber
Correct:   initialQuestion
```

Expected answer workflow:

``` text
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

-   Answered increments.
-   Remaining decrements.
-   Percentage/status updates.
-   Answer Grid displays the selected answer.
-   Answers Selected updates.
-   Missing Answers updates.
-   Ansopt Entries updates.
-   Validation Status recalculates.

Example after two answers in a 100-question session:

``` text
Answered: 2
Remaining: 98
Status: 2% — IN PROGRESS

Answers Selected: 2
Missing Answers: 98
Ansopt Entries: 2
```

## Scroll Behavior Fix

An unwanted downward page jump was traced to normal Answer Grid
highlighting using `scrollIntoView()`.

Normal answer selection must now behave as:

``` text
Select Answer
↓
Save / refresh UI
↓
Advance Question + TXT Block
↓
KEEP CURRENT PAGE SCROLL POSITION
```

Automatic scrolling should occur only when all required answers have
been completed:

``` text
Final Answer
↓
100% Complete
↓
Validation / completion state
↓
Automatically move to Answer Grid
```

Normal per-question `scrollIntoView()` must remain removed.
Completion-only scrolling may target an `answerGridSection` element.

## Half-Screen Desktop Layout

The Answer Key Builder is intentionally desktop-oriented but must work
comfortably when the browser occupies approximately half a desktop
display.

Design goals:

-   Container approximately 900--920px maximum where appropriate.
-   No forced full-monitor width.
-   No horizontal page overflow.
-   Compact cards and controls.
-   Single TXT editor uses available width.
-   Bilingual mode splits the available editor width into
    English/Bengali columns.
-   Answer Grid adapts to constrained width.
-   Desktop split-window use is prioritized over mobile optimization.

## Question Block Editor Control Visibility

A control-layout issue was identified in bilingual and narrow
split-window mode.

Cause:

``` css
button {
    min-width: 150px;
}
```

The global minimum width forces `Edit` and `Save` to become too wide
inside each half-width editor, causing Previous/Next arrow controls to
become cramped or visually hidden.

This is a **CSS issue**, not a JavaScript issue.

Target layout:

``` text
| ← |     [ Edit ] [ Save ]     | → |
```

Recommended compact override in `answer-key-builder.css`:

``` css
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

``` text
⬅ → ←
➡ → →
```

The existing HTML button structure is already suitable; only compact CSS
sizing is required.

## Current Answer Key Builder File State

``` text
developer/
└── maintenance/
    ├── answer-key-builder.html
    ├── answer-key-builder.css
    └── answer-key-builder.js
```

### HTML

-   ✅ Sections renumbered 1--8.
-   ✅ Single TXT upload retained.
-   ✅ English TXT upload retained.
-   ✅ Bengali TXT upload retained.
-   ✅ PDF upload fields removed.
-   ✅ PDF Viewer card removed.
-   ✅ Single and bilingual Question Block Editor structures retained.
-   ✅ Answer Selection / Progress / Grid / Validation / Console
    retained.
-   ✅ `Ansopt.txt` download retained.

### CSS

-   ✅ Glassmorphic Conceptual Bridge theme retained.
-   ✅ Half-screen desktop overrides introduced.
-   ✅ Single/bilingual editor layouts exist.
-   🟡 Compact editor-control override needs final
    application/verification.
-   🟡 Obsolete PDF Viewer CSS should be removed if still present.
-   🟡 Duplicate/older CSS rules can be consolidated only after
    functional testing.

### JavaScript

-   ✅ TXT parsing/loading foundation retained.
-   ✅ Single and bilingual source loading retained.
-   ✅ Positional block/question synchronization established
    conceptually.
-   ✅ Answer capture confirmed.
-   ✅ Grid/progress/validation refresh requirements corrected.
-   ✅ Normal answer-selection auto-scroll removed in intended latest
    behavior.
-   ✅ Completion-only Answer Grid scroll introduced.
-   🟡 Verify every old `sourceMode === 2/3` assumption uses the new
    `1/2` mapping.
-   🟡 Verify all obsolete PDF DOM references/functions are removed.
-   🟡 Full regression testing remains required.

## Immediate Testing Checklist

1.  Load one TXT file in Single Source mode.
2.  Confirm Block 1 displays correctly.
3.  Run a 5--10 question test session.
4.  Verify each selected answer updates Grid, Progress and Validation.
5.  Verify block/question auto-advance remains synchronized.
6.  Confirm page does not jump downward after each answer.
7.  Click Answer Grid items and confirm the matching source block opens.
8.  Test Previous/Next from Question Block Editor and Answer Selection.
9.  Test Edit → Save without damaging hidden block metadata.
10. Complete all answers and verify automatic movement to Answer Grid
    occurs only at completion.
11. Test bilingual mode with matching E/B files.
12. Verify English/Bengali editor controls remain visible in half-screen
    mode.
13. Confirm browser console has no errors referencing removed PDF
    elements.
14. Confirm `Ansopt.txt` is enabled only after successful validation.

## Engineering Decisions Confirmed

1.  Answer Key Builder is a desktop maintenance utility optimized for
    split-window use.
2.  PDF reference/viewer functionality is removed from the architecture.
3.  Source input is either one TXT or paired English/Bengali TXT files.
4.  Block position is the canonical link between source questions and
    answer slots.
5.  Initial Question Number changes displayed numbering, not positional
    answer mapping.
6.  All navigation mechanisms must synchronize block and answer indices.
7.  Selecting an answer must refresh Grid, Progress and Validation
    before advancing.
8.  Normal answer selection must not move the browser page.
9.  Automatic movement to Answer Grid occurs only after all answers are
    completed.
10. Editor controls must override the global 150px button minimum in
    constrained layouts.
11. Student Portal/runtime logic must remain unaffected.
12. Functional verification comes before CSS consolidation or legacy-ID
    renaming.

------------------------------------------------------------------------

# Immediate Next Starting Point (Updated: 2026-07-21)

Continue **Answer Key Builder stabilization**:

1.  Apply and verify compact Question Block Editor control CSS.
2.  Remove obsolete PDF Viewer CSS.
3.  Verify JavaScript contains no remaining PDF references.
4.  Verify source-mode mapping:
    -   `1 = Single TXT`
    -   `2 = English + Bengali`
5.  Run small Single TXT end-to-end test.
6.  Run small bilingual E/B end-to-end test.
7.  Verify no page jump during normal answer selection.
8.  Verify completion-only automatic scroll to Answer Grid.
9.  Verify final `Ansopt.txt` generation and validation.
10. Consolidate duplicate/obsolete CSS only after stabilization.

The Mobile Refactoring, Authentication, Developer Inspector, Final
Merger and wider Maintenance Suite roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-21)

  Date         Milestone
  ------------ ---------------------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  2026-07-18   Developer Metadata Inspector Foundation
  2026-07-18   Maintenance Suite / Citation Remover Foundation
  2026-07-19   Citation Remover Core Completed
  2026-07-19   Proof Reader Validation & Editing Workflow
  2026-07-19   Maintenance Dashboard & Glassmorphic UI Direction
  2026-07-20   Shift Extractor Added
  2026-07-20   Answer Key Builder Added and Refined
  2026-07-20   Maintenance Home Expanded to Five Tools
  2026-07-20   Final Merger Four-File Workflow
  2026-07-21   Answer Key Builder TXT-Only Refactor
  2026-07-21   PDF Viewer Removed from Answer Key Builder Architecture
  2026-07-21   Block ↔ Answer Positional Synchronization Refined
  2026-07-21   Half-Screen Desktop Layout and Scroll Behavior Refined
  Next         Answer Key Builder End-to-End Regression Testing
  Next         Final Merger Production Validation
  Next         Maintenance Suite Output Hardening

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-21)

This document remains the single source of truth for the Conceptual
Bridge project.

All historical sections are preserved. This update supersedes only older
descriptions of the current Answer Key Builder architecture where the
PDF-based design and earlier file-count workflow are no longer
applicable.

Future sessions should continue preserving historical milestones and
appending new progress updates rather than replacing earlier project
history.

------------------------------------------------------------------------

# Free Tutorial Corner Progress Update (Added: 2026-07-22)

## Current Status

**Version:** Free Tutorial Corner v0.2 (Multi-Tutorial Loading /
Study-Practice UI Foundation)

This update records the latest work on the Free Tutorial Corner. All
previous project history remains preserved.

## Tutorial Loading Architecture

The current `tutorials.html` loads tutorial metadata from numbered TXT
files inside the `Video/` directory.

Current configured loader:

``` javascript
const uploadedVideoFiles = [1,2,3,4,5,6];
```

For every configured number, the page attempts to load the corresponding
`Video/{number}.txt`.

The loading loop already safely handles missing files using:

``` javascript
if (!response.ok) continue;
```

Therefore, a configured tutorial number whose TXT file does not yet
exist is skipped rather than rendered.

### Confirmed Behavior

``` text
Configured: [1,2,3,4,5,6]

Video/1.txt exists → Load
Video/2.txt exists → Load
Video/3.txt missing → Skip
Video/4.txt missing → Skip
...
```

A missing tutorial TXT file must not stop successfully available
tutorial files from loading.

## Tutorial Metadata Flow

``` text
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

Tutorial TXT metadata maps the corresponding tutorial test through
`Test_Source| questions/<subject>/<file>.txt`.

The existing `compileMiniTest()` routing remains:

``` text
Tutorial TXT → Test_Source → quiz-portal.html?source=<encoded question path>
```

The Student Quiz Portal architecture remains unaffected.

## Missing-File Engineering Decision

It is acceptable to configure future numbered tutorial slots before all
corresponding TXT files are ready, provided the current safe-skip
behavior remains in place.

``` text
Existing TXT → Parse and display
Missing TXT → Skip safely
Malformed existing TXT → Log/debug separately
```

A future optimization may replace numbered probing with an API that
returns only existing tutorial metadata files. This is deferred.

## Download PDF Action Expansion

Two compact secondary controls are being introduced directly below
**Download PDF**:

``` text
Download PDF
[ Study ] [ Practice ]
```

### Study Button

**Status:** UI Foundation / Function Pending

-   Small pill-style control.
-   Positioned below Download PDF.
-   Styled consistently with the compact ENG/BEN controls.
-   No final action or routing assigned yet.

### Practice Button

**Status:** UI Foundation / Function Pending

-   Small pill-style control.
-   Positioned beside Study.
-   Styled consistently with the compact ENG/BEN controls.
-   No final action or routing assigned yet.

### Current Design Rule

Study and Practice remain UI-only placeholders until their exact
behavior is defined.

Existing functionality must remain unchanged:

-   ENG / BEN language switching
-   Play Video
-   Download PDF
-   Take 10Q Test
-   Tutorial TXT parsing
-   `Test_Source` routing

## Tutorial Corner Current File

``` text
tutorials.html
```

Relevant JavaScript components:

``` text
uploadedVideoFiles
cachedLoadedData
openSubjectFolder()
generateStudioTableLayout()
parseTextFileData()
switchRowLanguageContext()
compileMiniTest()
```

## Engineering Decisions Confirmed

1.  Tutorial metadata remains TXT-driven.
2.  Numbered tutorial files may be configured ahead of content
    availability.
3.  Missing TXT files must be skipped safely.
4.  Existing tutorial rows must continue loading when later numbered
    files are absent.
5.  Study and Practice are compact secondary PDF-area actions.
6.  Their behavior will be implemented only after functional
    requirements are defined.
7.  Existing ENG/BEN, video, PDF and 10Q Test behavior must remain
    untouched.
8.  Student Quiz Portal/runtime logic must remain unaffected.
9.  Automatic tutorial-file discovery/API remains a future optimization.

------------------------------------------------------------------------

# Immediate Next Starting Point (Updated: 2026-07-22)

1.  Verify Study and Practice buttons render correctly below Download
    PDF.
2.  Confirm compact layout at current desktop/table widths.
3.  Define the exact Study function.
4.  Implement and test Study independently.
5.  Define the exact Practice function.
6.  Implement and test Practice independently.
7.  Verify tutorial loading with mixed existing/missing numbered
    `Video/*.txt` files.
8.  Consider automatic tutorial-file discovery/API only after the
    current workflow is stable.
9.  Continue Answer Key Builder regression testing and Final Merger
    validation as previously planned.

The Mobile Refactoring, Authentication, Developer Inspector, Maintenance
Suite, Answer Key Builder and Final Merger roadmaps remain preserved.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-22)

  Date         Milestone
  ------------ ------------------------------------------------------
  2026-07-10   Mobile Refactoring Roadmap
  2026-07-14   Developer Workspace Foundation
  2026-07-16   Authentication Workspace Foundation
  2026-07-17   Quiz Portal UI Enhancements
  2026-07-17   Authentication Dropdown & Logout Foundation
  2026-07-18   Developer Metadata Inspector Foundation
  2026-07-18   Maintenance Suite / Citation Remover Foundation
  2026-07-19   Citation Remover Core Completed
  2026-07-19   Proof Reader Validation & Editing Workflow
  2026-07-19   Maintenance Dashboard & Glassmorphic UI Direction
  2026-07-20   Shift Extractor Added
  2026-07-20   Answer Key Builder Added and Refined
  2026-07-20   Final Merger Four-File Workflow
  2026-07-21   Answer Key Builder TXT-Only Refactor
  2026-07-21   Block ↔ Answer Positional Synchronization Refined
  2026-07-22   Free Tutorial Corner Multi-Tutorial Loading Reviewed
  2026-07-22   Missing Tutorial TXT Safe-Skip Behavior Confirmed
  2026-07-22   Study / Practice Compact Button UI Foundation
  Next         Define and Implement Study Function
  Next         Define and Implement Practice Function
  Next         Answer Key Builder End-to-End Regression Testing
  Next         Final Merger Production Validation

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-22)

This document remains the single source of truth for the Conceptual
Bridge project.

All previous project history has been preserved. This update appends the
latest Free Tutorial Corner architecture, multi-file loading behavior,
missing-file handling decision, and Study/Practice UI foundation without
replacing earlier milestones.

Future development sessions should continue appending progress updates
while preserving the historical record.

------------------------------------------------------------------------

# Mathematics Question Metadata Architecture Decision (Added: 2026-07-22)

## Current Status

**Version:** Mathematics Metadata Routing v0.1 (Architecture Defined /
Implementation Pending)

This update records the architectural decision for handling Mathematics
question banks where an exam may contain either a very large collection
of questions or a smaller mixed-topic Mathematics paper.

This change is **strictly scoped to Mathematics only** at this stage.

The behavior of General Intelligence (GI), General Science (GS/Science),
General Awareness & Current Affairs (GACA), and any other subject must
remain unchanged until a separate decision is made for those sections.

## Problem Identified

Mathematics question assets can appear in two significantly different
forms.

### Case 1 --- Large Exam Question Bank

Example:

``` text
RRB GROUP-D
Mathematics
2500+ questions
```

Such a large collection may need to be divided into multiple manageable
TXT files or learning sets.

Questions may also be organized or routed by:

``` text
Topic
↓
SubTopic
↓
10 / 20 / 40 Question Practice Sets
```

### Case 2 --- Small Mixed Mathematics Paper

Example:

``` text
RRB NTPC CBT-II
↓
Approximately 35 Mathematics questions
↓
Questions belong to multiple Topics/SubTopics
```

A single exam paper may contain questions such as:

``` text
Q1 → Percentage → Successive Percentage
Q2 → Algebra → Linear Equation
Q3 → Geometry → Triangle
Q4 → Profit & Loss → Discount
Q5 → Number System → HCF/LCM
...
```

If `Topic` and `SubTopic` remain only global TXT metadata, one mixed
Mathematics file cannot accurately classify every question without
either changing the exam identity or unnecessarily splitting the
original paper.

## Architecture Decision

For Mathematics, **Exam identity and academic classification must be
treated independently**.

### Exam / Source Identity

The following information may remain global where appropriate:

``` text
Exam
Notification
Subject
Type
Level
```

Example:

``` text
Exam| RRB NTPC CBT-II
Subject| MATHEMATICS
Notification| CEN XX/XXXX
Type| PYQ
```

The exam name must remain the true source identity of the question and
must not be changed merely to organize questions by Topic/SubTopic.

### Mathematics Topic Classification

For Mathematics only:

``` text
Topic
SubTopic
```

must support both:

1.  Global/default metadata.
2.  Question-level override metadata.

This creates an inheritance model.

## Mathematics Metadata Inheritance Rule

Conceptual parser rule:

``` text
Question has its own Topic/SubTopic?
        │
   ┌────┴────┐
  YES        NO
   │          │
Use local    Inherit global
value        value
```

### Example A --- Single-Topic Mathematics File

If all questions belong to Percentage:

``` text
Exam| RRB GROUP-D
Subject| MATHEMATICS
Topic| PERCENTAGE
SubTopic|
```

Individual questions do not need to repeat `Topic|PERCENTAGE`.

They inherit the global Topic.

### Example B --- Mixed Mathematics File

For a mixed NTPC CBT-II Mathematics paper:

``` text
Exam| RRB NTPC CBT-II
Subject| MATHEMATICS
Topic|
SubTopic|
```

Each question may define its own classification:

``` text
Topic| PERCENTAGE
SubTopic| SUCCESSIVE PERCENTAGE
Q| ...
A| ...
B| ...
C| ...
D| ...

Topic| ALGEBRA
SubTopic| LINEAR EQUATION
Q| ...
A| ...
B| ...
C| ...
D| ...

Topic| GEOMETRY
SubTopic| TRIANGLE
Q| ...
A| ...
B| ...
C| ...
D| ...
```

The original Exam identity remains unchanged while each question
receives its correct Topic/SubTopic.

### Example C --- Global Topic With Selective Override

A Mathematics TXT may define:

``` text
Topic| PERCENTAGE
```

Most questions inherit Percentage.

If an exceptional question belongs elsewhere, that question may provide
its own:

``` text
Topic| PROFIT & LOSS
SubTopic| DISCOUNT
```

The local value overrides the global/default value only for that
question.

## Storage vs Routing Decision

Physical TXT file organization must not be treated as the permanent
academic classification system.

The architecture distinguishes:

``` text
Physical Storage
≠
Exam Identity
≠
Topic Classification
≠
Quiz Route
```

Large Mathematics collections may be split into manageable TXT files for
engineering/storage purposes without changing the true exam metadata.

Example:

``` text
questions/
└── math/
    ├── groupd_001.txt
    ├── groupd_002.txt
    ├── groupd_003.txt
    └── ...
```

A file boundary is therefore an engineering/storage boundary and does
not necessarily define a Topic/SubTopic boundary.

## Future Mathematics Routing Model

The same Mathematics question may eventually be available through
different logical routes without duplicating the physical question.

Examples:

``` text
Exam Practice
RRB NTPC CBT-II
→ Mathematics
→ Original mixed questions
```

``` text
Topic Practice
Mathematics
→ Percentage
→ Questions filtered by Topic
```

``` text
Tutorial Practice
YouTube Tutorial
→ Practice
→ Exam + Topic/SubTopic filter
→ 10 / 20 / 40 questions
```

``` text
Mixed Mathematics Practice
Exam = RRB GROUP-D
Subject = MATHEMATICS
→ Shuffle
→ Select requested question count
```

This metadata-driven routing is a future extension. The immediate
implementation scope is only to make the Mathematics parser/data model
capable of correctly representing global and per-question Topic/SubTopic
metadata.

## Backward Compatibility Requirement

Existing Mathematics TXT files using only global:

``` text
Topic|
SubTopic|
```

must continue working.

Existing GI, GS/Science, GACA and other subject files must not change
behavior.

The implementation must therefore be additive and backward-compatible.

Target rule:

``` text
IF Subject = MATHEMATICS:

    question.Topic =
        local Topic if present
        ELSE global Topic

    question.SubTopic =
        local SubTopic if present
        ELSE global SubTopic

ELSE:

    preserve existing parser behavior exactly
```

Exact implementation must be based on review of the current parser
rather than blindly replacing existing logic.

## Files Required for Next Implementation Session

Start by reviewing:

``` text
services/questionParser.js
```

and one representative current Mathematics TXT question file.

Then verify the relevant APIs, especially:

``` text
api/fetch-question.js
api/fetch-tutorial-questions.js
```

or their current equivalent filenames.

`quiz-portal.html` should not be modified initially unless parser/API
verification proves a front-end change is necessary.

## Implementation Safety Rules

1.  Apply the new metadata inheritance behavior to **Mathematics only**.
2.  Do not modify GI behavior.
3.  Do not modify GS/Science behavior.
4.  Do not modify GACA behavior.
5.  Preserve existing global Mathematics metadata compatibility.
6.  Allow per-question Mathematics `Topic` and `SubTopic` overrides.
7.  Preserve the true Exam/Notification/Shift source identity.
8.  Do not force file splitting merely because Topic/SubTopic changes.
9.  Do not redesign the Student Quiz Portal unless required.
10. Review parser and API behavior before writing implementation
    changes.
11. Test with a small mixed Mathematics TXT before production rollout.
12. Other subjects may adopt or reject this model later through a
    separate architectural decision.

## Next Session Starting Point --- Mathematics Metadata

Provide:

1.  `services/questionParser.js`
2.  One representative existing Mathematics TXT file
3.  Main Exam Corner question API (`fetch-question.js` or current
    equivalent)
4.  Tutorial question API (`fetch-tutorial-questions.js` or current
    equivalent)

Implementation sequence:

``` text
Review current parser
↓
Identify global metadata parsing
↓
Add Math-only local Topic/SubTopic detection
↓
Implement inheritance/fallback
↓
Verify existing Math TXT compatibility
↓
Verify mixed-topic Math TXT
↓
Verify Exam Corner API
↓
Verify Tutorial API
↓
Regression-test non-Math subjects unchanged
```

------------------------------------------------------------------------

# Development Timeline Addition (2026-07-22)

  ---------------------------------------------------------------------
  Date                               Milestone
  ---------------------------------- ----------------------------------
  2026-07-22                         Mathematics Mixed-Topic Metadata
                                     Problem Identified

  2026-07-22                         Math-Only Global + Question-Level
                                     Topic/SubTopic Architecture
                                     Defined

  2026-07-22                         Mathematics Metadata Inheritance /
                                     Override Rule Defined

  2026-07-22                         Non-Math Subjects Explicitly
                                     Excluded From Current Change

  Next                               Review `questionParser.js` and
                                     Representative Math TXT

  Next                               Implement Math-Only Topic/SubTopic
                                     Inheritance

  Next                               Verify Exam Corner and Tutorial
                                     APIs

  Next                               Regression-Test GI / GS / GACA
                                     Unchanged
  ---------------------------------------------------------------------

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-22 --- Mathematics Metadata Planning)

This document remains the single source of truth for the Conceptual
Bridge project.

The Mathematics metadata architecture described above is currently an
**approved design decision / implementation plan**, not yet a confirmed
completed code change.

Future implementation must preserve all existing project behavior
outside the Mathematics-specific scope unless separately approved.

------------------------------------------------------------------------

# Mathematics Question Text Format & Maintenance Workflow Update (Added: 2026-07-23)

## Current Status

**Version:** Mathematics TXT Format v0.2 (Bilingual Field Separation /
Maintenance Preparation)

This update records the latest Mathematics question-text decisions. All
previous project history remains preserved.

## Scope

These changes are strictly **Mathematics-only**. GI, GS/Science, GACA,
and other existing subject formats must remain unchanged unless
separately approved.

## Mathematics Bilingual Question Format

Using `/` as an English/Bengali separator was rejected because slash
characters legitimately occur in Mathematics, for example `p/q`,
`a / b`, and `\frac{p}{q}`. `||` was also rejected because parallel/pipe
notation may carry mathematical meaning.

### Approved Format

``` text
QEN| English question
QBN| Bengali question
```

Example:

``` text
QEN| If the given number is expressed in the form p/q, where p and q are integers and q $\neq$ 0, is:
QBN| প্রদত্ত সংখ্যাটিকে p/q আকারে প্রকাশ করলে (যেখানে p এবং q পূর্ণসংখ্যা এবং q $\neq$ 0) তা হবে:
```

The slash inside `p/q` is therefore ordinary question content and cannot
be confused with a language separator.

## Mathematics Question Block Structure

``` text
QEN| English question
QBN| Bengali question
Common| optional language-independent equation/content
Image| optional image path
A| option A
B| option B
C| option C
D| option D
Shift| date + time
---
```

Rules:

-   `QEN|` stores English question text.
-   `QBN|` stores Bengali question text.
-   `Common|` stores optional shared mathematical content/equations.
-   `Image|` is a reserved image field and may be blank.
-   `A|`--`D|` store four answer options.
-   `Shift|` keeps date and time together on one line.
-   `---` is the recommended explicit question-block terminator.

Keeping `Common|` and `Image|` explicit reduces structural ambiguity
even when blank.

## Representative Mathematics TXT Review

The current Math TXT using this structure was reviewed and the
architecture is suitable for mathematical content containing fractions,
division operators, LaTeX, and similar symbols.

Cleanup issues identified before production processing:

1.  Accidental duplicate internal markers, for example:

``` text
QEN| If the given Equations are correct, then QEN| Find the value...
```

2.  Some malformed Bengali text with a missing/damaged initial character
    in `প্রদত্ত`.
3.  The reviewed sample omitted `---` separators; explicit block
    termination is recommended instead of relying only on blank lines.

These issues should be caught through Proof Reader / structural
validation before final processing.

## Math-Only Parser Compatibility Rule

``` text
IF Subject = MATHEMATICS:
    recognize QEN| and QBN|
    recognize Common|
    recognize Image|
    preserve Math-specific Topic/SubTopic inheritance
ELSE:
    preserve existing parser behavior exactly
```

Existing GACA, GI, GS/Science and other subject formats must not be
changed by this work.

## Character Introducer --- Second Operation Layer

A second operation is planned:

``` text
CREATE A NEW LINE
```

It provides:

``` text
1. Only New Line
2. New Line with Payload
```

### Only New Line

Insert an empty physical line immediately after every calculated target
line.

``` text
C| 20
D| 25
```

becomes:

``` text
C| 20

D| 25
```

### New Line with Payload

Insert a physical line containing the exact user-entered payload.

Example payload:

``` text
CLQ,
```

Result:

``` text
C| 20
CLQ,
D| 25
```

Payload content/whitespace should be preserved exactly.

## Character Introducer UI Reuse

The Create operation should reuse the established navigator:

``` text
Up / Down
Current Line Viewer
Marker 1
Marker 2
Gear / Adjustment
OK
```

The existing two-anchor/gap concept determines target positions.

## Critical Line-Index Safety Rule

A new physical line shifts all subsequent indexes. Therefore all targets
must first be calculated against the original unmodified line array.

Example original targets:

``` text
5, 15, 25, 35
```

Insertions must be processed bottom-to-top:

``` text
35, 25, 15, 5
```

Conceptual implementation:

``` javascript
const insertionTargets = [...targetIndexes].sort((a, b) => b - a);

insertionTargets.forEach(index => {
    modifiedLines.splice(
        index + 1,
        0,
        createMode === "payload" ? payload : ""
    );
});
```

After insertion, rebuild the working text and update the final
total-line count. This operation needs its own execution path because,
unlike Write-in-a-Line, it changes the number of physical lines.

## Recommended Mathematics Maintenance Sequence

``` text
Raw / Partially Formatted Mathematics TXT
↓
Character Introducer / Structural Formatting
↓
QEN| + QBN| separation
↓
Common| + Image|
↓
A| B| C| D|
↓
Shift| date + time
↓
Explicit --- boundaries
↓
Proof Reader / Structural Validation
↓
Correct| + Difficulty|
↓
Math Topic/SubTopic classification
↓
Final parser/API validation
```

## Immediate Next Starting Point

1.  Correct duplicate internal `QEN|` markers.
2.  Correct malformed Bengali text.
3.  Restore/confirm explicit `---` question boundaries.
4.  Implement and test Character Introducer `CREATE A NEW LINE`.
5.  Test both Only New Line and New Line with Payload.
6.  Verify bottom-to-top insertion across many targets.
7.  Confirm final line-count updates.
8.  Preserve existing Write-in-a-Line behavior.
9.  Review `services/questionParser.js` before implementing Math-only
    `QEN|` / `QBN|`.
10. Regression-test GI / GS / GACA unchanged.

------------------------------------------------------------------------

# Development Timeline Addition (2026-07-23)

  ---------------------------------------------------------------------
  Date                               Milestone
  ---------------------------------- ----------------------------------
  2026-07-23                         Math Slash-Based Bilingual
                                     Separator Rejected

  2026-07-23                         `QEN|` + `QBN|` Math-Only
                                     Bilingual Architecture Adopted

  2026-07-23                         `Common|` + `Image|` Reserved Math
                                     Fields Confirmed

  2026-07-23                         Same-Line `Shift|` Date + Time
                                     Format Confirmed

  2026-07-23                         Representative Math TXT Reviewed

  2026-07-23                         Duplicate Marker and Bengali
                                     Cleanup Issues Identified

  2026-07-23                         Character Introducer
                                     Create-New-Line Second Layer
                                     Defined

  2026-07-23                         Bottom-to-Top Line Insertion
                                     Safety Rule Defined

  Next                               Implement Character Introducer
                                     Create-New-Line Operation

  Next                               Finalize Math TXT Structural
                                     Validation

  Next                               Implement Math-Only Parser Support
                                     for `QEN|` / `QBN|`

  Next                               Regression-Test Non-Math Subjects
                                     Unchanged
  ---------------------------------------------------------------------

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-23 --- Mathematics TXT Format)

This document remains the single source of truth for the Conceptual
Bridge project. The Mathematics `QEN|` / `QBN|` format, `Common|` /
`Image|` structure, and Character Introducer Create-New-Line behavior
are approved architecture/development decisions. Code implementation
remains pending until the relevant maintenance and parser files are
reviewed and updated.

All historical project content remains preserved.

------------------------------------------------------------------------

# Character Introducer Progress Update (Added: 2026-07-23)

## Current Status

**Version:** Character Introducer v0.3 (Three Core Line Operations /
Maintenance Navigation)

This update records the latest Character Introducer development while
preserving all previous project history.

## Purpose and Workflow

Character Introducer is a browser-local TXT maintenance utility for
repeated, position-based physical-line transformations.

``` text
Upload TXT
↓
Select Operation
├── Write in a Line
├── Create a New Line
└── Delete a Line
↓
Navigate one physical TXT line at a time
↓
Mark First Target (1️⃣)
↓
Mark Second Target (2️⃣)
↓
Calculate repeating gap
↓
Run operation
↓
Generate Modified TXT
↓
Download
```

The first and second selected target lines define the repeating
positional pattern.

## Maintenance Home Integration

`character-introducer.html` belongs under the Developer Maintenance
Suite and now requires/directly supports:

``` text
← Maintenance Home
→ maintenance.html
```

A review of the latest HTML found an accidental duplicate nested
`<header class="page-header">` and duplicated Character Introducer
title/description.

Required final structure:

``` text
Page Header
├── ← Maintenance Home
└── Header Content
    ├── Conceptual Bridge Maintenance Suite
    ├── Character Introducer
    └── Page Description
```

Only one outer `.page-header` should remain.

## Operation 1 --- Write in a Line

Available modes:

``` text
Write in a Line
├── Write at Start of Line
├── Write Exactly at End
└── Write in Middle / Somewhere
```

### Write at Start of Line

**Status:** Foundation implemented/defined.

Workflow:

``` text
Enter payload
↓
Open line navigator
↓
Select first target (1️⃣)
↓
Select second target (2️⃣)
↓
Calculate gap
↓
🆗
↓
Insert payload at the start of every calculated target line
```

Workspace controls:

``` text
🔼 Previous Line
🔽 Next Line
1️⃣ First Anchor
2️⃣ Second Anchor
⚙️ Adjust Anchors
🆗 Run Operation
```

`Write Exactly at End` and `Write in Middle / Somewhere` remain deferred
until their exact behavior is defined.

## Operation 2 --- Create a New Line

**Status:** UI/workspace structure added; behavior defined.

Modes:

``` text
Create a New Line
├── Only New Line
└── New Line with Payload
```

### Only New Line

Creates one blank physical line immediately after each calculated
target.

Example:

``` text
C| 20
D| 25
```

becomes:

``` text
C| 20

D| 25
```

### New Line with Payload

Creates a new physical line after each target and writes the supplied
payload there.

Example payload:

``` text
CLQ,
```

Input:

``` text
C| 20
D| 25
```

Output:

``` text
C| 20
CLQ,
D| 25
```

### Cumulative Insertion Rule

Insertion changes later physical line indices:

``` text
1 inserted line  → following positions shift by +1
2 inserted lines → following positions shift by +2
N inserted lines → following positions shift by +N
```

The engine must preserve the original repeating target pattern while
compensating for cumulative insertion offsets. It must not allow target
drift caused by mutating the working line array.

Create workspace controls include:

``` text
🔼 / 🔽
1️⃣ / 2️⃣
⚙️
🆗
First Target
Second Target
Original Gap
New Lines count
```

## Operation 3 --- Delete a Line

**Status:** UI/workspace structure added; behavior defined.

Modes:

``` text
Delete a Line
├── Delete Completely
└── Use Backspace
```

### Delete Completely

Removes the entire targeted physical line.

Example:

``` text
B| 10
C| 20
D| 25
```

becomes:

``` text
B| 10
D| 25
```

when `C| 20` is targeted.

### Use Backspace

Removes the newline before the target and joins the target content to
the previous line.

Example:

``` text
B| 10
C| 20
D| 25
```

becomes:

``` text
B| 10 C| 20
D| 25
```

A separating space must exist between the previous content and the
shifted target content.

Conceptual rule:

``` text
previous line + " " + target line
```

The implementation should avoid accidental double spaces while
preventing concatenation without a separator.

### Cumulative Deletion Rule

Deletion/backspace joining changes later physical line indices:

``` text
1 removed line  → following positions shift by -1
2 removed lines → following positions shift by -2
N removed lines → following positions shift by -N
```

Target selection must remain based on the original repeating pattern
while execution compensates for cumulative deletion offsets.

Delete workspace controls include:

``` text
🔼 / 🔽
1️⃣ / 2️⃣
⚙️
🆗
First Target
Second Target
Original Gap
Targets count
```

## Current HTML Structure

Operation panels now exist for:

``` text
#writeWorkspace
#createWorkspace
#deleteWorkspace
```

Important Create IDs:

``` text
#createBlankLineBtn
#createPayloadLineBtn
#createPayloadSection
#createLineNavigator
#createFirstAnchorBtn
#createSecondAnchorBtn
#createAdjustAnchorsBtn
#createRunOperationBtn
```

Important Delete IDs:

``` text
#deleteCompleteBtn
#deleteBackspaceBtn
#deleteLineNavigator
#deleteFirstAnchorBtn
#deleteSecondAnchorBtn
#deleteAdjustAnchorsBtn
#deleteRunOperationBtn
```

## Current Verification State

### HTML

-   ✅ TXT File Upload section present.
-   ✅ Select Operation section present.
-   ✅ Write workspace present.
-   ✅ Create New Line workspace present.
-   ✅ Delete Line workspace present.
-   ✅ File Information section present.
-   ✅ Processing Console present.
-   ✅ New Session and Download Modified TXT actions present.
-   ✅ Maintenance Home navigation added.
-   ⚠ Duplicate nested page header/title block identified; remove it if
    not already corrected.

### CSS

-   ✅ Existing Character Introducer visual architecture retained.
-   ✅ Maintenance Home button styling added/required.
-   🟡 Final visual verification required after header cleanup.

### JavaScript Verification Still Required

The HTML contains the required controls, but full completion of
Create/Delete must only be declared after checking the current
`character-introducer.js`.

Verify:

1.  All Create IDs have corresponding DOM references and event
    listeners.
2.  All Delete IDs have corresponding DOM references and event
    listeners.
3.  Operation switching correctly shows/hides Write/Create/Delete
    workspaces.
4.  First/second target selection calculates the intended original gap.
5.  Create operations correctly compensate for cumulative `+N` shifts.
6.  Delete operations correctly compensate for cumulative `-N` shifts.
7.  Backspace mode joins content with safe spacing.
8.  Download activates only after successful modification.
9.  New Session resets operation mode, anchors, payloads, working lines
    and download state.

## Updated Maintenance File Structure

``` text
developer/
└── maintenance/
    ├── maintenance.html
    ├── citation-remover.html / .css / .js
    ├── proof-reader.html / .css / .js
    ├── shift-extractor.html / .css / .js
    ├── answer-key-builder.html / .css / .js
    ├── final-merger.html / .css / .js
    └── character-introducer.html / .css / .js
```

`maintenance.html` remains the single mother page for all maintenance
HTML utilities.

## Engineering Decisions Confirmed

1.  Character Introducer remains browser-local and isolated from Student
    Portal runtime logic.
2.  Operations work on physical TXT lines.
3.  Only one physical line is displayed at a time during target
    selection.
4.  Two selected target lines establish the repeating positional gap.
5.  Insertions must compensate for cumulative positive line-index
    shifts.
6.  Deletions/backspace joins must compensate for cumulative negative
    line-index shifts.
7.  Backspace joins the target to the previous line with a separating
    space.
8.  The repeating target pattern must not drift as the working array is
    mutated.
9.  Modified content is exported as a new TXT rather than silently
    overwriting the source.
10. Character Introducer must provide `← Maintenance Home` navigation.
11. Only one `.page-header` should exist.
12. Write-at-End and Write-in-Middle remain deferred.

## Immediate Next Starting Point --- Character Introducer

1.  Remove/verify removal of the duplicate nested page header.
2.  Review `character-introducer.js` ID-by-ID against the latest HTML.
3.  Test Create → Only New Line with at least three repeating targets.
4.  Verify cumulative insertion offsets do not cause target drift.
5.  Test Create → New Line with Payload.
6.  Test Delete → Delete Completely.
7.  Verify cumulative deletion offsets do not cause target drift.
8.  Test Delete → Use Backspace and verify safe spacing.
9.  Verify New Session resets all three operation families.
10. Verify downloaded TXT exactly preserves the intended transformed
    structure.
11. Define Write Exactly at End and Write in Middle / Somewhere only
    after the three current core operations are stable.

------------------------------------------------------------------------

# Development Timeline Addition (2026-07-23)

  -----------------------------------------------------------------------
  Date                                Milestone
  ----------------------------------- -----------------------------------
  2026-07-23                          Character Introducer
                                      Three-Operation Architecture
                                      Expanded

  2026-07-23                          Create New Line --- Blank Line and
                                      Payload Modes Defined

  2026-07-23                          Cumulative `+N` Shift Handling
                                      Required for Insertions

  2026-07-23                          Delete Line --- Complete Delete and
                                      Backspace Modes Defined

  2026-07-23                          Cumulative `-N` Shift Handling
                                      Required for Deletions

  2026-07-23                          Backspace Join-with-Space Rule
                                      Defined

  2026-07-23                          Character Introducer Maintenance
                                      Home Navigation Added

  2026-07-23                          Duplicate Character Introducer
                                      Header Identified for Cleanup

  Next                                Character Introducer JavaScript
                                      Full Functional Verification

  Next                                Create/Delete End-to-End
                                      Repeating-Pattern Testing

  Next                                Write-at-End / Write-in-Middle
                                      Behavior Definition
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Documentation Note (Updated: 2026-07-23 --- Character Introducer)

This document remains the single source of truth for the Conceptual
Bridge project.

All previous content has been preserved. This update appends the latest
Character Introducer architecture, Create New Line behavior, Delete Line
behavior, cumulative line-index mutation rules, Maintenance Home
navigation, current HTML verification state and immediate testing
requirements.

The HTML currently contains the structural controls for all three
operation families. Create/Delete should be marked fully complete only
after the corresponding JavaScript is reviewed and end-to-end tested.

------------------------------------------------------------------------

# Answer Key Builder GACA / Mathematics Mode Update (Added: 2026-07-23 --- Session Close)

## Current Status

**Version:** Answer Key Builder vNext (GACA / Math Mode Foundation ---
Implementation In Progress)

This update records the latest Answer Key Builder design and partial
implementation state before closing the current development session.

## New Subject-Mode Architecture

When the Answer Key Builder is opened, it is intended to provide two
subject workflow choices:

``` text
Answer Key Builder
        │
        ├── GACA
        │    └── Existing Answer Key Builder workflow
        │
        └── MATH
             └── Mathematics-specific single-TXT workflow
```

### GACA Mode

GACA must preserve the currently established Answer Key Builder
behavior.

Existing supported source modes remain:

``` text
GACA
├── 1 TXT — Single Question TXT
└── 2 TXT — English + Bengali TXT
```

Existing GACA question-block detection remains based on:

``` text
Q|
```

No Mathematics-specific parser change may break or globally replace the
existing GACA `Q|` behavior.

### Mathematics Mode

Mathematics must always use exactly:

``` text
1 TXT file
```

The filename may be any valid `.txt` filename; Math mode does not
require an `E.txt` or `B.txt` filename suffix.

Mathematics question blocks begin with:

``` text
QEN|
```

Approved Math block structure remains:

``` text
QEN| English question
QBN| Bengali question
Common| optional shared mathematical content
Image| optional image path
A| option A
B| option B
C| option C
D| option D
Shift| date + time
---
```

For Answer Key Builder Math mode:

``` text
QEN| = question/block start marker
```

All following lines belong to that question until the next `QEN|` block
begins.

## Shared Answer-Key Functions

Apart from source-mode selection and block-start parsing, Math should
reuse the existing Answer Key Builder engine.

Functions intended to remain shared:

-   Question Block Editor.
-   One-block-at-a-time display.
-   Previous / Next navigation.
-   Edit / Save.
-   A / B / C / D answer selection.
-   Block ↔ answer positional synchronization.
-   Answer Progress.
-   Answer Grid.
-   Answer Grid click navigation.
-   Output Validation.
-   Processing Console.
-   New Session.
-   Completion-only automatic movement to Answer Grid.
-   No unwanted page movement after normal answer selection.
-   `Ansopt1.txt` generation.
-   `Ansopt.txt` numbered generation.

## Answer Output Rule Preserved

The two current output formats remain:

``` text
Ansopt1.txt

A

B

C

D
```

and:

``` text
Ansopt.txt

Q1 A

Q2 B

Q3 C

Q4 D
```

Critical numbering rule:

``` text
Ansopt.txt ALWAYS begins with Q1.
```

This numbering is independent of the configured Initial Question Number.

Example:

``` text
Initial Question No. = 501

UI:
501
502
503

Ansopt.txt:
Q1 A
Q2 C
Q3 B
```

## Partial GACA / Math Implementation Added

The current Answer Key Builder JavaScript contains partial additions
for:

``` text
#gacaModeBtn
#mathModeBtn
#selectedBuilderMode
builderMode
setBuilderMode()
```

The intended mode behavior is:

``` text
GACA
→ existing source configuration available
→ Q| block marker

MATH
→ force Number of Files = 1
→ disable file-count switching
→ QEN| block marker
```

Switching subject modes should clear previously loaded source state so a
file parsed under one subject format cannot leak into another mode.

## Important Current JavaScript Defects Identified

The latest reviewed `answer-key-builder.js` is **not yet safe to deploy
as final**.

The following issues were identified:

### 1. Duplicate `sourceMode` Declaration

The file currently declares:

``` javascript
let sourceMode = 1;
```

twice in the same scope.

This can stop the complete script with:

``` text
SyntaxError: Identifier 'sourceMode' has already been declared
```

Required correction:

-   Keep exactly one `let sourceMode = 1;`.
-   Keep `let builderMode = "gaca";` as a separate state variable.

### 2. `questionStartMarker` Declared Too Early

The current file contains a global expression conceptually equivalent
to:

``` javascript
const questionStartMarker =
    builderMode === "math"
        ? "QEN|"
        : "Q|";
```

before `builderMode` is initialized.

This is incorrect and can cause initialization failure.

Required correction:

-   Remove the global `questionStartMarker`.
-   Determine the marker dynamically inside `parseSourceBlocks()`.

Required rule:

``` text
builderMode === "math"
    → QEN|

otherwise
    → Q|
```

### 3. Parser Still Hard-Coded to `Q|`

The current `parseSourceBlocks()` still uses:

``` javascript
trimmed.startsWith("Q|")
```

Therefore Math mode currently cannot correctly detect `QEN|` blocks.

Required parser logic:

``` javascript
const questionStartMarker =
    builderMode === "math"
        ? "QEN|"
        : "Q|";
```

Then block detection must use that variable.

### 4. Math Single-TXT Enforcement Requires Final Verification

`setBuilderMode("math")` is intended to:

``` text
fileCountInput.value = 1
fileCountInput.disabled = true
```

`handleSourceModeChange()` should also defensively preserve Math as
single-file mode.

### 5. Math Start-Session Validation Still Required

Before a Math answer session begins, verify:

``` text
builderMode = math
sourceMode = 1
single TXT is loaded
at least one QEN| block was detected
```

If not, the session must not start.

## Correct State Architecture Required

The state section should conceptually contain only one copy of each
variable:

``` javascript
let totalQuestions = 100;
let initialQuestion = 1;
let currentIndex = 0;
let answers = [];
let sessionActive = false;

let sourceMode = 1;
let builderMode = "gaca";

let currentSourceBlockIndex = 0;
```

## Parser Architecture Required

The next session should update `parseSourceBlocks()` so block detection
is subject-aware:

``` text
GACA:
Q| starts each block

MATH:
QEN| starts each block
```

For Math single-file mode, the complete block should remain
visible/preserved, including:

``` text
QEN|
QBN|
Common|
Image|
A|
B|
C|
D|
Shift|
---
```

The existing `"FULL_BLOCK"` single-source pathway is suitable for this
architecture and should be preserved unless testing reveals a problem.

## Regression Safety Rule

Do **not** globally replace:

``` text
Q|
```

with:

``` text
QEN|
```

throughout `answer-key-builder.js`.

That would break GACA and existing non-Math question files.

Only subject-aware block detection should switch between the two
markers.

## Current Session Closure State

### Confirmed / Preserved

-   ✅ Existing Answer Key Builder architecture retained.
-   ✅ Existing GACA behavior is intended to remain unchanged.
-   ✅ GACA / Math subject-mode design approved.
-   ✅ Math defined as exactly one TXT input.
-   ✅ Math `QEN|` block-start rule approved.
-   ✅ Math continues using the established `QEN|` / `QBN|` question
    format.
-   ✅ Existing answer navigation/grid/progress/validation/output logic
    is intended to be shared.
-   ✅ `Ansopt1.txt` and numbered `Ansopt.txt` output architecture
    preserved.
-   ✅ `Ansopt.txt` numbering remains independent of Initial Question
    Number.
-   🟡 Mode-selection HTML/CSS/JS foundation partially introduced.
-   ⚠ Latest reviewed JS contains duplicate `sourceMode` declaration.
-   ⚠ Latest reviewed JS initializes `questionStartMarker` before
    `builderMode`.
-   ⚠ Parser remains hard-coded to `Q|`.
-   ⚠ Math start-session validation remains to be completed.
-   ⚠ End-to-end Math testing has not yet been completed.

## Immediate Next Starting Point --- Next Session

Resume specifically from **Answer Key Builder GACA / Math repair and
stabilization**:

1.  Open the latest `answer-key-builder.js`.
2.  Remove the duplicate `let sourceMode = 1;`.
3.  Remove the global `questionStartMarker`.
4.  Keep one `let builderMode = "gaca";`.
5.  Move subject-aware marker selection inside `parseSourceBlocks()`.
6.  Confirm:
    -   GACA → `Q|`
    -   Math → `QEN|`
7.  Ensure Math always forces exactly one TXT source.
8.  Add/verify Math source validation before Start Answer Session.
9.  Test a 2--3 question Math TXT containing `QEN|`, `QBN|`, `Common|`,
    `Image|`, options and `Shift|`.
10. Verify Previous / Next and block editor synchronization.
11. Verify Edit / Save.
12. Verify A/B/C/D selection and automatic next-block movement.
13. Verify Answer Grid click navigation.
14. Verify no unwanted page scroll during normal answer selection.
15. Verify completion-only automatic movement to Answer Grid.
16. Verify `Ansopt1.txt`.
17. Verify numbered `Ansopt.txt` starts from `Q1` regardless of Initial
    Question Number.
18. Regression-test existing GACA single-TXT mode.
19. Regression-test existing GACA English + Bengali mode.
20. Only after both GACA and Math tests pass, mark the dual-mode Answer
    Key Builder complete.

------------------------------------------------------------------------

# Development Timeline Addition (2026-07-23 --- Session Close)

  -----------------------------------------------------------------------
  Date                                Milestone
  ----------------------------------- -----------------------------------
  2026-07-23                          Answer Key Builder GACA / Math
                                      Dual-Mode Architecture Approved

  2026-07-23                          GACA Existing Workflow Preservation
                                      Rule Confirmed

  2026-07-23                          Math Answer Key Builder Defined as
                                      Single-TXT Only

  2026-07-23                          Math `QEN|` Question-Block Start
                                      Rule Confirmed

  2026-07-23                          Shared
                                      Answer/Grid/Validation/Output
                                      Engine Strategy Confirmed

  2026-07-23                          Partial GACA / Math Mode Code Added

  2026-07-23                          Duplicate `sourceMode` JavaScript
                                      Defect Identified

  2026-07-23                          Premature Global
                                      `questionStartMarker` Defect
                                      Identified

  2026-07-23                          Existing Parser Still Hard-Coded to
                                      `Q|` --- Repair Required

  Next                                Repair Answer Key Builder
                                      JavaScript Initialization

  Next                                Implement Dynamic GACA `Q|` / Math
                                      `QEN|` Parsing

  Next                                Add Math Start-Session Validation

  Next                                Math Small-Set End-to-End Test

  Next                                GACA Regression Test
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Session Handoff Note (2026-07-23)

The next development session should **not restart the Answer Key Builder
redesign from scratch**.

The existing GACA Answer Key Builder is the baseline. The new Math
workflow is an additional subject mode layered onto the same engine.

The highest-priority repair is the current JavaScript
initialization/parsing issue. Fix that first before adding further UI or
functionality.

The canonical subject rule is:

``` text
GACA → existing behavior → Q| block start
MATH → exactly 1 TXT → QEN| block start
```

All other established answer-key behavior should remain shared and
intact.

------------------------------------------------------------------------

------------------------------------------------------------------------

# Exam Corner Mathematics Compatibility Review (Added: 2026-07-24)

## Current Status

**Version:** Mathematics Exam Corner Compatibility v0.1 (Review Complete
/ Implementation Pending)

This session reviewed why Mathematics questions were not appearing in
the Exam Corner even though Mathematics TXT files were available.

## Findings

-   The issue is a parser compatibility mismatch rather than missing
    question files.
-   Mathematics folder naming must remain consistent (`questions/math/`)
    across the project for case-sensitive deployments.
-   The current parser recognizes `Q|`, while the new Mathematics format
    uses `QEN|`, `QBN|`, `Common|` and `Image|`.
-   The parser must be extended for Mathematics only while preserving
    GI, GS/Science and GACA behavior.
-   Mathematics question blocks should be validated for `Correct|` and
    `Difficulty|` compatibility before production deployment.

## Implementation Order

1.  Standardize Mathematics folder naming.
2.  Extend `services/questionParser.js` for Math-only support.
3.  Verify Exam Corner API.
4.  Verify Tutorial API.
5.  Regression-test GI / GS / GACA.
6.  Validate Mathematics question banks inside Exam Corner.

## Scope

This work is restricted to Mathematics only. Student Portal UI and
non-Mathematics parser behavior remain unchanged.

------------------------------------------------------------------------

# Development Timeline Addition (2026-07-24)

  Date         Milestone
  ------------ --------------------------------------------------------
  2026-07-24   Mathematics Exam Corner Compatibility Review Completed
  Next         Standardize Mathematics folder naming
  Next         Implement Math-only parser support
  Next         Verify Exam Corner and Tutorial APIs
  Next         Regression-test GI / GS / GACA

------------------------------------------------------------------------

# Mathematics Topic & SubTopic Logger Progress Update (Added: 2026-07-24)

## Current Status

**Version:** Topic & SubTopic Logger v0.3 (Core Logging Workflow
Complete)

This session advanced the Mathematics Topic & SubTopic Logger from the
metadata-planning stage to a functional browser-based maintenance tool.

### Completed

-   ✅ Dedicated Mathematics Logger workspace implemented.
-   ✅ TXT upload and QEN\| block extraction.
-   ✅ Logging Mode selection:
    -   Topic + SubTopic per Question.
    -   Global Topic + SubTopic Only.
-   ✅ Global metadata preservation.
-   ✅ Question-level metadata insertion/replacement.
-   ✅ Metadata inheritance architecture implemented.
-   ✅ Previous/Next navigation with metadata restoration.
-   ✅ Automatic save and advance using the OK button.
-   ✅ Final TXT assembly (`buildFinalMathText()`).
-   ✅ Download UI created.
-   ✅ Completion tracking implemented.
-   ✅ Download button remains hidden until every question is logged.
-   ✅ Download generates `<original>-topic-logged.txt`.

### Engineering Decisions

-   Mathematics uses `QEN|` as the question block delimiter.
-   Global Topic acts as a default only in SubTopic-Only mode.
-   Question-level Topic/SubTopic overrides remain supported.
-   Existing global metadata is preserved wherever possible.
-   Processing remains entirely browser-local.

### Current Workflow

Upload TXT ↓ Extract Global Metadata ↓ Extract QEN Blocks ↓ Choose
Logging Mode ↓ Assign Topic/SubTopic ↓ OK (Auto Save + Next) ↓ All
Questions Completed ↓ Download Updated TXT

### Code Review

During review one duplicate JavaScript declaration of
`applyQuestionMetadataBtn` was identified. The duplicate must be removed
to avoid a browser `Identifier has already been declared` error.

### Next Development

1.  End-to-end regression testing.
2.  Verify downloaded TXT against production datasets.
3.  Implement Topic/SubTopic catalogue management (Add/Edit Topic,
    Add/Edit SubTopic).
4.  Generate updated `math.json` after catalogue modifications.

------------------------------------------------------------------------

# Development Timeline (Updated: 2026-07-24)

2026-07-24 Mathematics Topic & SubTopic Logger Core Workflow Completed
2026-07-24 Final TXT Builder Added 2026-07-24 Completion Tracking and
Conditional Download Added Next Logger Regression Testing Next
Topic/SubTopic Catalogue Management
