---
name: Obsidian Telemetry
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e1e2ec'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#1bbd85'
  on-tertiary-container: '#00452e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353d'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  stat-display:
    fontFamily: JetBrains Mono
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.08em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
---

## Brand & Style

This design system establishes a high-precision, developer-first command interface engineered for competitive programmers and software engineers. The visual identity merges the discipline of technical telemetry consoles with futuristic, high-contrast computational aesthetics. 

The core philosophy revolves around clarity, high-density data parsing, and zero extraneous ornament. Visual energy is strictly channelled into semantic state signifiers: electric cyan leads active operations and platform telemetry, radiant violet anchors generative AI copilot features, vibrant emerald tracks execution streaks, and amber spotlights time-critical competitive contests.

Surfaces borrow from deep obsidian and carbon foundations, illuminated by refined glass borders and sharp glowing accents. Micro-interactions should feel immediate, deterministic, and tactile—evoking military avionics, low-latency trading terminals, and IDE diagnostics.

## Colors

The palette operates on pure dark-mode calibration, utilizing deep carbon steps to eliminate optical fatigue during sustained operational sessions.

### Core Hierarchy
- **Primary (`#06B6D4`)**: Electric Cyan. Used for critical focus rings, active links, navigation waypoints, primary actions, and system runtime indicators.
- **Secondary (`#8B5CF6`)**: Radiant Violet. Reserved exclusively for AI copilot insights, machine-generated code explanations, and deep neural recommendations.
- **Tertiary / Success (`#10B981`)**: Emerald. Applied to solved problem counts, green test runners, accepted submissions, and persistent streak nodes.
- **Warning / Contest Gold (`#F59E0B`)**: Amber. Dedicated to live ratings, upcoming contest countdown alerts, and podium achievements.
- **Danger / Failure (`#EF4444`)**: Crimson. Reserved for compilation errors, time limit exceeded alerts, and regression tracking.

### Surface Tiers
- **Canvas Base**: `#0A0D14` (Deep Obsidian). The absolute background for root viewports.
- **Surface Elevation 1**: `#0F172A` (Slate Carbon). Used for persistent panels, sidebars, and structural rails.
- **Surface Elevation 2**: `#131B2E` (Layered Container). Applied to interactive cards, terminal windows, and metric modules.
- **Surface Elevation 3**: `#1E293B` (Elevated Popovers). Modal dialogues, dropdown menus, and active hover states.

### Platform Identification Accents
- **LeetCode**: `rgba(245, 158, 11, 0.15)` fill with `#F59E0B` typography.
- **Codeforces**: `rgba(6, 182, 212, 0.15)` fill with `#38BDF8` typography.
- **GitHub**: `rgba(255, 255, 255, 0.08)` fill with `#F8FAFC` typography.
- **CodeChef**: `rgba(217, 119, 6, 0.15)` fill with `#D97706` typography.
- **GeeksforGeeks**: `rgba(16, 185, 129, 0.15)` fill with `#10B981` typography.

## Typography

The typographic hierarchy implements a dual-engine structure:

1. **Geist** governs high-level narrative waypoints, dashboard headers, section anchors, and modal announcements. Its geometric, neutral construction provides architectural clarity without visual distortion.
2. **JetBrains Mono** powers all data surfaces, labels, code snippets, rating matrices, contest clocks, and body analysis text. Monospaced character alignment guarantees tabular numerical stability across dynamically updated real-time metrics.

All labels (`label-md`, `label-sm`) default to uppercase casing with widened letter spacing (`0.06em` to `0.08em`) to mimic terminal instruments.

## Layout & Spacing

This design system uses a high-density, fluid-column layout optimized for multi-pane developer environments:

- **Desktop (1280px+)**: 12-column grid with `1.5rem` gutters and `2rem` screen margins. Supports multi-column telemetry arrays, split code/analysis views, and persistent side navigations.
- **Tablet (768px - 1279px)**: 8-column grid with `1rem` gutters and `1.5rem` outer canvas padding. Secondary metrics collapse into swipeable or tabbed panels.
- **Mobile (< 768px)**: 4-column fluid stack with `1rem` outer canvas padding and `0.75rem` vertical module gaps. Data tables horizontally scroll; heatmaps reduce cell scale.

Spacing rhythm prioritizes compact, information-rich density. Component interiors default to `space-md` (`0.75rem`) padding to preserve screen real estate for deep operational statistics.

## Elevation & Depth

Visual depth is achieved through structural luminosity, crisp edge outlines, and backdrop blurs rather than muddy drop shadows.

