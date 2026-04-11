# Stocky — Framer Style Guide
## "Playful Geometry" Design System

---

## Philosophy

Premium, tactile, fun. Every interactive element should feel like it can be physically pressed.
Cards have weight. Buttons have depth. Feedback is immediate. This is achieved through a
hard-offset shadow system — no blurry drop shadows, only flat offset shapes that simulate depth.

---

## Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Page Background | Warm Cream | `#FFFDF5` | Page/section backgrounds |
| Foreground | Dark Navy | `#1E293B` | All body text, borders, shadows |
| Card Surface | White | `#FFFFFF` | Card and panel backgrounds |
| Primary | Leaf Green | `#3BB273` | CTAs, highlights, progress, links |
| Primary Text | White | `#FFFFFF` | Text on green backgrounds |
| Secondary | Cornflower Blue | `#729BF4` | Icon backgrounds, badges, accents |
| Secondary Text | White | `#FFFFFF` | Text on blue backgrounds |
| Tertiary | Amber | `#FBBF24` | Warnings, stars, highlights |
| Tertiary Text | Dark Navy | `#1E293B` | Text on amber backgrounds |
| Quaternary | Mint | `#34D399` | Success states, positive indicators |
| Muted | Light Slate | `#F1F5F9` | Inactive states, back buttons, disabled |
| Muted Text | Slate | `#64748B` | Hints, labels, secondary text |
| Border | Pale Blue-Grey | `#E2E8F0` | Subtle dividers, input borders |
| Destructive | Red | `#EF4444` | Errors, destructive actions |

> **Rule:** Never use off-system colours. All colours come from this palette. No ad-hoc greys or blues.

---

## Typography

### Typefaces

| Role | Font | Fallback |
|---|---|---|
| Headings (h1–h6) | **Outfit** | system-ui, sans-serif |
| Body / UI | **Plus Jakarta Sans** | system-ui, sans-serif |
| Monospace / Data | **Geist Mono** | monospace |

Both are available free on Google Fonts.

### Scale

| Usage | Size | Weight | Notes |
|---|---|---|---|
| Page title / Hero | 32–40px | 900 (Black) | Outfit, tight leading |
| Section header | 24px | 900 (Black) | Outfit |
| Card title / Slide header | 20px | 700 (Bold) | Outfit |
| Body text | 18px | 500 (Medium) | Plus Jakarta Sans |
| Labels / Badges | 14px | 700 (Bold) | Plus Jakarta Sans, all-caps optional |
| Fine print | 12px | 400 | Plus Jakarta Sans |

### Line Height
- Headers: 1.1–1.2 (tight)
- Body: 1.6 (comfortable)

---

## Shadow System

The defining visual trait of Stocky UI. All shadows are **hard, offset, no blur** — giving
elements a physical, pressable feel. In Framer, set Box Shadow to:

| Name | Value | Usage |
|---|---|---|
| **shadow-pop** | `4px 4px 0px #1E293B` | Cards, primary buttons (default resting state) |
| **shadow-pop-hover** | `6px 6px 0px #1E293B` | On hover (lifts slightly) |
| **shadow-pop-active** | `2px 2px 0px #1E293B` | On press (pushes in) |
| **shadow-pop-green** | `4px 4px 0px #3BB273` | Cards accented with green |
| **shadow-pop-blue** | `4px 4px 0px #729BF4` | Cards accented with blue |
| **shadow-pop-yellow** | `4px 4px 0px #FBBF24` | Cards accented with amber |
| **shadow-pop-mint** | `4px 4px 0px #34D399` | Cards accented with mint |
| **shadow-soft** | `8px 8px 0px #E2E8F0` | Decorative background elements |
| **no shadow** | `none` | Hover/active "pressed in" state |

### Press Animation (Framer)
When a button or card is hovered/pressed, combine:
- `y: +2` (translate down)
- Remove box shadow (shadow-none)

This simulates the element being physically pushed down.

---

## Border Radius

| Name | Value | Usage |
|---|---|---|
| Small | `8px` | Input fields, small chips |
| Medium | `16px` | Buttons, small cards |
| Large | `24px` | Standard cards |
| XL | `32px` | Hero cards, feature panels |
| Full | `9999px` | Pills, badges, dot indicators |

> Cards use **`32px`** radius with **`2px border`** in `#1E293B`. This chunky border is non-negotiable — it's what gives elements their illustrated, tactile look.

---

## Buttons

### Primary Button (CTA / Next / Submit)

| Property | Value |
|---|---|
| Background | `#3BB273` |
| Text | `#FFFFFF` |
| Font | Plus Jakarta Sans, 16px, Bold |
| Padding | `16px 24px` |
| Border Radius | `16px` |
| Border | `2px solid #1E293B` |
| Box Shadow | `4px 4px 0px #1E293B` |
| **Hover** | `y: +2px`, box shadow `none` |
| Width | Full-width in mobile, auto in desktop |

### Secondary Button (Back / Cancel)

| Property | Value |
|---|---|
| Background | `#F1F5F9` |
| Text | `#1E293B` |
| Font | Plus Jakarta Sans, 16px, Bold |
| Padding | `16px 24px` |
| Border Radius | `16px` |
| Border | `2px solid #1E293B` |
| Box Shadow | `4px 4px 0px rgba(0,0,0,0.2)` |
| **Hover** | `y: +2px`, box shadow `none` |

