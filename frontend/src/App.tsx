import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStock from './pages/admin/AdminStock';
import AdminProfile from './pages/admin/AdminProfile';
import UserProfile from './pages/UserProfile';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Qr from './pages/Qr';
import Wup from './pages/Wup';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Term from './pages/policy/Term';
import Refund from './pages/policy/Refund';
import Privacy from './pages/policy/Privacy';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin routes — own layout, no public header/footer */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index            element={<Dashboard />} />
          <Route path="products"  element={<AdminProducts />} />
          <Route path="orders"    element={<AdminOrders />} />
          <Route path="users"     element={<AdminUsers />} />
          <Route path="stock"        element={<AdminStock />} />
          <Route path="jobs"         element={<AdminJobs />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="profile"      element={<AdminProfile />} />
        </Route>

        {/* Public routes — shared header/footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/services"  element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/contact"   element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login"     element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/qr"        element={<PublicLayout><Qr /></PublicLayout>} />
        <Route path="/cart"      element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/orders"    element={<PublicLayout><Orders /></PublicLayout>} />
        <Route path="/profile"   element={<PublicLayout><ProtectedRoute><UserProfile /></ProtectedRoute></PublicLayout>} />
        <Route path="/term"      element={<PublicLayout><Term /></PublicLayout>} />
        <Route path="/privacy"   element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/refund"    element={<PublicLayout><Refund /></PublicLayout>} />
        <Route path="/whatsup"   element={<PublicLayout><Wup /></PublicLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
