#!/usr/bin/env python3
"""
Quick test to verify the video auto-cut ObjectId issue
"""

import requests
import json

BASE_URL = "https://brasil-redes-pay.preview.emergentagent.com/api"
TEST_USER_EMAIL = "test@hgl.com"
TEST_USER_PASSWORD = "testpassword123"

def test_video_autocut_issue():
    """Test the specific video auto-cut issue"""
    
    # Login first
    login_data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code != 200:
        print("❌ Login failed")
        return
    
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try auto-cut with a non-existent video ID to see the error
    fake_video_id = "test-video-id"
    response = requests.post(f"{BASE_URL}/video/auto-cut/{fake_video_id}", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_video_autocut_issue()