---
name: implement-stocky-lesson
description: Use when adding a new lesson to Stocky Academy. Covers writing the lesson dict in static_curriculum.py, injecting live data in main.py, wiring the game in LearningFlow.tsx, and creating the game component.
---


# Skill: Stocky Lesson Content Writing Standard

## The Voice
Write like a smart friend texting you about money — not a textbook, not a CFA exam.
Target reader: 16-year-old who's never invested. Short attention span. On a phone.

## The 4-Slide Pattern (every lesson follows this)

| Slide # | Role | Purpose |
|---|---|---|
| 1 | **The Hook** | Personal + real. Must use `{company_name}`. Make it feel like it's about *their* stock. |
| 2 | **The Analogy** | One physical world comparison. No jargon. Make the concept click instantly. |
| 3 | **The Mechanic** | How it actually works. Max 2 sentences. Numbers preferred. |
| 4 | **The Rule** *(optional)* | One bold takeaway. What should they remember 1 week later? |

## ⚠️ CRITICAL: Content Quality Audit Checklist

Before finalising any lesson, verify every slide passes ALL of these checks:

1. **Define before you use** — Every financial acronym or term must be spelled out in full
   on its FIRST appearance. Never drop an acronym cold.
   - ✅ "**Earnings Per Share (EPS)** is..." → then use "EPS" freely after that
   - ❌ "**EPS** is your slice" ← first mention, acronym never defined — FAIL

2. **Connected Hook (when live data exists)** — If the lesson has a live data placeholder
   (`{eps}`, `{beta}`, `{dividendYield}`, etc.), Slide 1 MUST use that real number to
   connect the company directly to the concept. Don't just name the company — show their
   actual data first, then explain what it means.
   - ✅ "**{company_name}**'s EPS is **{eps}** right now. That's how much profit each share earns."
   - ❌ "You searched for **{company_name}**. EPS is how profit is divided among shares." (generic, disconnected)

3. **Analogy is physical** — Not another financial comparison.
   - ✅ pizza, speedboat, lemonade stand
   - ❌ "like a bond", "similar to another stock"

4. **{company_name} on slide 1** — No exceptions.

5. **Word count ≤ 40 per slide** — Count them. Cut ruthlessly.

6. **No banned words** — see Voice Rules below.

7. **correctIndex spread** — see Answer Position Rule in Quiz section.

Run this checklist top-to-bottom on every audit. Fail = fix before moving on.

---

## Hard Rules

**Word limit:** Max 40 words per slide. Count them. Cut ruthlessly.

**Formatting:**
- Bold financial terms only where relevant — use `**Term**` when a term genuinely needs emphasis. Don't force exactly one bold per slide; zero is fine if nothing needs highlighting, and multiple is fine if there are multiple key terms worth calling out.
- Use `\n\n` for paragraph breaks within a slide (rendered as `<br/>`)
- Emoji allowed sparingly — 1 per slide max, only if it aids understanding

**Voice rules:**
- Always use contractions: it's, you're, that's, don't, can't
- Never use: "establishes", "benchmark", "consensus", "relative to", "utilizes",
  "documented", "correlation", "technical", "analytical"
- Every analogy must be physical/tangible (not financial). Good: airports, speedboats,
  lemonade stands, stadiums, rental property. Bad: "like another stock", "like a bond"

## The Reference Standard

These are your BEST slides from the existing lessons. Match this quality:

**Best Hook (Lesson 5 - Market Cap):**
> "**Market Capitalization (Market Cap)** is just the total 'Price Tag' of a company.
> It's simple math: **Stock Price** × **Total Shares** = **Market Cap**."

**Best Analogy (Lesson 5 - Market Cap):**
> "**Small Cap** stocks are like speedboats: they can turn fast (high growth) but get
> rocked by waves (high risk).
> **Mega Cap** stocks (like Apple) are like Ocean Liners: very stable, but hard to turn quickly."

**Best Mechanic (Lesson 8 - Volume):**
> "If a stock price moves up on **High Volume**, it's a strong signal of conviction. If it
> moves up on **Low Volume**, it might be a 'fake-out' because very few people are backing the move."

