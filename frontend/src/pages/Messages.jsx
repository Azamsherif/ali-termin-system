import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api.js";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";
import { 
  FileDownload, 
  Refresh, 
  FilterList, 
  Message as MessageIcon,
  Phone,
  WhatsApp,
  Sms,
  ErrorOutline,
  CheckCircle,
  Schedule
} from "@mui/icons-material";

export default function Messages() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const url = filter === "failed" ? "/api/messages?status=failed" : "/api/messages";
      const res = await API.get(url);
      setRows(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const resend = async (id) => {
    try {
      setResending(id);
      await API.post(`/api/messages/resend/${id}`);
      await load();
    } catch (err) {
      console.error("Failed to resend message:", err);
    } finally {
      setResending(null);
    }
  };

  const exportExcel = () => {
    window.open((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/messages/export/messages", "_blank");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle fontSize="small" />;
      case 'failed': return <ErrorOutline fontSize="small" />;
      case 'pending': return <Schedule fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp': return <WhatsApp fontSize="small" />;
      case 'sms': return <Sms fontSize="small" />;
      default: return <MessageIcon fontSize="small" />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'whatsapp': return 'success';
      case 'sms': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 300 }}>
        {t("messages")}
      </Typography>

      {/* Filters and Actions */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          background: (theme) => theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 136, 229, 0.02) 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(21, 101, 192, 0.01) 100%)`,
          border: (theme) => theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
              startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="all">All Messages</MenuItem>
              <MenuItem value="failed">{t("failed")} Only</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            onClick={load}
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
            disabled={loading}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px) rotate(2deg)',
                boxShadow: '0 6px 20px rgba(21, 101, 192, 0.2)',
              }
            }}
          >
            Refresh
          </Button>
          
          <Button
            onClick={exportExcel}
            variant="outlined"
            startIcon={<FileDownload />}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(21, 101, 192, 0.2)',
              }
            }}
          >
            {t("exportMessages")}
          </Button>
          
          <Box sx={{ ml: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              Total: {rows.length} messages
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Messages Table */}
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
                  <TableCell>Channel</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Attempts</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                    <TableRow 
                      key={row.id} 
                      sx={{
                        '&:hover': { 
                          backgroundColor: (theme) => theme.palette.action.hover,
                          transform: 'translateY(-1px)',
                          boxShadow: (theme) => theme.shadows[2],
                          transition: 'all 0.2s ease-in-out'
                        },
                        '& .MuiTableCell-root': {
                          color: (theme) => theme.palette.mode === 'dark'
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                          borderBottom: (theme) => theme.palette.mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                    <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getChannelIcon(row.channel)}
                        label={row.channel}
                        color={getChannelColor(row.channel)}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 2px 8px rgba(21, 101, 192, 0.2)',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.04)',
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        display: 'inline-block',
                        fontWeight: 500
                      }}>
                        {row.message_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                          {row.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(row.status)}
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 600,
                          boxShadow: row.status === 'sent' 
                            ? '0 2px 8px rgba(46, 125, 50, 0.3)'
                            : row.status === 'failed'
                            ? '0 2px 8px rgba(198, 40, 40, 0.3)'
                            : '0 2px 8px rgba(237, 108, 2, 0.3)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: row.status === 'sent' 
                              ? '0 4px 16px rgba(46, 125, 50, 0.5)'
                              : row.status === 'failed'
                              ? '0 4px 16px rgba(198, 40, 40, 0.5)'
                              : '0 4px 16px rgba(237, 108, 2, 0.5)',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: row.attempts > 1 ? 'error.main' : 'text.primary',
                          fontWeight: row.attempts > 1 ? 600 : 400
                        }}
                      >
                        {row.attempts || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(row.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.status === "failed" && (
                        <Tooltip title="Resend message">
                          <IconButton
                            onClick={() => resend(row.id)}
                            disabled={resending === row.id}
                            color="primary"
                            size="small"
                            sx={{
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                transform: 'scale(1.2) rotate(90deg)',
                                boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
                                bgcolor: 'rgba(21, 101, 192, 0.1)',
                              }
                            }}
                          >
                            {resending === row.id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Refresh />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {filter === "failed" ? "No failed messages found" : "No messages found"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Messages will appear here once you start sending appointment reminders
                      </Typography>
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
