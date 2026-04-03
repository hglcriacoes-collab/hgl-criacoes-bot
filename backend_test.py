#!/usr/bin/env python3
"""
HGL System Backend Testing Suite
Tests all backend functionalities including auth, video processing, and Kwai integration
"""

import requests
import json
import os
import tempfile
import time
from pathlib import Path

# Configuration
BASE_URL = "https://brasil-redes-pay.preview.emergentagent.com/api"
TEST_USER_EMAIL = "test@hgl.com"
TEST_USER_PASSWORD = "testpassword123"
TEST_USER_NAME = "Test User HGL"

class HGLTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅" if success else "❌"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, **kwargs):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        headers = kwargs.get('headers', {})
        
        if self.token:
            headers['Authorization'] = f"Bearer {self.token}"
            kwargs['headers'] = headers
            
        try:
            response = requests.request(method, url, timeout=30, **kwargs)
            return response
        except requests.exceptions.RequestException as e:
            return None, str(e)
    
    def test_health_check(self):
        """Test GET /api/ health check"""
        print("\n=== Testing Health Check ===")
        
        response = self.make_request("GET", "/")
        
        if response is None:
            self.log_result("Health Check", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "HGL API is running" in data["message"]:
                self.log_result("Health Check", True, "API is running correctly")
                return True
            else:
                self.log_result("Health Check", False, "Unexpected response format", data)
                return False
        else:
            self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_user_registration(self):
        """Test POST /api/auth/register"""
        print("\n=== Testing User Registration ===")
        
        # First, try to clean up any existing test user
        # (This is just for testing - in production you wouldn't do this)
        
        user_data = {
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/register", json=user_data)
        
        if response is None:
            self.log_result("User Registration", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.token = data["token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Registration", True, "User registered successfully")
                return True
            else:
                self.log_result("User Registration", False, "Missing token or user in response", data)
                return False
        elif response.status_code == 400 and "already registered" in response.text:
            # User already exists, try to login instead
            self.log_result("User Registration", True, "User already exists (expected for repeated tests)")
            return self.test_user_login()
        else:
            self.log_result("User Registration", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login"""
        print("\n=== Testing User Login ===")
        
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", json=login_data)
        
        if response is None:
            self.log_result("User Login", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.token = data["token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Login", True, "Login successful")
                return True
            else:
                self.log_result("User Login", False, "Missing token or user in response", data)
                return False
        else:
            self.log_result("User Login", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_user_profile(self):
        """Test GET /api/user/profile (protected route)"""
        print("\n=== Testing User Profile (Protected Route) ===")
        
        if not self.token:
            self.log_result("User Profile", False, "No authentication token available")
            return False
        
        response = self.make_request("GET", "/user/profile")
        
        if response is None:
            self.log_result("User Profile", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "email" in data:
                self.log_result("User Profile", True, "Profile retrieved successfully")
                return True
            else:
                self.log_result("User Profile", False, "Invalid profile data", data)
                return False
        elif response.status_code == 401:
            self.log_result("User Profile", False, "Authentication failed", response.text)
            return False
        else:
            self.log_result("User Profile", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def create_test_video_file(self):
        """Create a small test video file for upload testing"""
        try:
            # Create a temporary directory
            temp_dir = tempfile.mkdtemp()
            video_path = os.path.join(temp_dir, "test_video.mp4")
            
            # Create a minimal MP4 file using ffmpeg (if available)
            # For testing purposes, we'll create a very short video
            import subprocess
            
            command = [
                "ffmpeg", "-f", "lavfi", "-i", "testsrc=duration=5:size=320x240:rate=1",
                "-c:v", "libx264", "-t", "5", "-pix_fmt", "yuv420p", video_path, "-y"
            ]
            
            result = subprocess.run(command, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0 and os.path.exists(video_path):
                return video_path
            else:
                print(f"FFmpeg failed: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"Error creating test video: {str(e)}")
            return None
    
    def test_video_upload(self):
        """Test POST /api/video/upload"""
        print("\n=== Testing Video Upload ===")
        
        if not self.token:
            self.log_result("Video Upload", False, "No authentication token available")
            return False, None
        
        # Create test video file
        video_path = self.create_test_video_file()
        
        if not video_path:
            self.log_result("Video Upload", False, "Could not create test video file")
            return False, None
        
        try:
            with open(video_path, 'rb') as video_file:
                files = {'file': ('test_video.mp4', video_file, 'video/mp4')}
                
                response = self.make_request("POST", "/video/upload", files=files)
                
                if response is None:
                    self.log_result("Video Upload", False, "Connection failed")
                    return False, None
                    
                if response.status_code == 200:
                    data = response.json()
                    if "success" in data and data["success"] and "video_id" in data:
                        video_id = data["video_id"]
                        self.log_result("Video Upload", True, f"Video uploaded successfully, ID: {video_id}")
                        return True, video_id
                    else:
                        self.log_result("Video Upload", False, "Invalid response format", data)
                        return False, None
                else:
                    self.log_result("Video Upload", False, f"HTTP {response.status_code}", response.text)
                    return False, None
                    
        except Exception as e:
            self.log_result("Video Upload", False, f"Exception during upload: {str(e)}")
            return False, None
        finally:
            # Clean up test file
            try:
                if video_path and os.path.exists(video_path):
                    os.remove(video_path)
                    # Also remove the temp directory
                    os.rmdir(os.path.dirname(video_path))
            except:
                pass
    
    def test_video_auto_cut(self, video_id):
        """Test POST /api/video/auto-cut/{video_id}"""
        print("\n=== Testing Video Auto-Cut ===")
        
        if not self.token:
            self.log_result("Video Auto-Cut", False, "No authentication token available")
            return False
            
        if not video_id:
            self.log_result("Video Auto-Cut", False, "No video ID available")
            return False
        
        # Test auto-cut with default parameters
        response = self.make_request("POST", f"/video/auto-cut/{video_id}")
        
        if response is None:
            self.log_result("Video Auto-Cut", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "success" in data and data["success"]:
                clips_count = len(data.get("clips", []))
                self.log_result("Video Auto-Cut", True, f"Auto-cut successful, {clips_count} clips created")
                return True
            else:
                self.log_result("Video Auto-Cut", False, "Auto-cut failed", data)
                return False
        elif response.status_code == 404:
            self.log_result("Video Auto-Cut", False, "Video not found", response.text)
            return False
        else:
            self.log_result("Video Auto-Cut", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_kwai_status(self):
        """Test GET /api/kwai/status"""
        print("\n=== Testing Kwai Status ===")
        
        if not self.token:
            self.log_result("Kwai Status", False, "No authentication token available")
            return False
        
        response = self.make_request("GET", "/kwai/status")
        
        if response is None:
            self.log_result("Kwai Status", False, "Connection failed")
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "connected" in data:
                connected = data["connected"]
                username = data.get("username", "N/A")
                status_msg = f"Connected: {connected}, Username: {username}"
                self.log_result("Kwai Status", True, status_msg)
                return True
            else:
                self.log_result("Kwai Status", False, "Invalid response format", data)
                return False
        else:
            self.log_result("Kwai Status", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting HGL System Backend Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Health Check
        health_ok = self.test_health_check()
        
        # Test 2: User Registration/Login
        auth_ok = self.test_user_registration()
        
        # Test 3: User Profile (Protected Route)
        profile_ok = self.test_user_profile()
        
        # Test 4: Video Upload
        upload_ok, video_id = self.test_video_upload()
        
        # Test 5: Video Auto-Cut (only if upload succeeded)
        if upload_ok and video_id:
            autocut_ok = self.test_video_auto_cut(video_id)
        else:
            autocut_ok = False
            self.log_result("Video Auto-Cut", False, "Skipped due to upload failure")
        
        # Test 6: Kwai Status
        kwai_ok = self.test_kwai_status()
        
        # Summary
        self.print_summary()
        
        return {
            "health": health_ok,
            "auth": auth_ok,
            "profile": profile_ok,
            "upload": upload_ok,
            "autocut": autocut_ok,
            "kwai": kwai_ok
        }
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.test_results if r["success"])
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"{result['status']} {result['test']}: {result['message']}")
        
        print(f"\nResults: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
        else:
            print("⚠️  Some tests failed - check details above")

def main():
    """Main test execution"""
    tester = HGLTester()
    results = tester.run_all_tests()
    
    # Return exit code based on results
    all_passed = all(results.values())
    return 0 if all_passed else 1

if __name__ == "__main__":
    exit(main())