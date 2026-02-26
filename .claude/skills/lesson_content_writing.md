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

## Hard Rules

**Word limit:** Max 40 words per slide. Count them. Cut ruthlessly.

**Formatting:**
- Bold ONLY the one key financial term per slide: `**Term**`
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