import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth, adminFetchMe } from './store/adminSlice';
import store from './store';
import BrandLoader from './components/ui/BrandLoader';
import ErrorBoundary from './components/ErrorBoundary';

const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminListings = lazy(() => import('./pages/Admin/AdminListings'));
const AdminContributors = lazy(() => import('./pages/Admin/AdminContributors'));
const ContributorProfile = lazy(() => import('./pages/Admin/ContributorProfile'));
const AdminCategories = lazy(() => import('./pages/Admin/AdminCategories'));
const AdminActivity = lazy(() => import('./pages/Admin/AdminActivity'));
const ListedItems = lazy(() => import('./pages/Admin/ListedItems'));
const ListingReview = lazy(() => import('./pages/Admin/ListingReview'));

function RequireAdmin({ children }) {
  const { isAdminLoggedIn } = useAdminAuth();
  const location = useLocation();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const session = localStorage.getItem('wvz_admin_session');
    if (token && session) {
      store.dispatch(adminFetchMe());
    }

    const handleForceLogout = () => {
      window.location.href = '/admin/login';
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<BrandLoader />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="listings/:type/:id" element={<ListingReview />} />
              <Route path="approved-items" element={<ListedItems />} />
              <Route path="approved-items/:category" element={<ListedItems />} />
              <Route path="contributors" element={<AdminContributors />} />
              <Route path="contributors/:id" element={<ContributorProfile />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="activity" element={<AdminActivity />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;