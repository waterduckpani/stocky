
import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from smart_selector import select_best_concept
from static_curriculum import TIER_1_LESSONS
from concept_library import StockContext

# Mock Context
context = StockContext(
    symbol="NVDA",
    name="Nvidia Corp",
    price=135.0,
    change_percent=2.5,
    market_cap=3000000000,
    pe_ratio=75.0,
    sector="Technology",
    beta=1.5,
    avg_volume=50000000
)

# Force empty history to trigger "Beginner Mode"
print("🔍 Testing Lesson Selection...")
lesson, _ = select_best_concept(context, [])

print(f"\n✅ Selected ID: {lesson['id']}")
print(f"✅ Title: {lesson['title']}")
print(f"✅ Game Type: {lesson['game_config']['type']}")

if lesson['id'] == "lesson_3_supply_demand":
    print("\n🎉 SUCCESS: Lesson 3 is active!")
else:
    print(f"\n❌ FAILURE: Expected 'lesson_3_supply_demand', got '{lesson['id']}'")
