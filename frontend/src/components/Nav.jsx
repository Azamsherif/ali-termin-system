import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Dashboard, 
  Event, 
  Message, 
  Settings,
  ExitToApp,
  DarkMode,
  LightMode 
} from "@mui/icons-material";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function Nav({ darkMode, toggleDarkMode }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        mb: 3,
        background: darkMode 
          ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0, 
            fontWeight: 700,
            mr: 4,
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {t("app")}
        </Typography>
        
        {token && (
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <Button
              startIcon={<Dashboard />}
              color="inherit"
              component={Link}
              to="/dashboard"
              sx={{
                bgcolor: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("dashboard")}
            </Button>
            <Button
              startIcon={<Event />}
              color="inherit"
              component={Link}
              to="/appointments"
              sx={{
                bgcolor: isActive('/appointments') ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("appointments")}
            </Button>
            <Button
              startIcon={<Message />}
              color="inherit"
              component={Link}
              to="/messages"
              sx={{
                bgcolor: isActive('/messages') ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("messages")}
            </Button>
            <Button
              startIcon={<Settings />}
              color="inherit"
              component={Link}
              to="/settings"
              sx={{
                bgcolor: isActive('/settings') ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("settings")}
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {!token && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.4)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("register") || "Register"}
            </Button>
          )}
          
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'rotate(180deg) scale(1.1)',
                }
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          
          <LanguageSwitcher />
          
          {token && (
            <Tooltip title={t("logout")}>
              <IconButton
                color="inherit"
                onClick={logout}
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px) rotate(5deg)',
                  }
                }}
              >
                <ExitToApp />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
