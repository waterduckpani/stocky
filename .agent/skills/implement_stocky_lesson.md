# Skill: Implement Stocky Academy Lesson (v2.0)

## Purpose
To generate consistent, high-quality educational content and components for Stocky Academy following the **Geometric** design system.

## Style Guard (CRITICAL)
1. **No Custom CSS:** Do NOT create `.css` or `.module.css` files. 
2. **Global Variables Only:** Use Tailwind classes that reference the variables in `frontend/app/globals.css` (e.g., `bg-background`, `text-primary`, `border-border`).
3. **The Geometric Rule:** - **Corners:** Use `rounded-none` or `rounded-sm`. Never use large rounds like `rounded-xl`.
   - **Borders:** Use `border-2` or `border-[1px]` with `border-primary` for high-contrast, sharp definition.
   - **Shadows:** Avoid soft shadows. If depth is needed, use hard "neo-brutalism" offsets (e.g., `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
4. **Consistency Reference:** Check `frontend/components/games/ValuationStation.tsx` or `IPOLaunchSimulator.tsx` before writing code to match their layout and button styling.

## Component Template
```tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // Use existing UI components

export const ProfitPunch = ({ totalRevenue, netIncome }) => {
  // Use simple state and Tailwind for layout
  return (
    <div className="border-2 border-primary p-6 bg-card rounded-none">
       {/* UI implementation here */}
    </div>
  );
};

## JSON Structure Template
```python
{
    "id": "lesson_{number}_{name}",
    "title": "{Lesson Title}",
    "concept": {
        "name": "{Concept Name}",
        "category": "{market_mechanics | market_psychology | risk_management}",
        "type": "carousel",
        "slides": [
            { "title": "The Context", "text": "Personalized to {company_name} and {symbol}.", "icon": "..." },
            { "title": "The Analogy", "text": "Real-world comparison.", "icon": "..." },
            { "title": "The Mechanic", "text": "How it works in the market.", "icon": "..." }
        ]
    },
    "game_config": {
        "type": "{unique_game_id}",
        "instruction": "{Clear action-based instruction}"
    },
    "quiz": [
        { 
            "question": "...", 
            "options": [], 
            "correctIndex": 0, 
            "explanation": "..." 
        }
    ]
}