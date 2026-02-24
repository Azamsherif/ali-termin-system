import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api.js";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Chip,
  Paper
} from "@mui/material";
import { 
  Event, 
  Message, 
  ErrorOutline,
  TrendingUp
} from "@mui/icons-material";

export default function Dashboard() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apptRes, msgRes] = await Promise.all([
          API.get("/api/appointments").catch(() => ({ data: [] })),
          API.get("/api/messages").catch(() => ({ data: [] }))
        ]);
        setAppointments(apptRes.data);
        setMessages(msgRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const failedCount = useMemo(() => messages.filter(m => m.status === "failed").length, [messages]);
  const successCount = useMemo(() => messages.filter(m => m.status === "sent").length, [messages]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 300 }}>
        {t("dashboard")}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title={t("appointments")} 
            value={appointments.length} 
            icon={<Event />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title={t("messages")} 
            value={messages.length} 
            icon={<Message />}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Successful Messages" 
            value={successCount} 
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title={t("failed")} 
            value={failedCount} 
            icon={<ErrorOutline />}
            color="error"
          />
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mt: 2,
              background: (theme) => theme.palette.mode === 'dark' 
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 136, 229, 0.03) 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(21, 101, 192, 0.02) 100%)`,
              border: (theme) => theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.05)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                  : '0 8px 32px rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TrendingUp color="primary" />
              Recent Activity
            </Typography>
            {appointments.length > 0 ? (
              <Box>
                {appointments.slice(0, 5).map((appt, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      borderBottom: idx < 4 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(30, 136, 229, 0.08)' 
                          : 'rgba(21, 101, 192, 0.04)',
                        transform: 'translateX(8px)',
                        borderRadius: 2,
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {appt.client_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appt.phone} • {new Date(appt.appointment_datetime).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={appt.status} 
                      color={appt.status === 'confirmed' ? 'success' : 'default'} 
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: 600,
                        boxShadow: appt.status === 'confirmed' 
                          ? '0 2px 8px rgba(46, 125, 50, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box 
                textAlign="center" 
                py={4}
                sx={{
                  opacity: 0.7,
                  transition: 'opacity 0.3s ease',
                  '&:hover': { opacity: 1 }
                }}
              >
                <Event sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary" variant="h6">
                  No recent appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Appointments will appear here once you start creating them
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%',
        background: (theme) => theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 136, 229, 0.05) 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(21, 101, 192, 0.03) 100%)`,
        border: (theme) => theme.palette.mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 16px 40px rgba(30, 136, 229, 0.2), 0 0 20px rgba(30, 136, 229, 0.1)'
            : '0 16px 40px rgba(21, 101, 192, 0.2), 0 0 20px rgba(21, 101, 192, 0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="body2"
              sx={{ 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${color === 'primary' ? '#1565c0' : 
                  color === 'success' ? '#2e7d32' : 
                  color === 'error' ? '#c62828' : '#ed6c02'} 0%, ${
                  color === 'primary' ? '#42a5f5' : 
                  color === 'success' ? '#66bb6a' : 
                  color === 'error' ? '#ef5350' : '#ffb74d'} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              background: `linear-gradient(135deg, ${
                color === 'primary' ? '#1565c0' : 
                color === 'success' ? '#2e7d32' : 
                color === 'error' ? '#c62828' : '#ed6c02'} 0%, ${
                color === 'primary' ? '#42a5f5' : 
                color === 'success' ? '#66bb6a' : 
                color === 'error' ? '#ef5350' : '#ffb74d'} 100%)`,
              color: 'white', 
              borderRadius: '16px', 
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 56,
              minHeight: 56,
              boxShadow: `0 4px 20px ${
                color === 'primary' ? 'rgba(21, 101, 192, 0.3)' : 
                color === 'success' ? 'rgba(46, 125, 50, 0.3)' : 
                color === 'error' ? 'rgba(198, 40, 40, 0.3)' : 'rgba(237, 108, 2, 0.3)'
              }`,
              transition: 'all 0.3s ease',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
