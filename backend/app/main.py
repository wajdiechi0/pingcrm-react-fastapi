from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import contacts, companies
from .config import settings

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default development server
        "http://localhost:3000",  # Alternative local development port
        "https://*.vercel.app",   # All Vercel preview deployments
        "https://pingcrm-react-fastapi.vercel.app"  # Your production Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])

@app.get("/")
def read_root():
    return {"message": "Welcome to PingCRM API"} 