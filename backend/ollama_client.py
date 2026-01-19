"""
Ollama API Client for LLM content generation.
Connects to local Ollama server for generating stock explanations.
"""
import os
import httpx
import json
from typing import Optional

# Configuration from environment variables
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://100.75.28.19:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "30"))  # seconds


async def generate_text(prompt: str, max_tokens: int = 200) -> Optional[str]:
    """
    Generate text using Ollama API.
    
    Args:
        prompt: The prompt to send to the model
        max_tokens: Maximum tokens in response
        
    Returns:
        Generated text or None if failed
    """
    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": 0.7,
                    }
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "").strip()
            else:
                print(f"Ollama error: {response.status_code} - {response.text}")
                return None
                
    except httpx.TimeoutException:
        print(f"Ollama timeout after {OLLAMA_TIMEOUT}s")
        return None
    except Exception as e:
        print(f"Ollama connection error: {e}")
        return None


async def generate_json(prompt: str) -> Optional[dict]:
    """
    Generate JSON response from Ollama.
    Parses the response as JSON.
    """
    # Add JSON instruction to prompt
    json_prompt = prompt + "\n\nRespond ONLY with valid JSON, no other text."
    
    text = await generate_text(json_prompt, max_tokens=500)
    if not text:
        return None
    
    # Try to parse JSON
    try:
        # Find JSON in response (sometimes model adds extra text)
        start = text.find('[') if '[' in text else text.find('{')
        end = text.rfind(']') + 1 if ']' in text else text.rfind('}') + 1
        
        if start >= 0 and end > start:
            json_str = text[start:end]
            return json.loads(json_str)
        else:
            return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"Failed to parse Ollama JSON: {e}")
        print(f"Raw response: {text}")
        return None


async def check_connection() -> bool:
    """Check if Ollama server is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{OLLAMA_HOST}/api/tags")
            return response.status_code == 200
    except:
        return False
