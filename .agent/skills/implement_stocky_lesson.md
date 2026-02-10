# Skill: Implement Stocky Academy Lesson (v2.1)

## Purpose
To generate consistent, high-quality, and reliable educational content for Stocky Academy.
This skill defines the contract for implementing a new lesson from backend logic to frontend user experience.

---

## 1. The "Golden Thread" of Data (CRITICAL)
Data must flow seamlessly from Backend -> API -> LearningFlow -> Game Component.
Any break in this chain results in broken lessons.

### Backend (`main.py`)
- **Initialize Variables Early**: ALWAYS initialize variables used in `try/except` blocks (like `div_rate = None`) at the top of the function scope to prevent `UnboundLocalError`.
- **Pre-Inject Dynamic Values**:
  - Do NOT rely on frontend string replacement.
  - In `generate_content`, add a specific handler for the `concept_id` (e.g., `if concept_id == "lesson_15_beta":`).
  - Explicitly replace `{placeholder}` in `slides` text and `quiz` questions with `stock_context` values (e.g., `beta`, `company_name`).
  - Example:
    ```python
    if "{company_name}" in q_text:
        q_text = q_text.replace("{company_name}", stock_context.name)
    ```

### Frontend (`LearningFlow.tsx`)
- **Explicit Prop Passing**:
  - In the `switch(gameConfig.type)` block, ALWAYS pass:
    - `ticker={symbol}`
    - `stockData={stockData}`
    - `gameConfig={gameConfig}`
  - Do NOT rely on implicit context or generic props.

### Game Component (`frontend/components/games/`)
- **Props Interface**: Define a clear Interface accepting `ticker`, `stockData`, and `onComplete`.
- **Use Real Data**: Display `{ticker}` (e.g., "AAPL") instead of "YOU". Use `stockData` values for game logic.

---

## 2. Design System: "Playful Geometry"
The UI must feel premium, tactile, and fun. **Strictly follow these rules:**

### Buttons & Intent
- **Primary Action (Next/Continue)**:
  - Class: `w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2`
  - Icon: Usually `<ArrowRight className="w-5 h-5" strokeWidth={3} />`
- **Secondary Action (Back)**:
  - Class: `bg-muted hover:bg-muted/80 text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none rounded-xl font-bold`

### Typography & Layout
- **Font**: Use simple sans-serif defaults (Inter/Geist) via Tailwind.
- **Headers**: `text-2xl font-black` for main titles.
- **Containers**: Use `rounded-xl` for cards and game areas.
- **Shadows**: Use `shadow-pop` for interactive elements to give a "pressable" feel.

### Animations (Framer Motion)
- **Loops**: Use `useTime()` for infinite, smooth loops (e.g., rotating loading states).
  - Avoid `useTransform` mapped to scroll or clamped ranges if the animation must loop forever.
- **Transitions**: Use `layout` prop for smooth rearrangements.
- **Feedback**: Use non-blocking, quick animations (0.3s-0.5s) for success states.

---

## 3. Educational Content Guidelines
- **Placeholder Syntax**: Use clear keys: `{beta}`, `{company_name}`, `{dividend_yield}`.
- **Tone**: Professional but Accessible. Use strong analogies (e.g., "Market is the Lead Runner", "Beta is the Shadow").
- **Quiz**:
  - Questions MUST be relevant to the specific stock (use `{company_name}`).
  - Options MUST be distinct and educational.
  - Explanation MUST clarify *why* the answer is correct.

---

## 4. Implementation Checklist
When implementing a new lesson, check these off:

1. [ ] **Define Lesson**: Add entry in `backend/static_curriculum.py` with `id`, `slides`, `game_config`, and `quiz`.
2. [ ] **Backend Handler**: Add logic to `backend/main.py` -> `generate_content` to handle the specific `concept_id` and inject dynamic data.
3. [ ] **Frontend Route**: Update `frontend/components/ticker/LearningFlow.tsx` to include the `case "game_type":` block passing all props.
4. [ ] **Game Component**: Create or Update `frontend/components/games/{GameName}.tsx` using "Playful Geometry" styles.
5. [ ] **Verify**: Test with a real ticker (e.g., AAPL) to ensure placeholders are replaced and no errors occur.