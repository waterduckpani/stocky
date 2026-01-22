
import sys
import os

sys.path.append(os.path.join(os.getcwd(), "backend"))

from prompts import QUIZ_PROMPT
from smart_selector import select_best_concept, StockContext

# Mock Context for Apple
context = StockContext(
    symbol="AAPL",
    name="Apple Inc.",
    price=150.0,
    change_percent=2.5,
    volume=100000,
    avg_volume=90000,
    market_cap=2500000000000
)

# Run selector
selected_concept, metadata = select_best_concept(context, [])
print("Concept selected:", selected_concept["title"])

# Mimic main.py extraction of lesson text
raw_concept = selected_concept["concept"]
slides = raw_concept.get("slides", [])
lesson_text = " ".join([s.get("text", "") for s in slides])

print("\n--- LESSON TEXT ---")
print(lesson_text)
print("\n-------------------")

# Try to format prompt
try:
    print("Formatting prompt...")
    prompt = QUIZ_PROMPT.format(
        company_name="Apple Inc.",
        symbol="AAPL",
        concept_name="The Ticker Symbol",
        change_info="2.5% up today",
        lesson_text=lesson_text
    )
    print("SUCCESS! Prompt length:", len(prompt))
except Exception as e:
    print("CRASHED formatting prompt:")
    print(e)
