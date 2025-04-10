from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import contacts, companies

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])

@app.get("/")
async def root():
    return {"message": "Welcome to PingCRM API"} 