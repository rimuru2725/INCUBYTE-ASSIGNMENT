from fastapi.testclient import TestClient
from backend.main import app
import pytest

client = TestClient(app)

# Use a separate DB for tests in a real scenario, but for now we rely on the main simple setup 
# or we should override get_db dependency. 
# For this simplified TDD Kata, we will just use the same logic but ideally we should reset DB.

def test_register_user():
    # Helper to generate unique users for idempotency if DB persists
    import uuid
    username = f"testuser_{uuid.uuid4()}"
    response = client.post(
        "/api/auth/register",
        json={"username": username, "password": "password123"},
    )
    assert response.status_code == 201
    assert response.json()["username"] == username

def test_login_user():
    # First register
    import uuid
    username = f"loginuser_{uuid.uuid4()}"
    password = "password123"
    client.post(
        "/api/auth/register",
        json={"username": username, "password": password},
    )
    
    # Then login
    response = client.post(
        "/api/auth/login",
        data={"username": username, "password": password},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
