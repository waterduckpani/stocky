
import sys
import os

# Ensure backend dir is in python path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from concept_library import StockContext
from smart_selector import select_best_concept

# Mock Context
context = StockContext(
    symbol="AAPL",
    name="Apple Inc.",
    price=150.0,
    change_percent=2.5,
    volume=100000,
    avg_volume=90000,
    market_cap=2500000000000
)

# Mock History
history = []

try:
    print("Running select_best_concept...")
    result, metadata = select_best_concept(context, history)
    print("Success!")
    print(metadata)
except Exception as e:
    print("CRASHED:")
    import traceback
    traceback.print_exc()
