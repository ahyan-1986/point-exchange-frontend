import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, Typography, Alert, CircularProgress, Grid, Box, MenuItem } from '@mui/material';
import api from '../api/client';

export default function SwapRequest() {
  const [form, setForm] = useState({
    source_partner_id: '',
    source_external_id: '',
    source_customer_id: '',
    source_points: '',
    target_partner_id: '',
    target_customer_id: '',
  });
  const [partners, setPartners] = useState<any[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnersLoading, setPartnersLoading] = useState(false);

  useEffect(() => {
    setPartnersLoading(true);
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(() => setPartners([]))
      .finally(() => setPartnersLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/swap/deposit', {
        source_partner_id: form.source_partner_id,
        source_external_id: form.source_external_id,
        source_customer_id: form.source_customer_id,
        source_points: Number(form.source_points),
        target_partner_id: form.target_partner_id,
        target_customer_id: form.target_customer_id,
      });
      setSuccess(`Swap requested! Transaction ID: ${res.data.transaction_id}`);
      setForm({
        source_partner_id: '',
        source_external_id: '',
        source_customer_id: '',
        source_points: '',
        target_partner_id: '',
        target_customer_id: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Swap request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ minWidth: 500, boxShadow: 3 }}>
        <CardHeader title="Submit Swap Request" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Fill in the details to request a point swap between partners.
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Source Partner"
                  name="source_partner_id"
                  value={form.source_partner_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="Select your partner"
                  disabled={partnersLoading}
                >
                  {partners.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Source External ID" name="source_external_id" value={form.source_external_id} onChange={handleChange} fullWidth required helperText="External reference (optional)" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Source Customer ID" name="source_customer_id" value={form.source_customer_id} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Source Points" name="source_points" value={form.source_points} onChange={handleChange} fullWidth required type="number" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Target Partner"
                  name="target_partner_id"
                  value={form.target_partner_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="Select the target partner"
                  disabled={partnersLoading}
                >
                  {partners.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Target Customer ID" name="target_customer_id" value={form.target_customer_id} onChange={handleChange} fullWidth required />
              </Grid>
              {/* Rate field removed: rate is now calculated by backend */}
            </Grid>
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 3 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
            </Button>
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}
