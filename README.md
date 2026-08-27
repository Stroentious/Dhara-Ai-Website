# 🌿 DHARA AI — Smart Agriculture IoT Platform

**DHARA AI** is a full-stack precision agriculture platform that integrates 7-in-1 NPK soil sensors via LoRa/RS485/Modbus into a modern AI-powered web dashboard.

---

## 1. Installation

### Prerequisites
- Node.js >= 18 & npm >= 9
- Python 3.11+ (tested with 3.14)
- PostgreSQL >= 14 (optional; mock data works without it)

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
```

---

## 2. Running on Localhost

### Option A: One Command (Project Root)
From the root directory of `dharaAI`:
```bash
npm run dev
# or
npm start
```
This automatically starts both the FastAPI Backend (`http://127.0.0.1:8000`) and Vite Frontend (`http://localhost:5173`) concurrently.

### Option B: Smart One-Click Launchers
- **Windows**: Double-click [start_dharaai_smart.bat](file:///c:/Users/abhin/abhinav/dharaAI/start_dharaai_smart.bat) or [start_dharaai.bat](file:///c:/Users/abhin/abhinav/dharaAI/start_dharaai.bat).
- **macOS / Linux**: Run `./start_dharaai.sh` in your terminal.
- **Enable Windows Auto-Start on Boot**: Double-click [setup_autostart.bat](file:///c:/Users/abhin/abhinav/dharaAI/setup_autostart.bat).
- **Stop Background Servers**: Double-click [stop_dharaai.bat](file:///c:/Users/abhin/abhinav/dharaAI/stop_dharaai.bat).

---

## 3. Manual Server Execution

### Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
Open in browser: **http://localhost:5173**

### Backend (Port 8000)
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
API Root: **http://127.0.0.1:8000**
Swagger API Docs: **http://127.0.0.1:8000/docs**


## 4. Environment Variables (`backend/.env`)

```env
DATABASE_URL=sqlite:///./dharaai_local.db # SQLite default (or postgresql://dharaai:password@localhost:5432/dharaai_db)
SECRET_KEY=your-very-long-random-secret-key-here-minimum-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=gsk_...               # Optional: Groq LLM for chatbot
OPENWEATHERMAP_API_KEY=...         # Optional: real weather data
LORA_DEVICE_SECRET=your-hmac-secret
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
ENVIRONMENT=development
```

**PostgreSQL Setup:**
```sql
CREATE DATABASE dharaai_db;
CREATE USER dharaai WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dharaai_db TO dharaai;
```
Tables are auto-created on first backend startup.

---

## 5. Project Structure

```
dharaAI/
├── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                  # Router + protected routes
│       ├── main.jsx
│       ├── index.css                # Design system + CSS variables
│       ├── components/
│       │   ├── Layout.jsx           # Sidebar + header shell
│       │   ├── MetricCard.jsx       # KPI stat cards
│       │   ├── StatusBadge.jsx      # Online/offline indicators
│       │   ├── SensorGauge.jsx      # SVG circular gauges
│       │   ├── AlertItem.jsx        # Alert list rows
│       │   ├── LoadingSpinner.jsx
│       │   └── ErrorBoundary.jsx
│       ├── context/
│       │   ├── AuthContext.jsx      # JWT auth state + mock fallback
│       │   └── FieldContext.jsx     # Field selection state
│       ├── services/
│       │   └── api.js               # Axios API client
│       ├── data/
│       │   └── mockData.js          # Frontend mock data
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx        # Main KPI dashboard
│           ├── Fields.jsx
│           ├── Sensors.jsx          # 7-in-1 NPK + LoRa status
│           ├── Irrigation.jsx       # Water tracking
│           ├── Fertilizer.jsx       # NPK & fertilizer management
│           ├── Weather.jsx
│           ├── Analytics.jsx        # Trend charts
│           ├── Alerts.jsx
│           ├── ChatBot.jsx          # DHARA AI chatbot
│           └── Settings.jsx
│
└── backend/
    ├── requirements.txt
    ├── .env.example
    ├── .gitignore
    └── app/
        ├── main.py                  # FastAPI app + middleware
        ├── config.py                # Pydantic settings
        ├── database.py              # SQLAlchemy engine + session
        ├── models.py                # ORM models (User, Field, Sensor...)
        ├── schemas.py               # Pydantic request/response schemas
        ├── auth.py                  # JWT + bcrypt password hashing
        ├── mock_data.py             # Centralized mock data generator
        ├── lora_adapter.py          # LoRa/Modbus hardware adapter
        ├── routes/
        │   ├── auth.py              # /api/auth/register, /login-json
        │   ├── fields.py            # /api/fields
        │   ├── sensors.py           # /api/sensors/latest, /history
        │   ├── lora.py              # /api/lora/uplink
        │   ├── water.py             # /api/water
        │   ├── fertilizer.py        # /api/fertilizer
        │   ├── weather.py           # /api/weather (cached, SSRF-safe)
        │   ├── dashboard.py         # /api/dashboard/{field_id}
        │   ├── alerts.py            # /api/alerts
        │   ├── chat.py              # /api/chat (DHARA AI chatbot)
        │   └── health.py            # /api/health
        └── services/
            └── alert_service.py     # Threshold-based alert generation
```

---

## 6. Hardware Integration — Still Required

The platform uses mock/simulated data. To connect real hardware:

### 7-in-1 NPK Sensor (RS485/Modbus)
| Required | Source |
|---------|--------|
| Modbus register addresses for N, P, K, pH, EC, moisture, temperature | Sensor datasheet |
| Data types (int16, uint16, float32) and scaling factors | Sensor datasheet |
| Baud rate (typically 4800 or 9600), parity, stop bits | Sensor manual |
| Device Modbus address (usually 0x01) | Sensor manual |

### LoRa Node
| Required | Source |
|---------|--------|
| LoRa packet framing format (byte layout) | Node firmware/vendor |
| Frequency band (868/915/433 MHz), SF, BW, CR | Node specs |
| Device authentication scheme (HMAC, DevEUI+AppKey) | Node docs |
| Payload encoding (binary, JSON, Base64, Hex) | Node firmware |

### LoRa Gateway
| Required | Source |
|---------|--------|
| Gateway model + firmware | Hardware specs |
| Uplink forwarding endpoint config | Gateway admin |
| Authentication headers for uplink push | Gateway security settings |
| Network server type (ChirpStack, TTN, custom) | Your LoRa network |

### Integration Steps
1. Edit `backend/app/lora_adapter.py` → implement `parse_real_lora_payload()`
2. Load Modbus register map from config file (not hardcoded)
3. Set `LORA_DEVICE_SECRET` in `.env` for HMAC packet validation
4. Register device via `POST /api/sensors/devices`
5. Configure gateway to push to `POST /api/lora/uplink` with `X-Device-ID` header

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | None | Health check |
| POST | `/api/auth/register` | None | Register user |
| POST | `/api/auth/login-json` | None | Login (JSON), get JWT |
| GET/POST | `/api/fields` | JWT | List/create fields |
| GET | `/api/sensors/latest/{id}` | JWT | Latest sensor reading |
| GET | `/api/sensors/history/{id}` | JWT | Historical readings |
| POST | `/api/lora/uplink` | Device header | Receive LoRa packet |
| GET/POST | `/api/water/{id}` | JWT | Water usage |
| GET/POST | `/api/fertilizer/{id}` | JWT | Fertilizer usage |
| GET | `/api/weather` | JWT | Weather data |
| GET | `/api/dashboard/{id}` | JWT | Aggregated dashboard |
| GET | `/api/alerts/{id}` | JWT | Field alerts |
| POST | `/api/chat` | JWT | DHARA AI chatbot |

---

*DHARA AI — Empowering farmers with precision agriculture technology* 🌱