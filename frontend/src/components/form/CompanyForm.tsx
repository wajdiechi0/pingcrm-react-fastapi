import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Company } from "../../types";
import { FormTextField } from "./FormTextField";
import { FormSelectField } from "../FormSelectField";

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    company: Omit<Company, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  initialData?: Company;
}

export const CompanyForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: CompanyFormProps) => {
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
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "Canada",
        postal_code: initialData.postal_code || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const countryOptions = [
    { value: "Canada", label: "Canada" },
    { value: "United States", label: "United States" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Edit Company" : "Add New Company"}
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
              <FormSelectField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={countryOptions}
              />
              <FormTextField
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? "Save Changes" : "Add Company"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
