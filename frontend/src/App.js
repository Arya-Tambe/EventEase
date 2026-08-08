import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';
import UserLayout from './components/UserLayout';
import VendorDashboard from './pages/VendorDashboard';
import VendorProfileSetup from './pages/VendorProfileSetup';
import VendorPortfolio from './pages/VendorPortfolio';
import VendorPackages from './pages/VendorPackages';
import VendorFacilities from './pages/VendorFacilities';
import VendorAvailability from './pages/VendorAvailability';
import VendorEnquiries from './pages/VendorEnquiries';
import VendorSearch from './pages/VendorSearch';
import AdminDashboard from './pages/AdminDashboard';
import VendorProfileView from './pages/VendorProfileView';
import SendEnquiry from './pages/SendEnquiry';
import Profile from './pages/Profile';
import SavedVendors from './pages/SavedVendors';
import Notifications from './pages/Notifications';
import VendorLayout from './components/VendorLayout';
import VendorProfileEdit from './pages/VendorProfileEdit';
import VendorVerification from './pages/VendorVerification';
import AdminLayout from './components/AdminLayout';
import AdminVendors from './pages/AdminVendors';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import LandingPage from './pages/LandingPage';
import MyEvents from './pages/MyEvents';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><UserLayout><Dashboard /></UserLayout></PrivateRoute>} />
      <Route path="/events/create" element={<PrivateRoute><UserLayout><CreateEvent /></UserLayout></PrivateRoute>} />
      <Route path="/events/:id" element={<PrivateRoute><UserLayout><EventDetail /></UserLayout></PrivateRoute>} />
      <Route path="/vendor/dashboard" element={<PrivateRoute><VendorLayout><VendorDashboard /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/profile/setup" element={<PrivateRoute><VendorProfileSetup /></PrivateRoute>} />
<Route path="/" element={<LandingPage />} />
<Route path="/home" element={<LandingPage />} />
<Route path="/vendor/portfolio" element={<PrivateRoute><VendorLayout><VendorPortfolio /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/packages" element={<PrivateRoute><VendorLayout><VendorPackages /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/facilities" element={<PrivateRoute><VendorLayout><VendorFacilities /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/availability" element={<PrivateRoute><VendorLayout><VendorAvailability /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/enquiries" element={<PrivateRoute><VendorLayout><VendorEnquiries /></VendorLayout></PrivateRoute>} />
      <Route path="/vendors/search" element={<PrivateRoute><VendorSearch /></PrivateRoute>} />
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
<Route path="/admin/vendors" element={<PrivateRoute><AdminLayout><AdminVendors /></AdminLayout></PrivateRoute>} />
<Route path="/admin/users" element={<PrivateRoute><AdminLayout><AdminUsers /></AdminLayout></PrivateRoute>} />
<Route path="/admin/analytics" element={<PrivateRoute><AdminLayout><AdminAnalytics /></AdminLayout></PrivateRoute>} />
      <Route path="/vendors/:id" element={<PrivateRoute><VendorProfileView /></PrivateRoute>} />
      <Route path="/enquiry/:vendorId" element={<PrivateRoute><SendEnquiry /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserLayout><Profile /></UserLayout></PrivateRoute>} />
      <Route path="/saved-vendors" element={<PrivateRoute><UserLayout><SavedVendors /></UserLayout></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><UserLayout><Notifications /></UserLayout></PrivateRoute>} />
      <Route path="/vendor/profile/edit" element={<PrivateRoute><VendorLayout><VendorProfileEdit /></VendorLayout></PrivateRoute>} />
<Route path="/vendor/verification" element={<PrivateRoute><VendorLayout><VendorVerification /></VendorLayout></PrivateRoute>} />
<Route path="/my-events" element={<PrivateRoute><UserLayout><MyEvents /></UserLayout></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;