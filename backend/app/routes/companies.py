from typing import List
from fastapi import APIRouter, HTTPException
from ..schemas.schemas import Company, CompanyCreate, CompanyUpdate, Contact
from ..utils.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[Company])
def get_companies(skip: int = 0, limit: int = 100):
    response = supabase.table('companies').select("*").range(skip, skip + limit - 1).execute()
    return response.data

@router.get("/{company_id}/contacts", response_model=List[Contact])
def get_company_contacts(company_id: int):
    # First check if company exists
    company = supabase.table('companies').select("*").eq('id', company_id).single().execute()
    if not company.data:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get contacts for the company
    response = supabase.table('contacts').select("*").eq('company_id', company_id).execute()
    return response.data

@router.post("/", response_model=Company)
def create_company(company_in: CompanyCreate):
    response = supabase.table('companies').insert(company_in.dict()).execute()
    return response.data[0]

@router.get("/{company_id}", response_model=Company)
def get_company(company_id: int):
    response = supabase.table('companies').select("*").eq('id', company_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Company not found")
    return response.data

@router.put("/{company_id}", response_model=Company)
def update_company(company_id: int, company_in: CompanyUpdate):
    # First check if company exists
    existing = supabase.table('companies').select("*").eq('id', company_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Update the company
    response = supabase.table('companies').update(company_in.dict(exclude_unset=True)).eq('id', company_id).execute()
    return response.data[0]

@router.delete("/{company_id}", response_model=Company)
def delete_company(company_id: int):
    # First check if company exists
    existing = supabase.table('companies').select("*").eq('id', company_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Delete the company
    response = supabase.table('companies').delete().eq('id', company_id).execute()
    return response.data[0] 