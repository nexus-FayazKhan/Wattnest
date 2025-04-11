import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Tips from './pages/Tips';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProtectedLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  
  // Hide footer on dashboard page for better visualization experience
  const hideFooter = location.pathname === '/dashboard';

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-amber-50 dark:bg-dark-primary">
        <div className="flex-grow">
          <Outlet />
        </div>
        {!hideFooter && <Footer />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
};

// Public Layout Component
const PublicLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-dark-primary dark:via-dark-secondary dark:to-dark-tertiary">
        {children}
      </div>
    </ThemeProvider>
  );
};

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={
          <PublicLayout>
            {!isSignedIn ? <SignInPage /> : <Navigate to="/dashboard" replace />}
          </PublicLayout>
        } />
        <Route path="/sign-up" element={
          <PublicLayout>
            {!isSignedIn ? <SignUpPage /> : <Navigate to="/dashboard" replace />}
          </PublicLayout>
        } />
        
        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tips" element={<Tips />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
