from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="SUPERAPP Python Backend",
    description="Nightclub Management System Backend API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SUPERAPP Python Backend is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "SUPERAPP Python Backend is running"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint working!", "backend": "Python FastAPI"}

if __name__ == "__main__":
    print("🚀 Starting SUPERAPP Python Backend...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    ) 