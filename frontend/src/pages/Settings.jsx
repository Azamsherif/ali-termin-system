import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Message,
  WhatsApp,
  Sms,
  Language,
  Save,
  RestartAlt
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Message Templates State
  const [templates, setTemplates] = useState({
    reminder_24: {
      de: 'Erinnerung: Sie haben morgen um {{time}} Uhr einen Termin bei {{company}}. {{cancel}}',
      fr: 'Rappel: Vous avez un rendez-vous demain à {{time}} chez {{company}}. {{cancel}}',
      it: 'Promemoria: Hai un appuntamento domani alle {{time}} presso {{company}}. {{cancel}}'
    },
    reminder_2: {
      de: 'Erinnerung: Ihr Termin beginnt in 2 Stunden ({{time}} Uhr) bei {{company}}.',
      fr: 'Rappel: Votre rendez-vous commence dans 2 heures ({{time}}) chez {{company}}.',
      it: 'Promemoria: Il tuo appuntamento inizia tra 2 ore ({{time}}) presso {{company}}.'
    }
  });

  // Company Settings State  
  const [companySettings, setCompanySettings] = useState({
    company_name: '',
    timezone: 'Europe/Zurich',
    default_language: 'de',
    whatsapp_enabled: false,
    sms_enabled: true
  });

  // Twilio Settings State
  const [twilioSettings, setTwilioSettings] = useState({
    account_sid: '',
    auth_token: '',
    sms_from: '',
    whatsapp_from: '',
    mock_messaging: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load company settings, templates, etc. from API
      // For now using dummy data
      setMessage('');
      setError('');
    } catch (err) {
      setError('Fehler beim Laden der Einstellungen');
    }
  };

  const saveSettings = async (settingsType) => {
    setSaving(true);
    try {
      // Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setMessage('Einstellungen erfolgreich gespeichert');
    } catch (err) {
      setError('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMS = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    
    try {
      const API = (await import('../api.js')).default;
      const response = await API.post('/api/settings/test-sms', {
        phone: '+201007240656' // Default test phone number
      });
      
      setMessage(response.data.message || '✅ Test SMS erfolgreich gesendet!');
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Fehler beim SMS-Versand');
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    
    try {
      const API = (await import('../api.js')).default;
      const response = await API.post('/api/settings/test-whatsapp', {
        phone: '+201007240656' // Default test phone number
      });
      
      setMessage(response.data.message || '✅ Test WhatsApp erfolgreich gesendet!');
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Fehler beim WhatsApp-Versand');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const availableTimezones = [
    'Europe/Zurich',
    'Europe/Berlin', 
    'Europe/Vienna',
    'Europe/Rome',
    'Europe/Paris'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #1e88e5 0%, #42a5f5 100%)'
            : 'linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <SettingsIcon /> Einstellungen
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<SettingsIcon />} label="Allgemein" />
          <Tab icon={<Message />} label="Nachrichten Vorlagen" />
          <Tab icon={<WhatsApp />} label="Twilio Einstellungen" />
          <Tab icon={<Language />} label="Sprache & Region" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Unternehmenseinstellungen" />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Unternehmensname"
                      value={companySettings.company_name}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        company_name: e.target.value
                      }))}
                    />
                    
                    <FormControl fullWidth>
                      <InputLabel>Zeitzone</InputLabel>
                      <Select
                        value={companySettings.timezone}
                        onChange={(e) => setCompanySettings(prev => ({
                          ...prev,
                          timezone: e.target.value
                        }))}
                      >
                        {availableTimezones.map(tz => (
                          <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Standard Sprache</InputLabel>
                      <Select
                        value={companySettings.default_language}
                        onChange={(e) => setCompanySettings(prev => ({
                          ...prev,
                          default_language: e.target.value
                        }))}
                      >
                        <MenuItem value="de">Deutsch</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="it">Italiano</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Messaging Einstellungen" />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={companySettings.sms_enabled}
                          onChange={(e) => setCompanySettings(prev => ({
                            ...prev,
                            sms_enabled: e.target.checked
                          }))}
                        />
                      }
                      label="SMS aktiviert"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={companySettings.whatsapp_enabled}
                          onChange={(e) => setCompanySettings(prev => ({
                            ...prev,
                            whatsapp_enabled: e.target.checked
                          }))}
                        />
                      }
                      label="WhatsApp aktiviert"
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => saveSettings('company')}
                    disabled={saving}
                    sx={{ mt: 3 }}
                  >
                    {saving ? 'Speichern...' : 'Speichern'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Message Templates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Nachrichten Vorlagen
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Verfuegbare Platzhalter: {'{{time}}'}, {'{{company}}'}, {'{{cancel}}'}
            </Typography>

            <Grid container spacing={3}>
              {/* 24h Reminder Templates */}
              <Grid item xs={12}>
                <Card elevation={1}>
                  <CardHeader 
                    title="24 Stunden Erinnerung"
                    avatar={<Chip label="24h" color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Deutsch"
                          multiline
                          rows={3}
                          value={templates.reminder_24.de}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_24: { ...prev.reminder_24, de: e.target.value }
                          }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Français"
                          multiline
                          rows={3}
                          value={templates.reminder_24.fr}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_24: { ...prev.reminder_24, fr: e.target.value }
                          }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Italiano"
                          multiline
                          rows={3}
                          value={templates.reminder_24.it}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_24: { ...prev.reminder_24, it: e.target.value }
                          }))}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* 2h Reminder Templates */}
              <Grid item xs={12}>
                <Card elevation={1}>
                  <CardHeader 
                    title="2 Stunden Erinnerung"
                    avatar={<Chip label="2h" color="secondary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Deutsch"
                          multiline
                          rows={3}
                          value={templates.reminder_2.de}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_2: { ...prev.reminder_2, de: e.target.value }
                          }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Français"
                          multiline
                          rows={3}
                          value={templates.reminder_2.fr}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_2: { ...prev.reminder_2, fr: e.target.value }
                          }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Italiano"
                          multiline
                          rows={3}
                          value={templates.reminder_2.it}
                          onChange={(e) => setTemplates(prev => ({
                            ...prev,
                            reminder_2: { ...prev.reminder_2, it: e.target.value }
                          }))}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => saveSettings('templates')}
                  disabled={saving}
                >
                  {saving ? 'Speichern...' : 'Vorlagen Speichern'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Twilio Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Twilio API Einstellungen" />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Account SID"
                      value={twilioSettings.account_sid}
                      onChange={(e) => setTwilioSettings(prev => ({
                        ...prev,
                        account_sid: e.target.value
                      }))}
                      helperText="Ihr Twilio Account SID"
                    />
                    
                    <TextField
                      fullWidth
                      type="password"
                      label="Auth Token"
                      value={twilioSettings.auth_token}
                      onChange={(e) => setTwilioSettings(prev => ({
                        ...prev,
                        auth_token: e.target.value
                      }))}
                      helperText="Ihr Twilio Auth Token"
                    />
                    
                    <TextField
                      fullWidth
                      label="SMS Von Nummer"
                      value={twilioSettings.sms_from}
                      onChange={(e) => setTwilioSettings(prev => ({
                        ...prev,
                        sms_from: e.target.value
                      }))}
                      placeholder="+4179XXXXXXX"
                      helperText="Ihre Twilio SMS Nummer"
                    />
                    
                    <TextField
                      fullWidth
                      label="WhatsApp Von Nummer"
                      value={twilioSettings.whatsapp_from}
                      onChange={(e) => setTwilioSettings(prev => ({
                        ...prev,
                        whatsapp_from: e.target.value
                      }))}
                      placeholder="whatsapp:+4179XXXXXXX"
                      helperText="Ihre Twilio WhatsApp Nummer"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={twilioSettings.mock_messaging}
                          onChange={(e) => setTwilioSettings(prev => ({
                            ...prev,
                            mock_messaging: e.target.checked
                          }))}
                        />
                      }
                      label="Test Modus (keine echten Nachrichten)"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Verbindungstest" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Testen Sie Ihre Twilio Verbindung
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Sms />}
                      onClick={handleTestSMS}
                      disabled={saving}
                      fullWidth
                    >
                      💬 SMS Test senden
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<WhatsApp />}
                      onClick={handleTestWhatsApp}
                      disabled={saving}
                      fullWidth
                    >
                      WhatsApp Test senden
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={() => saveSettings('twilio')}
                      disabled={saving}
                      fullWidth
                    >
                      {saving ? 'Speichern...' : 'Twilio Einstellungen Speichern'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Language & Region Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Interface Sprache" />
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Wählen Sie die Sprache für die Benutzeroberfläche
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {[
                        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                        { code: 'fr', label: 'Français', flag: '🇫🇷' },
                        { code: 'it', label: 'Italiano', flag: '🇮🇹' }
                      ].map(lang => (
                        <Chip
                          key={lang.code}
                          icon={<span>{lang.flag}</span>}
                          label={lang.label}
                          onClick={() => handleLanguageChange(lang.code)}
                          color={i18n.language === lang.code ? 'primary' : 'default'}
                          variant={i18n.language === lang.code ? 'filled' : 'outlined'}
                          clickable
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Aktuelle Sprache: {i18n.language}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="System Informationen" />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Version: Ali Termin System v1.0
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Zeitzone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Browser Sprache: {navigator.language}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      startIcon={<RestartAlt />}
                      onClick={() => window.location.reload()}
                    >
                      Interface neu laden
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
}