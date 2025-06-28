from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
app = FastAPI(title="SUPERAPP Python Backend", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
@app.get("/")
async def root():
    return {"message": "SUPERAPP Python Backend is running!"}
if __name__ == "__main__":
    print("?? Starting SUPERAPP Python Backend...")
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
