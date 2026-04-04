"""
Backend API Tests for HGL Video Processing
Tests: Login, Extract Metadata, Process Clips endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "teste.urgente@hgl.com"
TEST_PASSWORD = "123456"
TEST_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        
        # Check status code
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        # Validate response structure
        data = response.json()
        assert "token" in data, "Response missing 'token'"
        assert "user" in data, "Response missing 'user'"
        assert isinstance(data["token"], str), "Token should be string"
        assert len(data["token"]) > 0, "Token should not be empty"
        
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpass"}
        )
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestVideoMetadata:
    """Video metadata extraction tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_extract_metadata_success(self, auth_token):
        """Test extracting metadata from YouTube video using yt-dlp"""
        response = requests.post(
            f"{BASE_URL}/api/video/extract-metadata",
            json={"video_url": TEST_VIDEO_URL},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        # Check status code
        assert response.status_code == 200, f"Extract metadata failed: {response.text}"
        
        # Validate response structure
        data = response.json()
        assert data.get("success") == True, "Response should have success=True"
        assert "metadata" in data, "Response missing 'metadata'"
        
        metadata = data["metadata"]
        assert "title" in metadata, "Metadata missing 'title'"
        assert "duration" in metadata, "Metadata missing 'duration'"
        assert "views" in metadata, "Metadata missing 'views'"
        assert "channel" in metadata, "Metadata missing 'channel'"
        
        # Validate data types
        assert isinstance(metadata["duration"], (int, float)), "Duration should be numeric"
        assert isinstance(metadata["views"], (int, float)), "Views should be numeric"
        assert metadata["duration"] > 0, "Duration should be positive"
        
        print(f"✅ Metadata extracted: {metadata['title'][:50]}...")
        print(f"   Duration: {metadata['duration']}s, Views: {metadata['views']}")
    
    def test_extract_metadata_without_auth(self):
        """Test that extract-metadata requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/video/extract-metadata",
            json={"video_url": TEST_VIDEO_URL}
        )
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestProcessClips:
    """Video clip processing tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_process_clips_success(self, auth_token):
        """Test process-clips endpoint returns job info"""
        request_body = {
            "video_url": TEST_VIDEO_URL,
            "video_duration": 212,  # Rick Astley video duration
            "clip_duration": 30,
            "format": "vertical",
            "framing": "automatico",
            "apply_bypass": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/video/process-clips",
            json=request_body,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        # Check status code
        assert response.status_code == 200, f"Process clips failed: {response.text}"
        
        # Validate response structure
        data = response.json()
        assert data.get("success") == True, "Response should have success=True"
        assert "job_id" in data, "Response missing 'job_id'"
        assert "num_clips" in data, "Response missing 'num_clips'"
        assert "real_clip_duration" in data, "Response missing 'real_clip_duration'"
        
        # Validate clip calculation
        assert data["num_clips"] > 0, "Should have at least 1 clip"
        assert data["real_clip_duration"] > 0, "Real clip duration should be positive"
        
        print(f"✅ Process clips job created: {data['job_id']}")
        print(f"   Num clips: {data['num_clips']}, Duration: {data['real_clip_duration']:.2f}s")
    
    def test_process_clips_without_auth(self):
        """Test that process-clips requires authentication"""
        request_body = {
            "video_url": TEST_VIDEO_URL,
            "video_duration": 212,
            "clip_duration": 30,
            "format": "vertical",
            "framing": "automatico",
            "apply_bypass": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/video/process-clips",
            json=request_body
        )
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestJobStatus:
    """Job status endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_job_status_not_found(self, auth_token):
        """Test job status with invalid job_id"""
        response = requests.get(
            f"{BASE_URL}/api/video/job-status/invalid-job-id",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
