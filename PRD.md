# Planning Guide

A question collection system for Virtuoso Intelligence Capability (AI) that captures user questions to help identify areas of focus for capability expansion, with staff-only access to view and export submissions.

**Experience Qualities**: 
1. **Professional** - Clean, corporate interface that reflects Virtuoso's brand standards and inspires trust
2. **Welcoming** - Friendly and approachable for public users submitting feedback
3. **Efficient** - Streamlined workflows for both submitting feedback and managing responses

**Complexity Level**: Light Application (multiple features with basic state)
This is a dual-interface application with a public feedback form and an authenticated admin panel for viewing and exporting data. The scope is focused and achievable with basic state management and CSV export functionality.

## Essential Features

### Feature 1: Question Submission Interface
- **Functionality**: Collects user questions through a single text input field about what they would like to ask Virtuoso Intelligence
- **Purpose**: Gather questions to determine which areas users want Virtuoso to focus on when expanding AI capability
- **Trigger**: User navigates to the application
- **Progression**: View welcome message and BETA badge → Enter question in input field → Submit → See confirmation
- **Success criteria**: Questions are persisted to KV store and input clears on successful submission

### Feature 2: Staff Authentication
- **Functionality**: Verifies user is a Virtuoso staff member (GitHub login contains "virtuoso")
- **Purpose**: Restrict admin panel access to authorized Virtuoso employees only
- **Trigger**: User clicks "Staff Login" button
- **Progression**: Click staff login → Authenticate via GitHub → Check login for "virtuoso" → Grant/deny access
- **Success criteria**: Only users with "virtuoso" in their GitHub login can access the admin panel

### Feature 3: Questions Dashboard
- **Functionality**: Displays all submitted questions in a searchable, sortable table
- **Purpose**: Allow staff to review all user questions efficiently to identify capability improvement areas
- **Trigger**: Authenticated staff user switches to admin view
- **Progression**: Authenticate → View table of questions → Search/filter → Select entries
- **Success criteria**: All persisted questions display correctly with timestamps and are searchable

### Feature 4: CSV Export
- **Functionality**: Exports all questions to a downloadable CSV file
- **Purpose**: Enable data portability for analysis in external tools
- **Trigger**: Staff clicks "Export CSV" button
- **Progression**: Click export → Generate CSV → Download file
- **Success criteria**: CSV file contains all questions with proper formatting and downloads successfully

## Edge Case Handling
- **Empty State**: Display helpful message when no questions have been submitted yet
- **Authentication Failure**: Show clear error if user doesn't have Virtuoso email/login
- **Missing Fields**: Validate question input before submission
- **Export with No Data**: Disable export button when there are no questions
- **Long Questions**: Handle text overflow gracefully in table view

## Design Direction
The design should evoke professionalism, trust, and approachability - balancing corporate refinement with warmth. It should feel like a premium enterprise tool while remaining inviting to public users.

## Color Selection
A sophisticated palette inspired by financial services and premium brands, using deep navy blues with bright blue accent colors for focus and interaction states.

- **Primary Color**: Deep Navy Blue `oklch(0.25 0.08 250)` - Communicates trust, professionalism, and corporate authority
- **Secondary Colors**: Slate Gray `oklch(0.55 0.02 250)` for supporting UI elements and muted backgrounds, Cool White `oklch(0.98 0.01 250)` for card backgrounds
- **Accent Color**: Bright Blue `oklch(0.68 0.15 250)` - Draws attention to CTAs, focus states, and important interactive elements
- **Foreground/Background Pairings**: 
  - Primary Navy `oklch(0.25 0.08 250)`: White text `oklch(0.98 0.01 250)` - Ratio 12.1:1 ✓
  - Accent Blue `oklch(0.68 0.15 250)`: White text `oklch(0.98 0.01 250)` - Ratio 4.9:1 ✓
  - Background White `oklch(0.99 0 0)`: Navy text `oklch(0.25 0.08 250)` - Ratio 13.8:1 ✓

## Font Selection
Typography should convey modern professionalism with excellent readability across the large display format.

- **Primary Font**: Space Grotesk - A geometric sans-serif that balances technical precision with warmth, perfect for headers
- **Secondary Font**: Inter - Clean and highly legible for body text and form fields

- **Typographic Hierarchy**: 
  - H1 (Welcome Title): Space Grotesk Bold/48px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/32px/normal
  - Body (Form Labels, Instructions): Inter Regular/18px/1.6 line-height
  - Input Text: Inter Regular/16px
  - Table Data: Inter Regular/15px/1.5 line-height

## Animations
Animations should reinforce actions and guide attention without distracting from the workflow. Use subtle micro-interactions for form submission success, smooth transitions when switching between public and admin views, and gentle hover states on interactive elements to communicate affordance.

## Component Selection
- **Components**: 
  - Card - For containing the feedback form and admin panel sections
  - Input, Textarea, Label - For form fields with proper validation states
  - Button - Primary for submissions, secondary for navigation
  - Table - For displaying feedback responses in admin view
  - Tabs - For switching between public submission and admin panel
  - Badge - For displaying submission timestamps and status
  - Separator - For visual hierarchy between sections
  - Toast (Sonner) - For feedback confirmation and error messages
  
- **Customizations**: 
  - Large-scale layout wrapper to accommodate 3840x2160 display
  - Custom table search/filter component
  - CSV export utility function
  
- **States**: 
  - Buttons: Distinct hover with subtle scale, active with deeper color, disabled with reduced opacity
  - Inputs: Clear focus rings, success/error border colors, smooth transition on state changes
  - Table rows: Subtle hover background for scanability
  
- **Icon Selection**: 
  - PaperPlaneRight - Submit feedback
  - Download - Export CSV
  - MagnifyingGlass - Search responses
  - SignIn - Staff authentication
  - CheckCircle - Success confirmations
  
- **Spacing**: 
  - Container padding: p-12 to p-16 for generous whitespace on large display
  - Form field gaps: gap-6 for clear visual separation
  - Section spacing: mt-8 to mt-12 between major sections
  
- **Mobile**: 
  - Not applicable - designed specifically for 2160x3840 portrait display (9:16 aspect ratio)
  - Development frame wrapper simulates the conference display dimensions with automatic scaling to fit browser window
