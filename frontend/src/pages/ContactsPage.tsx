import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  InputAdornment,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Contact } from "../types";
import { contactService } from "../services/api";
import { ContactForm } from "../components/form/ContactForm";

export const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(id);
        await loadContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedContact(undefined);
    setFormOpen(true);
  };

  const handleSubmit = async (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">
  ) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.id, contact);
      } else {
        await contactService.create(contact);
      }
      await loadContacts();
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/contacts/${id}`);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedContacts = filteredContacts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  return (
    <div className="p-4">
      <Typography variant="h5" sx={{ mb: 3 }}>
        Contacts
      </Typography>

      {/* Search and Actions Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300, bgcolor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            marginLeft: "auto",
            bgcolor: "#6366f1",
            "&:hover": { bgcolor: "#4f46e5" },
          }}
        >
          Create Contact
        </Button>
      </Box>

      {/* Contacts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell width={100}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.map((contact) => (
              <TableRow
                key={contact.id}
                hover
                sx={{
                  "&:hover": { cursor: "pointer" },
                  "& td": { borderColor: "#e5e7eb" },
                }}
                onClick={() => handleRowClick(contact.id)}
              >
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.company?.name || "-"}</TableCell>
                <TableCell>{contact.city}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loading && filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && filteredContacts.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            px: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "#6366f1",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#4f46e5",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      )}

      <ContactForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedContact}
      />
    </div>
  );
};
