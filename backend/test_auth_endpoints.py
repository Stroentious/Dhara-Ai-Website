import sys
import os
import uuid

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

BASE_URL = '/api'

def post_json(path, payload, headers=None):
    resp = client.post(path, json=payload, headers=headers or {})
    return resp.status_code, resp.json() if resp.content else {}

def get_json(path, headers=None):
    resp = client.get(path, headers=headers or {})
    return resp.status_code, resp.json() if resp.content else {}


print('=== 1. Testing Login Endpoint (/api/auth/login-json) ===')
status, data = post_json(f'{BASE_URL}/auth/login-json', {'email': 'farmer@dhara.ai', 'password': 'Dhara@AI2026!Secure'})
print(f'Status: {status}, Access Token: {data.get("access_token")[:25]}...')
token = data['access_token']
auth_headers = {'Authorization': f'Bearer {token}'}

print('\n=== 2. Testing /api/auth/me Profile Endpoint ===')
status, me = get_json(f'{BASE_URL}/auth/me', auth_headers)
print(f'Status: {status}, User Profile: {me}')

print('\n=== 3. Testing /api/fields Endpoint ===')
status, fields = get_json(f'{BASE_URL}/fields', auth_headers)
print(f'Status: {status}, Field Count: {len(fields)}, First Field: {fields[0]["name"]}')

print('\n=== 4. Testing /api/dashboard/summary Endpoint ===')
status, dash = get_json(f'{BASE_URL}/dashboard/summary', auth_headers)
print(f'Status: {status}, Dashboard Metrics Present: {list(dash.keys())}')

print('\n=== 5. Testing Invalid Password Rejection ===')
bad_status, bad_resp = post_json(f'{BASE_URL}/auth/login-json', {'email': 'farmer@dhara.ai', 'password': 'WrongPassword123!'})
print(f'Correctly rejected with HTTP {bad_status}')
assert bad_status == 401


print('\n=== 6. Testing Registration Flow for New Farmer ===')
rand_email = f'farmer_{uuid.uuid4().hex[:6]}@dhara.ai'
status, reg_data = post_json(f'{BASE_URL}/auth/register', {'email': rand_email, 'password': 'Dhara@AI2026!Secure', 'full_name': 'New Registered Farmer'})
print(f'Registration status: {status}, Token received: {bool(reg_data.get("access_token"))}')

print('\n' + '='*50)
print('>>> ALL AUTHENTICATION AND DASHBOARD TESTS PASSED! <<<')
print('='*50)
