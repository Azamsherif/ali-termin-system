import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem, Box } from "@mui/material";
import { Language } from "@mui/icons-material";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const onChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 130 }}>
      <Select
        value={i18n.language}
        onChange={onChange}
        sx={{
          color: 'inherit',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 1)',
          },
          '& .MuiSelect-icon': {
            color: 'inherit',
            transition: 'transform 0.3s ease',
          },
          '&:hover .MuiSelect-icon': {
            transform: 'rotate(180deg)',
          },
        }}
        startAdornment={
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Language fontSize="small" />
          </Box>
        }
      >
        <MenuItem 
          value="de"
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(21, 101, 192, 0.1)',
              transform: 'scale(1.02)',
            }
          }}
        >
          🇩🇪 Deutsch
        </MenuItem>
        <MenuItem 
          value="fr"
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(21, 101, 192, 0.1)',
              transform: 'scale(1.02)',
            }
          }}
        >
          🇫🇷 Français
        </MenuItem>
        <MenuItem 
          value="it"
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(21, 101, 192, 0.1)',
              transform: 'scale(1.02)',
            }
          }}
        >
          🇮🇹 Italiano
        </MenuItem>
      </Select>
    </FormControl>
  );
}
