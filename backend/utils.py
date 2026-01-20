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
