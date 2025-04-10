import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  MenuItem,
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { Company, Contact } from "../types";
import { companyService } from "../services/api";
import { FormTextField } from "./form/FormTextField";

export const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Canada",
    postal_code: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const companyData = await companyService.getById(parseInt(id));
      const contactsData = await companyService.getContacts(parseInt(id)); // You might want to add an API endpoint to get contacts by company ID
      setCompany(companyData);
      setContacts(contactsData);
      setFormData({
        name: companyData.name || "",
        email: companyData.email || "",
        phone: companyData.phone || "",
        address: companyData.address || "",
        city: companyData.city || "",
        state: companyData.state || "",
        country: companyData.country || "Canada",
        postal_code: companyData.postal_code || "",
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
      await companyService.update(parseInt(id), formData);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this Company?")
    ) {
      return;
    }
    try {
      await companyService.delete(parseInt(id));
      navigate("/companies");
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return null;
  }

  if (!company) {
    return <div className="p-3">Company not found</div>;
  }

  return (
    <div className="p-10">
      {/* Header with breadcrumbs */}
      <div className="mb-3">
        <Breadcrumbs>
          <Link
            to="/companies"
            style={{ color: "#6366f1", textDecoration: "none" }}
          >
            Companies
          </Link>
          <Typography color="text.primary">{company.name}</Typography>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FormTextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <FormTextField
            label="Province/State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          <FormTextField
            select
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="United States">United States</MenuItem>
          </FormTextField>
          <FormTextField
            label="Postal code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            color="error"
            onClick={handleDelete}
            sx={{ color: "red", textTransform: "none" }}
          >
            Delete Company
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Update Company
          </Button>
        </Box>
      </Paper>

      {/* Contacts Section */}
      <div className="mt-6">
        <Typography variant="h6" className="mb-3">
          Contacts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No contacts found.
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    hover
                    sx={{
                      "&:hover": { cursor: "pointer" },
                      "& td": { borderColor: "#e5e7eb" },
                    }}
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                  >
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.city}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
