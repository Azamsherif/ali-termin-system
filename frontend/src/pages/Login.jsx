import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api.js";
import { Box, Button, TextField, Typography, Alert, Paper, Divider } from "@mui/material";
import { Login as LoginIcon, PersonAdd } from "@mui/icons-material";

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="70vh"
      sx={{
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d29 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 5, 
          maxWidth: 450, 
          width: "100%",
          background: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(26, 29, 41, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: (theme) => theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: 4,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 24px 60px rgba(30, 136, 229, 0.2), 0 0 40px rgba(30, 136, 229, 0.1)'
              : '0 24px 60px rgba(21, 101, 192, 0.15), 0 0 40px rgba(21, 101, 192, 0.05)',
          }
        }}
      >
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
              borderRadius: '50%',
              p: 2,
              display: 'inline-flex',
              mb: 3,
              boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: '0 12px 40px rgba(21, 101, 192, 0.4)',
              }
            }}
          >
            <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            {t("login")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Welcome back! Please sign in to your account
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={submit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            type="email"
            required
            size="large"
          />
          <TextField
            label={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            type="password"
            required
            size="large"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loading}
            sx={{ 
              py: 2, 
              mt: 2,
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
              boxShadow: '0 4px 20px rgba(21, 101, 192, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 32px rgba(21, 101, 192, 0.6)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                boxShadow: 'none',
              }
            }}
          >
            {loading ? "Signing in..." : t("login")}
          </Button>
          
          {err && <Alert severity="error">{err}</Alert>}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Don't have an account?
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            startIcon={<PersonAdd />}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(21, 101, 192, 0.2)',
              }
            }}
          >
            Create Account
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Need help? Use /api/auth/register to create your first account
        </Typography>
      </Paper>
    </Box>
  );
}
