# Skill: Stocky UI Design System — "Playful Geometry"

## Core Philosophy
Premium, tactile, fun. Every interactive element should feel like it can be physically
pressed. Cards have weight. Buttons have depth. Feedback is immediate.

## Color Tokens (use CSS vars, not raw hex)

| Token | Use |
|---|---|
| `bg-primary` | Main action, highlights, progress bars |
| `text-primary-foreground` | Text on primary background |
| `bg-secondary` | Icon backgrounds, badges |
| `bg-muted` | Inactive states, back buttons, disabled |
| `bg-card` | Card surfaces |
| `bg-background` | Page background |
| `text-foreground` | All body text |
| `text-muted-foreground` | Hints, labels, secondary text |
| `border-foreground` | All card/component borders |
| `border-foreground/10` | Subtle dividers |

**Never use raw Tailwind colours (blue-500, gray-200) in lesson or game components.**
Always use the semantic tokens above.

## Shadow System

`shadow-pop` is the signature shadow — a hard offset that gives a "lifted" feel.
It's defined in your Tailwind config. Use it on all interactive cards and primary buttons.

shadow-pop → cards, primary buttons (full depth)
shadow-sm → icon containers, secondary elements
shadow-none → hover/active state (element "presses in")

text

## Typography Scale

| Class | Use |
|---|---|
| `text-2xl font-black` | Page/section headers |
| `text-xl font-bold` | Card titles, slide headers |
| `text-lg font-medium` | Body text, slide content |
| `text-sm font-bold` | Labels, badges, metadata |
| `text-xs` | Fine print only |

Font family for headers: `style={{ fontFamily: 'var(--font-heading)' }}`
Body uses default system sans (Inter/Geist via Tailwind).

## Button Classes (copy-paste exact)

**Primary (Next/Continue/Submit):**
```tsx
className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold 
           shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all 
           flex items-center justify-center gap-2"

Secondary (Back/Cancel):

tsx
className="flex-1 py-4 bg-muted hover:bg-muted/80 text-foreground 
           shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none 
           rounded-xl font-bold flex items-center justify-center gap-2 transition-all"

Disabled state:

tsx
className="opacity-50 cursor-not-allowed shadow-none"

Icon on primary button: Always <ArrowRight className="w-5 h-5" strokeWidth={3} />
Card / Container Pattern

Standard card:

tsx
className="bg-card rounded-3xl border-2 border-foreground shadow-pop p-8"

Game interaction card (tappable):

tsx
className="bg-card rounded-xl border-2 border-foreground shadow-pop p-4 
           hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"

Muted info panel:

tsx
className="bg-muted/50 rounded-2xl p-6 border border-foreground/5"

Pill/badge:

tsx
className="px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20 
           text-primary font-bold text-sm"

Icon Container (slide header, labels)

tsx
className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center 
           justify-center border-2 border-foreground shadow-sm"

For larger icons (full-width hero):

tsx
className="w-14 h-14 rounded-full bg-secondary text-white flex items-center 
           justify-center border-2 border-foreground shadow-pop"

Progress Indicators

Dot progress (carousel):

tsx
// Active dot
className="h-2 w-8 rounded-full bg-primary border border-foreground/10"
// Inactive dot  
className="h-2 w-2 rounded-full bg-muted/50 border border-foreground/10"

Linear progress bar:

tsx
<div className="h-3 bg-muted rounded-full overflow-hidden">
    <div
        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
        style={{ width: `${progress}%` }}
    />
</div>

Framer Motion Patterns

Page/card entrance:

tsx
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.3 }}

Scale pop (success state):

tsx
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.4, ease: "backOut" }}

List item stagger:

tsx
// Parent
<motion.div variants={container} initial="hidden" animate="visible">
// Child
<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>

Never use: animate={{ x: value }} for infinite loops — use useTime() instead.
Dark Mode

The app has a mode-toggle.tsx (light/dark). All components MUST use semantic tokens
only — never hardcode text-slate-900 or text-white on text that must be readable
in both modes. Check StepConcept.tsx — it has a bug: text-slate-900 hardcoded
on carousel body text, which breaks in dark mode.
Spacing Rhythm

    Card padding: p-8 (desktop), p-6 (mobile)

    Section gap: space-y-4 between cards, space-y-6 between sections

    Bottom of page: pb-24 to clear the fixed navigation bar
