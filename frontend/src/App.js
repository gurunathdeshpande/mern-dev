import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Analytics from './components/Analytics';
import FeedbackList from './components/FeedbackList';
import FeedbackForm from './components/FeedbackForm';
import Profile from './components/Profile';
import FloatingFeedback from './components/FloatingFeedback';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
};

// Router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <>
              <Login />
              <FloatingFeedback />
            </>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <>
              <Register />
              <FloatingFeedback />
            </>
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <Dashboard />
              <FloatingFeedback />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <Analytics />
              <FloatingFeedback />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <FeedbackList />
              <FloatingFeedback />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback/new"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <FeedbackForm />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback/edit/:id"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <FeedbackForm />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <>
              <Navigation />
              <Profile />
              <FloatingFeedback />
            </>
          </PrivateRoute>
        }
      />
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;