from smart_selector import select_best_concept
from concept_library import StockContext

# Create dummy context
ctx = StockContext(
    symbol="AAPL",
    name="Apple Inc.",
    price=150.0,
    change_percent=1.5,
    volume=50000000,
    avg_volume=45000000,
    market_cap=2500000000000,
    pe_ratio=25.0,
    week_52_high=180.0,
    week_52_low=120.0,
    sector="Technology"
)

# Test selection
print("Calling select_best_concept...")
lesson, meta = select_best_concept(ctx, [])
print(f"Selected Lesson ID: {lesson.get('id') if isinstance(lesson, dict) else lesson.id}")
