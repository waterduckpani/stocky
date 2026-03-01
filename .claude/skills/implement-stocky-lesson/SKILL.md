---
name: lesson-content-writing
description: Use when writing or rewriting slide text and quiz questions for any Stocky lesson. Covers voice standard, 4-slide pattern, word limits, placeholder rules, and bad vs good examples.
---


# Skill: Implement a New Stocky Lesson (v3.0)

## Purpose
The complete contract for adding a lesson to Stocky Academy.
Follow every step in order. Do not skip the checklist.

---

## Step 1 — Define the Lesson in `backend/static_curriculum.py`

Add a new dict to `TIER_1_LESSONS` or `TIER_2_LESSONS`. Required keys:

```python
{
    "id": "lesson_XX_concept_name",       # snake_case, unique
    "title": "Human Readable Title",
    "concept": {
        "name": "Concept Name",
        "type": "carousel",               # always "carousel"
        "slides": [...]                   # 3–4 slides, see lesson_content_writing.md
    },
    "breakdown": "One sentence teaser shown before the lesson starts.",
    "sources": [                          # REQUIRED — open-source citations
        {"name": "Investopedia", "url": "https://www.investopedia.com/terms/x/...", "license": "CC"},
        {"name": "SEC Investor.gov", "url": "https://www.investor.gov/...", "license": "Public Domain"}
    ],
    "news": [],
    "game_config": {
        "type": "game_type_string",       # must match case in LearningFlow.tsx switch block
        "instruction": "What the user sees at the top of the game"
    },
    "quiz": [...]                         # 3–4 questions, see lesson_content_writing.md
}

Placeholder rules:

    Use {company_name}, {symbol} freely — handled in StepConcept.tsx

    Use {beta}, {dividendYield}, {sharesOutstanding}, {floatShares} only if you add
    the injection handler in Step 2

    Never invent new placeholders without handling them in main.py

Step 2 — Add Injection Handler in backend/main.py

In generate_content(), find the if is_static: block and add:

python
elif concept_id == "lesson_XX_concept_name":
    try:
        # Replace placeholders in slides
        if "concept" in selected_concept and "slides" in selected_concept["concept"]:
            for slide in selected_concept["concept"]["slides"]:
                txt = slide.get("text", "")
                slide["text"] = txt.replace("{your_placeholder}", str(your_value))
        
        # Replace placeholders in quiz questions
        if "quiz" in selected_concept:
            for q in selected_concept["quiz"]:
                q_text = q.get("question", "")
                if "{company_name}" in q_text:
                    q["question"] = q_text.replace("{company_name}", company_name)
    except Exception as e:
        print(f"Error injecting lesson_XX data: {e}")

Critical: Always initialise variables at the top of generate_content() before any
try/except block to prevent UnboundLocalError.
Step 3 — Register the Game in frontend/components/ticker/LearningFlow.tsx

In the switch(gameConfig.type) block, add:

tsx
case "your_game_type":
    GameComponent = <YourGame
        onComplete={handleNext}
        ticker={symbol}
        stockData={stockData}
        gameConfig={gameConfig}
    />
    break

Add the import at the top of the file.
Step 4 — Create the Game Component

Create frontend/components/games/YourGame.tsx.
Follow .claude/skills/minigame_component.md exactly.
Step 5 — Add Icon Keys to StepConcept.tsx

If your slides use any icon strings not already in ICON_MAP, add them:

tsx
const ICON_MAP: Record<string, any> = {
    "Target": Target,
    "Store": Store,
    // ... existing
    "YourNewIcon": YourNewIcon  // ← add here, import from lucide-react
}

Current ICON_MAP keys: Target, Store, Scale, Zap, Gem
Everything else silently falls back to Lightbulb.
Implementation Checklist

    Lesson dict added to static_curriculum.py with id, slides, game_config, quiz, sources

    Slide text follows voice standard in lesson_content_writing.md

    Injection handler added in main.py for any {custom_placeholder}

    case "game_type": added to LearningFlow.tsx switch block

    Game component created following minigame_component.md

    New icon strings added to ICON_MAP in StepConcept.tsx

    Tested with AAPL — no raw {placeholder} visible, game completes, quiz loads
