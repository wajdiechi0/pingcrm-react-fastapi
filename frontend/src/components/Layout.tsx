import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Business, Person } from "@mui/icons-material";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/companies", icon: <Business />, label: "Companies" },
    { path: "/contacts", icon: <Person />, label: "Contacts" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "auto",
          flexShrink: 0,
          bgcolor: "#1f2937",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span style={{ fontSize: "24px" }}>⚡</span> Ping CRM
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box sx={{ py: 2 }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#f1f5f9",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Page Content */}
        {children}
      </Box>
    </Box>
  );
};
