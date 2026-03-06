import { useState } from 'react';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, TextField, Button } from '@mui/material';
import api from '../api/client';

export default function ListRates() {
  const [partnerId, setPartnerId] = useState('');
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/partners/${partnerId}/rates`);
      setRates(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
      <Card sx={{ minWidth: 700, boxShadow: 3 }}>
        <CardHeader title="Partner Rates" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Partner ID" value={partnerId} onChange={e => setPartnerId(e.target.value)} />
            <Button variant="contained" onClick={fetchRates} disabled={loading}>Fetch</Button>
          </Box>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rate ID</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rates.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.from_partner_id}</TableCell>
                    <TableCell>{row.to_partner_id}</TableCell>
                    <TableCell>{row.rate}</TableCell>
                    <TableCell>{row.updated_at}</TableCell>
                  </TableRow>
                ))}
                {rates.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No rates found.</TableCell>
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
