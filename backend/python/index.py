import os
import json
import time
from typing import Dict, Any

def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while (i * i) <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    print(f"event: {event}")
    start_time = time.time_ns()  # Start time in nanoseconds
    
    cloudfront_url = os.getenv("CLOUDFRONT_URL", "https://default-cloudfront-url.com")
    
    # Define allowed origins
    allowed_origins = [
        cloudfront_url,
        "http://localhost:3000"
    ]
    
    # Get request origin
    origin = event.get("headers", {}).get("origin", "")
    is_allowed_origin = origin in allowed_origins
    
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    
    if is_allowed_origin:
        headers["Access-Control-Allow-Origin"] = "*"

        # Perform long-running prime number calculation
        count = 0
        for number in range(1, 10**6 + 1):
            if is_prime(number):
                count += 1
        
        execution_time_ns = time.time_ns() - start_time

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "message": "Hello from Python Lambda!",
                "const": count,
                "execution_time_ns": execution_time_ns
            })
        }
    else:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({
                "error": "Origin not allowed"
            })
        }