
import sys
import os

# Add current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_selector import select_best_concept
from concept_library import StockContext

def test_lesson_5_dynamic():
    print("=== Testing Lesson 5 Dynamic Injection ===")
    
    # Mock Context: Apple (Mega Cap)
    # Market Cap: 3 Trillion
    aapl_context = StockContext(
        symbol="AAPL",
        name="Apple Inc",
        price=200.0,
        change_percent=1.5,
        market_cap=3_000_000_000_000, 
        pe_ratio=30.0,
        dividend_yield=0.05,
        avg_volume=1000000,
        sector="Technology",
        week_52_high=220.0,
        week_52_low=150.0
    )
    
    # Mock Context: Rivian (Small/Mid Cap for this purpose)
    # Logic: < 2B is Small, < 10B is Mid, < 200B is Large.
    small_context = StockContext(
        symbol="TINY",
        name="Tiny Corp",
        price=10.0,
        change_percent=-5.0,
        market_cap=1_000_000_000, # 1 Billion
        pe_ratio=None,
        dividend_yield=None,
        avg_volume=50000,
        sector="Small Stuff",
        week_52_high=15.0,
        week_52_low=5.0
    )

    print("\n--- TEST CASE 1: AAPL (Mega Cap) ---")
    lesson, meta = select_best_concept(aapl_context, [])
    
    print(f"Lesson ID: {lesson['id']}")
    print(f"Slide 2 Text: {lesson['concept']['slides'][1]['text']}")
    print(f"Game Config Category: {lesson['game_config'].get('category')}")
    
    # Check if injection happened
    if "Ocean Liner" in lesson['concept']['slides'][1]['text'] and "AAPL" in lesson['concept']['slides'][1]['text']:
        print("✅ SUCCESS: Dynamic Text Injected for AAPL")
    else:
        print("❌ FAILURE: Static Text Found for AAPL")

    print("\n--- TEST CASE 2: TINY (Small Cap) ---")
    lesson_small, meta_small = select_best_concept(small_context, [])
    
    print(f"Slide 2 Text: {lesson_small['concept']['slides'][1]['text']}")
    print(f"Game Config Category: {lesson_small['game_config'].get('category')}")
    
    if "Speedboat" in lesson_small['concept']['slides'][1]['text'] and "TINY" in lesson_small['concept']['slides'][1]['text']:
        print("✅ SUCCESS: Dynamic Text Injected for TINY")
    else:
        print("❌ FAILURE: Static Text Found for TINY")

if __name__ == "__main__":
    test_lesson_5_dynamic()
