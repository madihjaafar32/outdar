import { useAuth } from "../context/AuthContext.jsx";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800">
      {/* Floating bubbles bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" }}></div>
      </div>

      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-4xl shadow-red-lg">
          🎉
        </div>

        <h1 className="font-display font-extrabold text-4xl tracking-tight text-gray-900 dark:text-white mb-3">
          Welcome, <span className="text-outdar-red">{user?.name?.split(" ")[0]}</span>!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          You're successfully logged in to OUTDAR.
          The full home feed comes alive in <strong className="text-outdar-red">Slice 3</strong> when we build the Events feature!
        </p>

        {/* User info card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6 text-left">
          <div className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Your account
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="text-gray-900 dark:text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Role</span>
              <span className="text-outdar-red font-semibold uppercase text-xs px-2 py-0.5 bg-outdar-red/10 rounded-full">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">City</span>
              <span className="text-gray-900 dark:text-white font-medium">{user?.city}</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white hover:border-outdar-red hover:text-outdar-red transition-all"
        >
          Logout →
        </button>
      </div>
    </div>
  );
}

export default Home;