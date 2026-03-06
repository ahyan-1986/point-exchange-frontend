import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box } from '@mui/material';
import api from '../api/client';

export default function ListPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch partners'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
      <Card sx={{ minWidth: 700, boxShadow: 3 }}>
        <CardHeader title="All Partners" sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }} />
        <CardContent>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          <TableContainer component={Paper} sx={{ mt: 2, minWidth: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>API Key</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Default Rate</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.api_key}</TableCell>
                    <TableCell>{row.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.rate ?? '-'}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                  </TableRow>
                ))}
                {partners.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No partners found.</TableCell>
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
