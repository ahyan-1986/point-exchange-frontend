import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, TextField, Button, MenuItem } from '@mui/material';
import api from '../api/client';

export default function ListSwaps() {
  const [filter, setFilter] = useState({ status: '', source_partner_id: '', target_partner_id: '' });
  const [swaps, setSwaps] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(() => setPartners([]));
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v));
      const res = await api.get('/swaps', { params });
      setSwaps(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch swaps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
      <Card sx={{ minWidth: 900, boxShadow: 3 }}>
        <CardHeader title="All Swap Records" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Status"
              value={filter.status}
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </TextField>
            <TextField
              select
              label="Source Partner"
              value={filter.source_partner_id}
              onChange={e => setFilter(f => ({ ...f, source_partner_id: e.target.value }))}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All</MenuItem>
              {partners.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Target Partner"
              value={filter.target_partner_id}
              onChange={e => setFilter(f => ({ ...f, target_partner_id: e.target.value }))}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All</MenuItem>
              {partners.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={fetchSwaps} disabled={loading}>Fetch</Button>
          </Box>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          <TableContainer component={Paper} sx={{ mt: 2, minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source Partner</TableCell>
                  <TableCell>Target Partner</TableCell>
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
                    <TableCell>{row.source_partner_id}</TableCell>
                    <TableCell>{row.target_partner_id}</TableCell>
                    <TableCell>{row.source_points}</TableCell>
                    <TableCell>{row.usd_value}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
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
