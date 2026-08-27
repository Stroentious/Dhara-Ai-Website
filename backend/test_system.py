import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.database import Base, engine
from sqlalchemy import inspect, text

def sync_schema():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            inspector = inspect(engine)
            if "users" in inspector.get_table_names():
                user_cols = [c["name"] for c in inspector.get_columns("users")]
                if "failed_login_attempts" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0"))
                if "locked_until" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN locked_until DATETIME NULL"))
                conn.commit()
        except Exception as e:
            print(f"Sync schema note: {e}")

def run_tests():
    print("=== DHARA AI SYSTEM SUITE TEST ===")
    sync_schema()
    
    with TestClient(app) as client:
        # 1. Test Password Validation Rules
        print("\n1. Testing Server-side Password Strength Validation...")
        
        # Test 1a: Too short
        r = client.post("/api/auth/register", json={"email": "short@dhara.ai", "password": "Sh1!", "full_name": "Test"})
        assert r.status_code == 422, f"Expected 422 for short password, got {r.status_code}"
        print("[PASS] Rejected short password (< 8 chars)")

        # Test 1b: Common password
        r = client.post("/api/auth/register", json={"email": "common@dhara.ai", "password": "hello123", "full_name": "Test"})
        assert r.status_code == 422, f"Expected 422 for common password, got {r.status_code}"
        print("[PASS] Rejected common password (hello123)")

        # Test 1c: Missing special character
        r = client.post("/api/auth/register", json={"email": "nospecial@dhara.ai", "password": "Password123", "full_name": "Test"})
        assert r.status_code == 422, f"Expected 422 for missing special char, got {r.status_code}"
        print("[PASS] Rejected password missing special character")

        # Test 1d: Strong password
        email = f"farmer_{os.urandom(4).hex()}@dhara.ai"
        password = "Dhara@AI2026!Secure"
        full_name = "Dr. Ramesh Sharma"
        
        print(f"\n2. Testing Registration for {email} with strong password...")
        reg_resp = client.post("/api/auth/register", json={
            "email": email,
            "password": password,
            "full_name": full_name
        })
        print(f"Register Status: {reg_resp.status_code}")
        assert reg_resp.status_code == 200, f"Register failed: {reg_resp.text}"
        token_data = reg_resp.json()
        assert "access_token" in token_data
        access_token = token_data["access_token"]
        print("[PASS] Registration successful with JWT access_token")

        headers = {"Authorization": f"Bearer {access_token}"}

        # 3. Test Auth Me
        print("\n3. Testing GET /api/auth/me...")
        me_resp = client.get("/api/auth/me", headers=headers)
        print(f"Me Status: {me_resp.status_code}")
        assert me_resp.status_code == 200
        user_info = me_resp.json()
        assert user_info["email"] == email
        print(f"[PASS] Authenticated user profile retrieved: {user_info['full_name']}")

        # Create a test field for the user
        field_resp = client.post("/api/fields", json={
            "name": "IIT Agri Research Field Alpha",
            "location": "Kharagpur, India",
            "crop_type": "Wheat (HD-2967)",
            "area_hectares": 5.0,
            "soil_type": "Alluvial Loam"
        }, headers=headers)
        assert field_resp.status_code == 200
        field_id = field_resp.json()["id"]
        print(f"[PASS] Created test field with ID: {field_id}")

        # 4. Test Irrigation Status
        print(f"\n4. Testing GET /api/irrigation/status?field_id={field_id}...")
        irr_status_resp = client.get(f"/api/irrigation/status?field_id={field_id}", headers=headers)
        assert irr_status_resp.status_code == 200
        irr_data = irr_status_resp.json()
        print(f"[PASS] Irrigation system status: State={irr_data['system_state']}, HardwareMode={irr_data['hardware_mode']}")

        # 5. Test Turning Irrigation ON
        print("\n5. Testing POST /api/irrigation/on...")
        on_resp = client.post("/api/irrigation/on", json={"field_id": field_id, "zone": "Zone 1"}, headers=headers)
        assert on_resp.status_code == 200
        on_data = on_resp.json()
        assert on_data["system_status"]["system_state"] == "ON"
        print(f"[PASS] Irrigation turned ON successfully: {on_data['message']}")

        # 6. Test Turning Irrigation OFF
        print("\n6. Testing POST /api/irrigation/off...")
        off_resp = client.post("/api/irrigation/off", json={"field_id": field_id, "zone": "Zone 1"}, headers=headers)
        assert off_resp.status_code == 200
        off_data = off_resp.json()
        assert off_data["system_status"]["system_state"] == "OFF"
        print(f"[PASS] Irrigation turned OFF successfully: {off_data['message']}")

        # 7. Test Listing Valves
        print(f"\n7. Testing GET /api/valves?field_id={field_id}...")
        valves_resp = client.get(f"/api/valves?field_id={field_id}", headers=headers)
        assert valves_resp.status_code == 200
        valves_list = valves_resp.json()
        print(f"[PASS] Found {len(valves_list)} initialized multi-zone valves")

        # 8. Test Sensors latest & history
        print(f"\n8. Testing GET /api/sensors/latest/{field_id}...")
        sensors_resp = client.get(f"/api/sensors/latest/{field_id}", headers=headers)
        assert sensors_resp.status_code == 200
        print(f"[PASS] 7-in-1 Sensor data: {sensors_resp.json()}")

        print("\n==========================================")
        print("ALL BACKEND & SECURITY TESTS PASSED (100%)")
        print("==========================================")

if __name__ == "__main__":
    run_tests()
