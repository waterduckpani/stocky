# Skill: Playful Geometric Frontend (Antigravity)

This skill provides an exhaustive blueprint for the **Stocky** "Playful Geometric" design system. It ensures zero visual drift by codifying every border-width, shadow-offset, and animation curve used across the repository.

## 1. Core Visual Foundations

### A. The Color System (Source: globals.css)
The palette is built on high-contrast "Inked" lines over organic, warm surfaces.
* **Background (Canvas)**: `#FFFDF5` (Warm Cream).
* **Foreground (Ink)**: `#1E293B` (Deep Slate) used for all primary text and `border-2` outlines.
* **Accents**:
    * **Primary (Emerald)**: `#3BB273`.
    * **Secondary (Sky)**: `#729bf4`.
    * **Tertiary (Amber)**: `#FBBF24`.
    * **Quaternary (Mint)**: `#34D399`.
    * **Destructive (Red)**: `#EF4444`.

### B. Elevation & Shadows (Source: globals.css)
Never use blurred soft shadows. Always use "Hard-Line Pop" shadows.
* **Standard Pop**: `4px 4px 0px 0px #1E293B`.
* **Pop Hover**: `6px 6px 0px 0px #1E293B`.
* **Pop Active**: `2px 2px 0px 0px #1E293B`.
* **Contextual Shadows**:
    * `shadow-pop-violet`: Shadow using `#3BB273`.
    * `shadow-pop-blue`: Shadow using `#729bf4`.
    * `shadow-pop-yellow`: Shadow using `#FBBF24`.
    * `shadow-pop-mint`: Shadow using `#34D399`.

## 2. Component Blueprint

### A. Buttons (Source: button.tsx)
Buttons are the primary interactive element and must feel physical when clicked.

**Base Styling**:
* **Shape**: Always `rounded-full`.
* **Typography**: `text-sm font-bold`.
* **Border**: `border-2 border-primary` (except for Ghost/Link).
* **Interaction Physics**:
    * **Default**: `shadow-hard`.
    * **Hover**: `translate-x-[-2px] translate-y-[-2px] shadow-hard-hover`.
    * **Active**: `translate-x-[2px] translate-y-[2px] shadow-hard-active`.

**Variants**:
* **Default**: `bg-accent text-white hover:bg-accent/90`.
* **Outline**: `bg-background shadow-hard-sm hover:bg-tertiary hover:text-primary-foreground`.
* **Secondary**: `bg-secondary text-secondary-foreground hover:bg-secondary/80`.
* **Destructive**: `bg-destructive text-destructive-foreground hover:bg-destructive/90`.

### B. Cards & Containers (Source: card.tsx, StatsCards.tsx)
Cards should look like physical "stickers" or raised panels.

**Base Styling**:
* **Shape**: `rounded-xl` (1rem).
* **Border**: `border-2 border-primary` (or `border-foreground` for dashboard stats).
* **Elevation**: `shadow-sticker` or `shadow-pop`.
* **Hover Animation**: `duration-300 hover:rotate-[-1deg] hover:scale-[1.02] hover:shadow-sticker-hover`.
* **Padding**: Consistent `px-6` for internal content.

### C. Sidebar & Navigation (Source: Sidebar.tsx)
Navigation items use colored icon containers to break visual monotony.
* **Nav Link**: `flex items-center gap-3 px-4 py-3 rounded-xl transition-bounce border-2`.
* **Inactive State**: `border-transparent hover:border-foreground/20 hover:bg-muted`.
* **Active State**: `bg-primary text-primary-foreground border-foreground shadow-pop`.
* **Icon Containers**: `h-10 w-10 rounded-full flex items-center justify-center` with specific color pairs (e.g., `bg-violet-100 text-violet-600`).

## 3. Motion & Animation (Source: globals.css)

All movement must follow the "Bounce" curve to feel playful rather than mechanical.

* **The Global Curve**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (found in `.transition-bounce`).
* **Animations**:
    * **pop-in**: Scale `0` -> `1.1` -> `1`. Used for new cards and trophies.
    * **wiggle**: 0% -> 25% (3deg) -> 75% (-3deg) -> 100%. Used for subtle attention-grabbing.
    * **bounce**: Standard vertical bounce for high-energy icons (like the Trophy).

## 4. Game UI Patterns (Source: MarketSort.tsx, CompoundEngine.tsx)

* **Progress Bars**: `h-3 bg-muted rounded-full overflow-hidden` with a `rounded-full` fill using an accent color (`bg-primary` or `bg-quaternary`).
* **Status Overlays**: During gameplay, provide instant feedback via `absolute inset-0` overlays with `backdrop-blur-sm`.
    * **Correct**: `text-quaternary` icon with a `zoom-in` animation.
    * **Wrong**: `text-destructive` icon with a `zoom-in` animation.
* **Game Headers**: Centralized timer/score in a `bg-white/90 border-2 border-foreground px-4 py-1 rounded-full` pill.
* **Interactions**: Use `framer-motion` for `drag` behavior with `dragElastic={0.2}` and `whileTap={{ scale: 0.95 }}`.

## 5. Typography Standards (Source: layout.tsx, globals.css)

* **Headings**: `Outfit` font variable (`--font-heading`). Applied to `h1` through `h6`.
* **Body Content**: `Plus Jakarta Sans` font variable (`--font-body`). Applied to the `body` tag with `antialiased`.
* **Weighting**: Use `font-black` (900) or `font-extrabold` (800) for headers to emphasize the "Geometric" look.