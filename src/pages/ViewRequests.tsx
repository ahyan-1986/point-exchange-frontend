import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress, Box, MenuItem } from '@mui/material';
import api from '../api/client';

export default function ViewRequests() {
  const [partnerId, setPartnerId] = useState('');
  const [partners, setPartners] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
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

  const fetchRequests = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get(`/partners/${partnerId}/swaps/requested`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
      <Card sx={{ minWidth: 800, boxShadow: 3 }}>
        <CardHeader title="View Swap Requests" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Select your Partner to view all swap requests you have made.
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Partner"
              value={partnerId}
              onChange={e => setPartnerId(e.target.value)}
              disabled={partnersLoading}
              sx={{ minWidth: 250 }}
            >
              {partners.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={fetchRequests} disabled={loading || !partnerId}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch'}
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TableContainer component={Paper} sx={{ mt: 2, minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source Points</TableCell>
                  <TableCell>USD Value</TableCell>
                  <TableCell>Target Partner</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.source_points}</TableCell>
                    <TableCell>{row.usd_value}</TableCell>
                    <TableCell>{row.target_partner_name ? `${row.target_partner_name} (${row.target_partner_id})` : row.target_partner_id}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No requests found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
