import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import Nav from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Messages from "./pages/Messages.jsx";
import Settings from "./pages/Settings.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#1e88e5' : '#1565c0',
        dark: darkMode ? '#1565c0' : '#0d47a1',
        light: darkMode ? '#42a5f5' : '#1976d2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkMode ? '#f50057' : '#c51162',
        dark: darkMode ? '#c51162' : '#880e4f',
        light: darkMode ? '#ff5983' : '#e91e63',
      },
      background: {
        default: darkMode ? '#0a0e27' : '#f8fafc',
        paper: darkMode ? '#1a1d29' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e4e6ea' : '#1e293b',
        secondary: darkMode ? '#9ca3af' : '#64748b',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a' },
      h2: { fontWeight: 600, color: darkMode ? '#f1f5f9' : '#1e293b' },
      h4: { fontWeight: 600, color: darkMode ? '#f1f5f9' : '#1e293b' },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 8px 25px rgba(30, 136, 229, 0.3)' 
                : '0 8px 25px rgba(21, 101, 192, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: darkMode
                ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                : '0 12px 40px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: darkMode 
                ? 'rgba(30, 136, 229, 0.08)' 
                : 'rgba(21, 101, 192, 0.04)',
              transform: 'scale(1.01)',
            },
          },
        },
      },
    },
  });

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Nav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/appointments" element={<RequireAuth><Appointments /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
