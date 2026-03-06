import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Box, useTheme, useMediaQuery } from '@mui/material';
import RegisterPartner from './pages/RegisterPartner';
import SwapRequest from './pages/SwapRequest';
import ViewRequests from './pages/ViewRequests';
import ListPartners from './pages/ListPartners';
import ListSwaps from './pages/ListSwaps';
import ListSwapsReceived from './pages/ListSwapsReceived';
import { useState } from 'react';

const drawerWidth = 220;

const navItems = [
  { label: 'Register Partner', path: '/register' },
  { label: 'All Partners', path: '/partners' },
  { label: 'Swap Request', path: '/swap' },
  { label: 'All Swaps', path: '/swaps' },
  { label: 'View Requests', path: '/requests' },
  { label: 'Swaps To Me', path: '/swaps-to-me' },
];

function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary">
          Point Exchange
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path} onClick={() => setMobileOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Point Exchange Demo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 8, overflow: 'auto', height: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<RegisterPartner />} />
          <Route path="/partners" element={<ListPartners />} />
          <Route path="/swap" element={<SwapRequest />} />
          <Route path="/swaps" element={<ListSwaps />} />
          <Route path="/requests" element={<ViewRequests />} />
          <Route path="/swaps-to-me" element={<ListSwapsReceived />} />
          <Route path="*" element={<RegisterPartner />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
