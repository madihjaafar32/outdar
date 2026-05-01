import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication.
 * - If user is loading → show loading spinner
 * - If not logged in → redirect to /login (with "where to come back to" memory)
 * - If logged in → render the page
 *
 * Usage:
 *   <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */
function ProtectedRoute({ children }) {
  const { isAuth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin"></div>
          <div className="font-mono text-sm text-gray-500 dark:text-gray-400 tracking-wider">
            Checking your session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;