## Bad Slide Examples (do not write like this)

❌ Lesson 17 original Slide 1:
> "The 52-Week Range establishes the upper and lower price boundaries for {company_name}
> over the last 12 months. It is a technical benchmark used to determine where the current
> price sits relative to the market's one-year consensus."

✅ How it should read:
> "You searched for **{company_name}**. Think of its **52-Week Range** as a yearly
> scoreboard — the high is the best it's ever done, the low is its worst.
> Right now, you can see exactly where **{symbol}** sits on that scoreboard."

## Quiz Writing Rules

- 3–4 questions per lesson
- Question 1: factual ("What is X?")
- Question 2: applied ("If X happens, what does that mean?")
- Question 3: company-specific — must use `{company_name}` or real data
- Wrong options must be funny but plausible — not obviously absurd
- Every question needs an `explanation` field that says *why* the answer is correct

**Good wrong option:** "Because Apple is a fruit" (funny, memorable)
**Bad wrong option:** "The market explodes" (too absurd, teaches nothing)

### ⚠️ CRITICAL: Answer Position Rule — Read This Every Time

**NEVER put the correct answer at index 0 for more than one question in a quiz.**
**NEVER have the same `correctIndex` for two consecutive questions.**

Before finalising any quiz, check all `correctIndex` values together and ensure they are spread across 0, 1, 2, 3.

✅ Good spread — all different positions:
```python
# Q1: correctIndex: 2
# Q2: correctIndex: 0
# Q3: correctIndex: 3
```

❌ Bad — correct answer always at index 0 (a recurring bug):
```python
# Q1: correctIndex: 0
# Q2: correctIndex: 0
# Q3: correctIndex: 0
```

**Required check:** After writing all questions, list out every `correctIndex` and confirm no value repeats across the quiz. If they repeat, reorder the options in the affected question until all positions are unique.

## Dynamic Placeholder Reference

Every lesson MUST feel personal to the stock the user searched for.
Use these placeholders in slide text and quiz questions:

### Frontend-replaced (StepConcept.tsx — always safe to use)
| Placeholder | What it shows |
|---|---|
| `{company_name}` | e.g. "Apple Inc." — full company name |
| `{symbol}` | e.g. "AAPL" — the ticker |
| `{dividendYield}` | e.g. "0.52" — yield as decimal × 100 |

### Backend-injected (main.py — only use if injection handler exists)
| Placeholder | Lesson it's used in |
|---|---|
| `{beta}` | lesson_15_beta |
| `{sharesOutstanding}` | lesson_19_supply_constraint |
| `{floatShares}` | lesson_19_supply_constraint |

### Rules
- Slide 1 (The Hook) MUST contain `{company_name}` — no exceptions
- At least 1 other slide should reference `{company_name}` or `{symbol}`
- NEVER invent a new placeholder (e.g. `{stock_price}`, `{pe_ratio}`) without
  adding the injection handler in main.py first — it will show raw on screen
- If you need a new live data value in a lesson, add it to the backend injection
  block first, THEN reference the placeholder in the slide text

## Sources — Non-Negotiable Rule
Every lesson rewrite MUST include a `sources` field. No exceptions.
It goes at the bottom of the lesson dict, after `quiz`.

These sources will be displayed at the bottom of the carousel slide in the UI.

## Sources — Required for Every Lesson

Add a `sources` list to every lesson dict in `static_curriculum.py`:

```python
"sources": [
    {"name": "Investopedia", "url": "https://www.investopedia.com/terms/m/marketcapitalization.asp", "license": "CC"},
    {"name": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance", "license": "CC BY-NC-SA"}
]

Approved sources (open-licensed):
Source	License	Best for
Investopedia	CC-licensed	Term definitions, all concepts
Khan Academy	CC BY-NC-SA	Explanations, fundamentals
SEC Investor.gov	Public Domain	IPO, earnings reports, regulations
FINRA Investor Education	Public Domain	Risk, diversification