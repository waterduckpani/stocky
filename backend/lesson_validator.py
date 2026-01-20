"""
Lesson Validator: Pre-flight quality checks for AI-generated content.

Validation Rules:
1. Length: > 50 words
2. Formatting: Contains markdown (** or #)
3. Topic Anchor: Concept name appears in text
"""

import re
from dataclasses import dataclass
from typing import Optional


@dataclass
class ValidationResult:
    """Result of content validation."""
    passed: bool
    issues: list[str]
    word_count: int
    has_formatting: bool
    has_topic: bool


def validate_lesson(
    content: str,
    concept_name: str,
    min_words: int = 50
) -> ValidationResult:
    """
    Validate AI-generated lesson content.
    
    Args:
        content: The generated lesson text
        concept_name: Expected topic to appear in content
        min_words: Minimum word count required
    
    Returns:
        ValidationResult with pass/fail and issues
    """
    issues = []
    
    # Check 1: Length
    words = content.split()
    word_count = len(words)
    length_ok = word_count >= min_words
    if not length_ok:
        issues.append(f"Too short: {word_count} words (need {min_words}+)")
    
    # Check 2: Markdown formatting
    has_bold = "**" in content
    has_header = "#" in content
    has_formatting = has_bold or has_header
    if not has_formatting:
        issues.append("Missing markdown formatting (no ** or #)")
    
    # Check 3: Topic anchor
    # Check for concept name or key words from it
    concept_lower = concept_name.lower()
    content_lower = content.lower()
    
    # Extract key words from concept name (skip common words)
    skip_words = {"the", "and", "or", "a", "an", "in", "of", "to", "vs", "for"}
    concept_keywords = [w for w in concept_lower.split() if w not in skip_words]
    
    # Check if any keyword appears
    has_topic = any(kw in content_lower for kw in concept_keywords)
    if not has_topic:
        issues.append(f"Topic not mentioned: '{concept_name}'")
    
    # Check 4: Tone Check (Banned Phrases)
    banned_phrases = ["consider how you want", "ask yourself"]
    found_banned = [phrase for phrase in banned_phrases if phrase in content.lower()]
    if found_banned:
        issues.append(f"Tone check failed: Found banned phrase(s) {found_banned}")

    passed = length_ok and has_formatting and has_topic and not found_banned
    
    return ValidationResult(
        passed=passed,
        issues=issues,
        word_count=word_count,
        has_formatting=has_formatting,
        has_topic=has_topic
    )


def validate_breakdown(
    content: str,
    stock_name: str,
    concept_name: str
) -> ValidationResult:
    """
    Validate AI-generated breakdown content.
    """
    issues = []
    
    # Check 1: Minimum length (3 sentences, ~30 words)
    words = content.split()
    word_count = len(words)
    length_ok = word_count >= 30
    if not length_ok:
        issues.append(f"Too short: {word_count} words (need 30+)")
    
    # Check 2: Contains stock name or symbol
    content_lower = content.lower()
    stock_lower = stock_name.lower()
    has_stock = stock_lower in content_lower
    if not has_stock:
        issues.append(f"Stock not mentioned: '{stock_name}'")
    
    # Check 3: Contains concept bridge
    concept_lower = concept_name.lower()
    concept_keywords = [w for w in concept_lower.split() if len(w) > 2]
    has_topic = any(kw in content_lower for kw in concept_keywords)
    if not has_topic:
        issues.append(f"Missing concept bridge to: '{concept_name}'")
    
    passed = length_ok and has_stock and has_topic
    
    return ValidationResult(
        passed=passed,
        issues=issues,
        word_count=word_count,
        has_formatting=True,  # Breakdown doesn't require markdown
        has_topic=has_topic
    )


async def generate_with_retry(
    generate_fn,
    validate_fn,
    max_retries: int = 2
) -> tuple[str, ValidationResult, int]:
    """
    Generate content with retry on validation failure.
    
    Args:
        generate_fn: Async function that generates content
        validate_fn: Function that validates content
        max_retries: Maximum retry attempts
    
    Returns:
        Tuple of (content, validation_result, attempt_count)
    """
    for attempt in range(max_retries + 1):
        content = await generate_fn()
        result = validate_fn(content)
        
        if result.passed:
            return content, result, attempt + 1
    
    # Return last attempt even if failed
    return content, result, max_retries + 1
