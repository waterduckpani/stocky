from typing import Optional

def validate_and_fix_text(text: Optional[str]) -> Optional[str]:
    """
    Check if text ends with punctuation.
    Returns text if valid, None if cutoff.
    """
    if not text:
        return None
    
    text = text.strip()
    
    # Check for sentence ending punctuation
    if text.endswith(('.', '!', '?', '"', "'")):
        return text
        
    return None

def format_large_number(num):
    """
    Format large numbers into readable K, M, B, T strings.
    """
    if not num:
        return "0"
        
    if num >= 1_000_000_000_000:
        return f"{num / 1_000_000_000_000:.2f}T"
    elif num >= 1_000_000_000:
        return f"{num / 1_000_000_000:.2f}B"
    elif num >= 1_000_000:
        return f"{num / 1_000_000:.2f}M"
    else:
        return str(num)
