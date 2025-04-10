import axios from "axios";
import { Contact, Company } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const contactService = {
  getAll: async () => {
    const response = await api.get<Contact[]>("/contacts");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Contact>(`/contacts/${id}`);
    return response.data;
  },

  create: async (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">
  ) => {
    const response = await api.post<Contact>("/contacts", contact);
    return response.data;
  },

  update: async (id: number, contact: Partial<Contact>) => {
    const response = await api.put<Contact>(`/contacts/${id}`, contact);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/contacts/${id}`);
    return response.data;
  },
};

export const companyService = {
  getAll: async () => {
    const response = await api.get<Company[]>("/companies");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  getContacts: async (id: number) => {
    const response = await api.get<Contact[]>(`/companies/${id}/contacts`);
    return response.data;
  },

  create: async (
    company: Omit<Company, "id" | "created_at" | "updated_at">
  ) => {
    const response = await api.post<Company>("/companies", company);
    return response.data;
  },

  update: async (id: number, company: Partial<Company>) => {
    const response = await api.put<Company>(`/companies/${id}`, company);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/companies/${id}`);
    return response.data;
  },
};