### Disabled State

| Property | Value |
|---|---|
| Opacity | `50%` |
| Box Shadow | `none` |
| Cursor | Not-allowed |

---

## Cards

### Standard Card

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Border | `2px solid #1E293B` |
| Border Radius | `32px` |
| Box Shadow | `4px 4px 0px #1E293B` |
| Padding | `32px` (desktop), `24px` (mobile) |

### Tappable / Interactive Card

Same as standard card, plus:
| Property | Value |
|---|---|
| Cursor | Pointer |
| **Hover** | `y: +2px`, box shadow `none` |

### Muted Info Panel

| Property | Value |
|---|---|
| Background | `#F1F5F9` at 50% opacity |
| Border | `1px solid rgba(30,41,59,0.05)` |
| Border Radius | `24px` |
| Padding | `24px` |
| Box Shadow | None |

### Pill / Badge

| Property | Value |
|---|---|
| Background | `#3BB273` at 10% opacity |
| Border | `2px solid #3BB273` at 20% opacity |
| Text | `#3BB273`, Bold, 14px |
| Padding | `8px 16px` |
| Border Radius | `9999px` |

---

## Icon Containers

### Standard (used beside labels, in lists)

| Property | Value |
|---|---|
| Size | `48 × 48px` |
| Background | `#729BF4` (Secondary blue) |
| Icon Color | `#FFFFFF` |
| Border | `2px solid #1E293B` |
| Border Radius | `16px` |
| Box Shadow | `2px 2px 0px #1E293B` |

### Hero (full-width feature icons)

| Property | Value |
|---|---|
| Size | `56 × 56px` |
| Background | `#729BF4` |
| Icon Color | `#FFFFFF` |
| Border | `2px solid #1E293B` |
| Border Radius | `9999px` (circle) |
| Box Shadow | `4px 4px 0px #1E293B` |

---

## Progress Indicators

### Dot Progress (carousel / steps)

| State | Shape | Size | Color | Border |
|---|---|---|---|---|
| Active | Pill | `32 × 8px` | `#3BB273` | `1px solid rgba(30,41,59,0.1)` |
| Inactive | Circle | `8 × 8px` | `#F1F5F9` | `1px solid rgba(30,41,59,0.1)` |

### Linear Progress Bar

| Property | Value |
|---|---|
| Track height | `12px` |
| Track color | `#F1F5F9` |
| Track border radius | `9999px` |
| Fill color | `#3BB273` |
| Fill animation | Width transition, `500ms ease-out` |

---

## Spacing Rhythm

| Context | Value |
|---|---|
| Card internal padding (desktop) | `32px` |
| Card internal padding (mobile) | `24px` |
| Gap between cards | `16px` |
| Gap between sections | `24px` |
| Page bottom padding | `96px` (clears fixed nav) |
| Page horizontal padding | `16px` (mobile), `24px` (desktop) |

---

## Motion & Animation

All animations should feel **snappy, physical, and confident** — not slow or floaty.

### Page / Card Entrance
```
Initial: opacity 0, x +20px
Animate: opacity 1, x 0
Duration: 300ms
Easing: Ease Out
```

### Scale Pop (success states, confirmations)
```
Initial: scale 0.8, opacity 0
Animate: scale 1, opacity 1
Duration: 400ms
Easing: Back Out (overshoot spring)
```

### List Item Stagger
```
Each item: opacity 0, y +20px → opacity 1, y 0
Delay: 80ms per item
Duration: 300ms
Easing: Ease Out
```

### Button Press
```
Hover/Press: y +2px, box-shadow none
Release: y 0, box-shadow restored
Duration: 150ms
Easing: Ease Out
```

### Bounce Transition (interactive elements)
```
Easing curve: cubic-bezier(0.34, 1.56, 0.64, 1)
Duration: 300ms
```

### Wiggle (error / attention)
```
Keyframes: 0%=0°, 25%=+3°, 75%=-3°, 100%=0°
Duration: 300ms
Easing: Ease In Out
```

### Pop In (badges, checkmarks)
```
Keyframes: 0%=scale(0) opacity(0), 70%=scale(1.1), 100%=scale(1) opacity(1)
Duration: 400ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## Page Background Treatment

- Base color: `#FFFDF5` (warm cream, not pure white)
- No gradients on the main background
- Decorative elements (background shapes, blobs) can use `#E2E8F0` soft shadows or very low-opacity fills from the palette
- No dot grids or noise textures

---

## Quick Reference Cheatsheet

```
Background:  #FFFDF5
Text:        #1E293B
Card:        #FFFFFF
Primary:     #3BB273
Secondary:   #729BF4
Amber:       #FBBF24
Mint:        #34D399
Muted:       #F1F5F9
Muted text:  #64748B
Border:      #E2E8F0
Red:         #EF4444

Shadow:      4px 4px 0px #1E293B  (no blur)
Border:      2px solid #1E293B
Radius:      32px (cards), 16px (buttons), 9999px (pills)

Font H:      Outfit, Black (900)
Font Body:   Plus Jakarta Sans, Medium/Bold
```