- **Base Field**: Level 0 (`#0A0D14`) has zero elevation.
- **Glass Panel Depth**: Level 1 surfaces (`#0F172A`) use `rgba(255, 255, 255, 0.05)` 1px borders, combined with `backdrop-filter: blur(12px)`.
- **Card Containers**: Level 2 surfaces (`#131B2E`) use `rgba(255, 255, 255, 0.08)` 1px borders, shifting to `rgba(6, 182, 212, 0.4)` on keyboard focus or cursor hover.
- **Neon Volumetrics**: Interactive states and focal accents employ localized outer glows rather than classical shadows:
  - Cyan Focus: `0 0 16px rgba(6, 182, 212, 0.25)`
  - AI Violet Glow: `0 0 20px rgba(139, 92, 246, 0.25)`
  - Alert Amber Glow: `0 0 16px rgba(245, 158, 11, 0.2)`
- **Modals and Command Palettes**: Level 3 floats above a dimmed backdrop (`rgba(10, 13, 20, 0.85)` with `blur(8px)`), bound by a dual stroke: an inner `rgba(255, 255, 255, 0.1)` border and an ambient `0 24px 48px rgba(0, 0, 0, 0.8)` cast.

## Shapes

The design system adopts a disciplined, technical shape grammar with a soft corner radius baseline (`roundedness: 1`):

- **Default Element Radius (`rounded`)**: `0.25rem` (4px). Applied to badges, table cells, form inputs, buttons, and inline code tags.
- **Container Radius (`rounded-lg`)**: `0.5rem` (8px). Applied to cards, code blocks, dashboard panels, and modals.
- **Surface Enclosures (`rounded-xl`)**: `0.75rem` (12px). Applied strictly to root workspace viewports and persistent global navigation shells.
- **Heatmap Matrix Cells**: Fixed `2px` radius for discrete execution days.
- **Pills**: Completely rounded ends are restricted to live status indicators (e.g., `CONTEST LIVE` countdown badges).

## Components

### Buttons
- **Primary Action**: Electric Cyan background (`#06B6D4`), solid dark obsidian text (`#0A0D14`), font `JetBrains Mono` medium 12px uppercase. Subtle cyan bloom on hover (`0 0 12px rgba(6, 182, 212, 0.4)`).
- **Secondary / Ghost**: Transparent fill, 1px border `rgba(255, 255, 255, 0.12)`, text `#F8FAFC`. On hover: surface tints to `rgba(255, 255, 255, 0.04)` and border to `rgba(255, 255, 255, 0.25)`.
- **AI Trigger**: Radial gradient fill (`linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)`), text `#FFFFFF`, with a continuous low-opacity violet perimeter pulse.

### Metric Cards & Data Containers
- Multi-tier background: `#131B2E` with an ultra-fine `1px solid rgba(255, 255, 255, 0.06)` border.
- Header contains category title (`label-sm`, muted `#64748B`), right-aligned auxiliary delta or platform icon.
- Value block features large mono counter (`stat-display`, `#F8FAFC`) paired with status sparkline or delta pill.

### Platform Chips & Status Pills
- Micro-scale badges with height `22px`, internal padding `0 8px`, border-radius `4px`.
- Composed of 20% alpha tinted background, matching solid text, and a 6px status circle:
  - Green (Solved/Passing): Circle `#10B981` with pulse.
  - Cyan (Active Queue): Circle `#06B6D4`.
  - Amber (Upcoming Contest): Circle `#F59E0B`.

### Activity Heatmap Grid
- Matrix of square nodes (`12px` x `12px`, radius `2px`, gap `3px`).
- Intensity levels:
  - Level 0: `#131B2E`
  - Level 1: `rgba(16, 185, 129, 0.2)`
  - Level 2: `rgba(16, 185, 129, 0.45)`
  - Level 3: `rgba(16, 185, 129, 0.7)`
  - Level 4: `#10B981` with `box-shadow: 0 0 6px rgba(16, 185, 129, 0.5)`

### Input Fields & Search Bars
- Dark input cavity: `#0A0D14` background, 1px border `rgba(255, 255, 255, 0.1)`.
- Monospaced typography with placeholder tone `#475569`.
- Integrated shortcut token on the far right (e.g., `⌘K`) rendered in `#334155` background with `#94A3B8` mono text.
- Focus state activates cyan edge stroke `rgba(6, 182, 212, 0.8)` with instant zero-transition highlight.

### Checkboxes & Radios
- Crisp `14px` x `14px` boxes with `2px` corners.
- Inactive: `#0F172A` fill with `rgba(255, 255, 255, 0.2)` stroke.
- Checked: `#06B6D4` fill with solid black checkmark vector.

### AI Insight Banners
- Layered horizontal container with a subtle violet gradient tint (`linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(19, 27, 46, 0.6) 100%)`).
- Left-edge highlight: vertical `2px` accent line in solid `#8B5CF6`.
- Typography combines Geist for headline recommendation and JetBrains Mono for contextual code solutions.