import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  MenuItem,
  Breadcrumbs,
  Alert,
  Snackbar,
} from "@mui/material";
import { Contact, Company } from "../types";
import { contactService, companyService } from "../services/api";
import { FormTextField } from "./form/FormTextField";

export const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    company_id: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const [contactData, companiesData] = await Promise.all([
        contactService.getById(parseInt(id)),
        companyService.getAll(),
      ]);
      setContact(contactData);
      setCompanies(companiesData);
      setFormData({
        name: contactData.name || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
        city: contactData.city || "",
        company_id: contactData.company_id.toString(),
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await contactService.update(parseInt(id), {
        ...formData,
        company_id: parseInt(formData.company_id),
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this contact?")
    ) {
      return;
    }
    try {
      await contactService.delete(parseInt(id));
      navigate("/contacts");
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) {
    return null;
  }

  if (!contact) {
    return <div className="p-10">Contact not found</div>;
  }

  return (
    <div className="p-10">
      {/* Header with breadcrumbs */}
      <div className="mb-3">
        <Breadcrumbs>
          <Link
            to="/contacts"
            style={{ color: "#6366f1", textDecoration: "none" }}
          >
            Contacts
          </Link>
          <Typography color="text.primary">{contact.name}</Typography>
        </Breadcrumbs>
      </div>
      {/* Success Alert */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Company updated successfully!
        </Alert>
      </Snackbar>
      <Paper className="p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormTextField
            label="Email"
            name="email"
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
          <FormTextField
            select
            label="Company"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id.toString()}>
                {company.name}
              </MenuItem>
            ))}
          </FormTextField>
        </div>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            color="error"
            onClick={handleDelete}
            sx={{ color: "red", textTransform: "none" }}
          >
            Delete Contact
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Update Contact
          </Button>
        </Box>
      </Paper>
    </div>
  );
};
