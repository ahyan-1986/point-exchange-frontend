import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, Typography, Alert, CircularProgress, Box } from '@mui/material';
import api from '../api/client';

export default function RegisterPartner() {
  const [form, setForm] = useState({
    name: '',
    rate: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/partners', { name: form.name, rate: Number(form.rate) });
      setSuccess(`Registered! Partner ID: ${res.data.id}`);
      setForm({ name: '', rate: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Card sx={{ minWidth: 400, boxShadow: 3 }}>
        <CardHeader title="Register New Partner" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter your organization name and default exchange rate to register as a partner.
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              label="Partner Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              helperText="This will be visible to other partners."
            />
            <TextField
              label="Default Exchange Rate"
              name="rate"
              value={form.rate}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
              helperText="e.g. 0.00025 (1 point = 0.00025 USD)"
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}
