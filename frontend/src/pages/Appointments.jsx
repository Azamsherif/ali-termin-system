import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api.js";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { Add, FileDownload, Event, Phone, Language, Schedule } from "@mui/icons-material";

export default function Appointments() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    phone: "",
    client_language: "de",
    appointment_datetime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments");
      setRows(res.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      await API.post("/api/appointments", form);
      setForm({ client_name: "", phone: "", client_language: "de", appointment_datetime: "" });
      setSuccess("Appointment created successfully!");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await API.get("/api/messages/export/appointments", {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointments.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to export appointments");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 300 }}>
        {t("appointments")}
      </Typography>

      {/* Create Appointment Form */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4,
          background: (theme) => theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 136, 229, 0.02) 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(21, 101, 192, 0.01) 100%)`,
          border: (theme) => theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 12px 40px rgba(0, 0, 0, 0.3)'
              : '0 12px 40px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add /> Create New Appointment
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={create}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Name"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Event sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  placeholder="+41..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Language"
                  value={form.client_language}
                  onChange={(e) => setForm({ ...form, client_language: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                >
                  <MenuItem value="de">Deutsch</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="it">Italiano</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Appointment Date & Time"
                  type="datetime-local"
                  value={form.appointment_datetime}
                  onChange={(e) => setForm({ ...form, appointment_datetime: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={submitting ? <CircularProgress size={20} /> : <Add />}
                  disabled={submitting}
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
                    boxShadow: '0 4px 20px rgba(21, 101, 192, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 32px rgba(21, 101, 192, 0.6)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {submitting ? "Creating..." : t("create")}
                </Button>
                
                <Button
                  onClick={exportExcel}
                  variant="outlined"
                  startIcon={<FileDownload />}
                  sx={{ 
                    ml: 2,
                    py: 1.5,
                    px: 3,
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
                  {t("exportAppointments")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Paper 
        elevation={3}
        sx={{
          background: (theme) => theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 136, 229, 0.01) 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(21, 101, 192, 0.005) 100%)`,
          border: (theme) => theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.04)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Appointments ({rows.length})
          </Typography>
        </Box>
        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow 
                  sx={{ 
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(30, 136, 229, 0.1)' 
                      : 'rgba(21, 101, 192, 0.08)',
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: (theme) => theme.palette.mode === 'dark' 
                        ? theme.palette.primary.light 
                        : theme.palette.primary.dark,
                      borderBottom: (theme) => theme.palette.mode === 'dark'
                        ? '2px solid rgba(30, 136, 229, 0.3)'
                        : '2px solid rgba(21, 101, 192, 0.2)',
                    }
                  }}
                >
                  <TableCell>ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    sx={{
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(30, 136, 229, 0.08)' 
                          : 'rgba(21, 101, 192, 0.04)',
                        transform: 'scale(1.01)',
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                          ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                          : '0 4px 20px rgba(0, 0, 0, 0.05)',
                      }
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: (theme) => theme.palette.mode === 'dark' 
                          ? theme.palette.primary.light 
                          : theme.palette.primary.main 
                      }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        color: (theme) => theme.palette.text.primary
                      }}
                    >
                      {row.client_name}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: (theme) => theme.palette.text.secondary,
                        fontFamily: 'monospace'
                      }}
                    >
                      {row.phone}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: (theme) => theme.palette.text.primary,
                        textTransform: 'uppercase',
                        fontWeight: 500
                      }}
                    >
                      {row.client_language?.toUpperCase()}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: (theme) => theme.palette.text.secondary,
                        fontSize: '0.9rem'
                      }}
                    >
                      {new Date(row.appointment_datetime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        color={getStatusColor(row.status)} 
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 600,
                          boxShadow: row.status === 'confirmed' 
                            ? '0 2px 8px rgba(46, 125, 50, 0.3)'
                            : '0 2px 8px rgba(198, 40, 40, 0.3)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: row.status === 'confirmed' 
                              ? '0 4px 16px rgba(46, 125, 50, 0.5)'
                              : '0 4px 16px rgba(198, 40, 40, 0.5)',
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      <Typography variant="body1">No appointments found</Typography>
                      <Typography variant="body2">Create your first appointment using the form above</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
