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
  InputAdornment,
  Pagination,
  PaginationItem,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Company } from "../types";
import { companyService } from "../services/api";
import { CompanyForm } from "../components/form/CompanyForm";

export const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(response);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.delete(id);
        await loadCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedCompany(undefined);
    setFormOpen(true);
  };

  const handleSubmit = async (
    company: Omit<Company, "id" | "created_at" | "updated_at">
  ) => {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.id, company);
      } else {
        await companyService.create(company);
      }
      await loadCompanies();
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/companies/${id}`);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.phone?.includes(searchQuery)
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  return (
    <div className="p-4">
      <Typography variant="h5" sx={{ mb: 3 }}>
        Companies
      </Typography>

      {/* Search and Actions Bar */}
      <div className="flex gap-2 mb-3">
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
          Create Company
        </Button>
      </div>

      {/* Companies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell width={100}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow
                key={company.id}
                hover
                sx={{
                  "&:hover": { cursor: "pointer" },
                  "& td": { borderColor: "#e5e7eb" },
                }}
                onClick={() => handleRowClick(company.id)}
              >
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.city || "-"}</TableCell>
                <TableCell>{company.phone || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(company.id);
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
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loading && filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && filteredCompanies.length > 0 && (
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

      <CompanyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCompany}
      />
    </div>
  );
};
