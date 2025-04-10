from typing import List
from fastapi import APIRouter, HTTPException
from ..schemas.schemas import Contact, ContactCreate, ContactUpdate
from ..utils.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[Contact])
def get_contacts(skip: int = 0, limit: int = 100):
    response = supabase.table('contacts').select("*").range(skip, skip + limit - 1).execute()
    return response.data

@router.get("/{contact_id}", response_model=Contact)
def get_contact(contact_id: int):
    response = supabase.table('contacts').select("*").eq('id', contact_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return response.data

@router.post("/", response_model=Contact)
def create_contact(contact_in: ContactCreate):
    response = supabase.table('contacts').insert(contact_in.dict()).execute()
    return response.data[0]

@router.put("/{contact_id}", response_model=Contact)
def update_contact(contact_id: int, contact_in: ContactUpdate):
    # First check if contact exists
    existing = supabase.table('contacts').select("*").eq('id', contact_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Update the contact
    response = supabase.table('contacts').update(contact_in.dict(exclude_unset=True)).eq('id', contact_id).execute()
    return response.data[0]

@router.delete("/{contact_id}", response_model=Contact)
def delete_contact(contact_id: int):
    # First check if contact exists
    existing = supabase.table('contacts').select("*").eq('id', contact_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Delete the contact
    response = supabase.table('contacts').delete().eq('id', contact_id).execute()
    return response.data[0]

@router.get("/companies/{company_id}/contacts/", response_model=List[Contact])
def get_company_contacts(company_id: int):
    response = supabase.table('contacts').select("*").eq('company_id', company_id).execute()
    return response.data 