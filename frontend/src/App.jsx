import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

/**
 * Splash / Landing — public landing page
 */
function Splash() {
  const { isAuth } = useAuth();

  if (isAuth) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" }}></div>
        <div className="absolute w-72 h-72 bottom-20 left-10 bg-outdar-yellow/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-10s" }}></div>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-8 rounded-2xl bg-outdar-red flex items-center justify-center shadow-red-lg">
          <span className="text-4xl">🚪</span>
        </div>

        <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-full mb-6 font-medium">
          🎉 Slice 2 Complete
        </span>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-tight text-gray-900 dark:text-white mb-4">
          OU<span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">TD</span>AR
        </h1>

        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-10">
          — Discover. Connect. Explore. —
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/login"
            className="px-8 py-3.5 bg-outdar-red text-white rounded-xl font-semibold shadow-red hover:-translate-y-0.5 hover:shadow-red-lg transition-all"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-8 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            Sign up free →
          </Link>
        </div>

        <div className="mt-12 max-w-md text-xs text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
          🎯 Full auth flow live · register, login, JWT, protected routes, session persistence
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;