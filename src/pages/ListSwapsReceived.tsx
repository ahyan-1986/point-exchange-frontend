import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, TextField, Button, MenuItem } from '@mui/material';
import api from '../api/client';

export default function ListSwapsReceived() {
  const [partnerId, setPartnerId] = useState('');
  const [partners, setPartners] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(() => setPartners([]));
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/partners/${partnerId}/swaps/received`);
      setSwaps(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch swaps');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id: string) => {
    setClaiming(id);
    setError('');
    setSuccess('');
    try {
      await api.post('/swap/confirm', { id });
      setSuccess('Swap approved successfully!');
      fetchSwaps();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve swap');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
      <Card sx={{ minWidth: 900, boxShadow: 3 }}>
        <CardHeader title="Swaps Requested To Me" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Select your Partner to view all swap requests where you are the target partner.
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Partner"
              value={partnerId}
              onChange={e => setPartnerId(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Select Partner</MenuItem>
              {partners.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={fetchSwaps} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch'}
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TableContainer component={Paper} sx={{ mt: 2, minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source Partner</TableCell>
                  <TableCell>Source Points</TableCell>
                  <TableCell>USD Value</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {swaps.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{
                      partners.find((p: any) => p.id === row.source_partner_id)?.name
                        ? `${partners.find((p: any) => p.id === row.source_partner_id)?.name} (${row.source_partner_id})`
                        : row.source_partner_id
                    }</TableCell>
                    <TableCell>{row.source_points}</TableCell>
                    <TableCell>{row.usd_value}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                    <TableCell>
                      {row.status === 'PENDING' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleClaim(row.id)}
                          disabled={claiming === row.id}
                        >
                          {claiming === row.id ? <CircularProgress size={18} color="inherit" /> : 'Approve'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {swaps.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No swaps found.</TableCell>
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
