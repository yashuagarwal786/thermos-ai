import pytest
from fastapi.testclient import TestClient

# Import microservice entry points
from services.authentication_service.main import app as auth_app
from services.satellite_service.main import app as sat_app
from services.prediction_service.main import app as pred_app
from services.simulation_service.main import app as sim_app
from services.recommendation_service.main import app as rec_app
from services.chatbot_service.main import app as chat_app

# 1. Authentication Service Tests
def test_auth_health():
    client = TestClient(auth_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "authentication-service"}

def test_auth_register_fail_invalid_email():
    client = TestClient(auth_app)
    # Invalid email syntax should trigger a 422 Unprocessable Entity
    response = client.post("/register", json={"email": "invalid_email", "password": "pass", "full_name": "Test"})
    assert response.status_code == 422

# 2. Satellite Service Tests
def test_satellite_health():
    client = TestClient(sat_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "satellite-service"}

# 3. Prediction Service Tests
def test_prediction_health():
    client = TestClient(pred_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "prediction-service"}

def test_prediction_forecast_horizon():
    client = TestClient(pred_app)
    response = client.get("/forecast?city=Jaipur&base_temp=30.0&horizon=7d")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Jaipur"
    assert data["horizon_days"] == 7
    assert len(data["predictions"]) == 7

# 4. Simulation Service Tests
def test_simulation_health():
    client = TestClient(sim_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "simulation-service"}

def test_simulation_computation():
    client = TestClient(sim_app)
    # Increase green cover by 10%
    payload = {
        "base_temp": 32.0,
        "green_cover_delta": 10.0,
        "water_bodies_delta": 0.0,
        "reflective_roofs_delta": 0.0,
        "concrete_reduction_delta": 0.0
    }
    response = client.post("/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    # base_temp - (10 * 0.16) = 32.0 - 1.6 = 30.4
    assert data["simulated_temperature"] == 30.4
    assert data["net_reduction"] == 1.6

# 5. Recommendation Service Tests
def test_recommendation_health():
    client = TestClient(rec_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "recommendation-service"}

def test_recommendation_output():
    client = TestClient(rec_app)
    payload = {
        "city": "Jaipur",
        "concrete_percent": 65.0,
        "green_cover_percent": 10.0,
        "population_density": 8000.0,
        "base_temp": 38.0,
        "budget": "high"
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Jaipur"
    assert len(data["recommendations"]) > 0
    assert "cumulative_simulated_cooling" in data

# 6. Chatbot Service Tests
def test_chatbot_health():
    client = TestClient(chat_app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "chatbot-service"}

def test_chatbot_query():
    client = TestClient(chat_app)
    payload = {
        "message": "Why is Jaipur overheating?"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "response" in data["data"]
    assert len(data["data"]["sources"]) > 0
