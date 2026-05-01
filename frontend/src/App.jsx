import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";

/**
 * Splash / Landing page
 * Shows the same content as before BUT now with a "Login" button to test!
 */
function Splash() {
  const { isAuth } = useAuth();

  // If logged in, redirect to /home
  if (isAuth) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" }}></div>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-8 rounded-2xl bg-outdar-red flex items-center justify-center shadow-red-lg">
          <span className="text-4xl">🚪</span>
        </div>

        <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-full mb-6 font-medium">
          🔐 Slice 2 Active
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
            Sign in →
          </Link>
          <button
            disabled
            className="px-8 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-gray-400 dark:text-gray-600 cursor-not-allowed"
            title="Coming in Step 10"
          >
            Sign up (Step 10)
          </button>
        </div>

        <div className="mt-12 max-w-md text-xs text-gray-500 dark:text-gray-400 font-mono">
          🎯 Test the auth flow! Use the credentials you registered earlier.
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;