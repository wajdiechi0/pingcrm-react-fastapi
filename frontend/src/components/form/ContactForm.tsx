import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { Contact, Company } from '../../types';
import { companyService } from '../../services/api';
import { FormTextField } from './FormTextField';
import { FormSelectField } from '../FormSelectField';

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Contact;
}

export const ContactForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: ContactFormProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    company_id: '',
  });

  useEffect(() => {
    loadCompanies();
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        city: initialData.city || '',
        company_id: initialData.company_id ? initialData.company_id.toString() : '',
      });
    }
  }, [initialData]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(response);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        company_id: parseInt(formData.company_id),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const companyOptions = companies.map(company => ({
    value: company.id.toString(),
    label: company.name
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormTextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormTextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormTextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormTextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <FormSelectField
                label="Company"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                options={companyOptions}
                required
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 