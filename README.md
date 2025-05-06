
# GenAI Project

This is a GenAI-based app with a FastAPI backend and a Vite frontend.

---

## 🧠 Backend (FastAPI)

### Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd genai
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1   # For PowerShell on Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

The backend server will start at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 Frontend (Vite + React)

### Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start at: [http://localhost:5173](http://localhost:5173)

---

## 🔄 Notes

- Ensure the backend is running before using the frontend.
- CORS is enabled in the backend to allow frontend requests.
