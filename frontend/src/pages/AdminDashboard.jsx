/**
 * Admin Dashboard
 * Full platform management — Stripe-vibe, professional
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import * as adminService from "../services/admin.service.js";

// ── Sidebar nav items ────────────────────────────────────
const NAV = [
  { key: "dashboard",  icon: "📊", label: "Dashboard"   },
  { key: "analytics",  icon: "📈", label: "Analytics"   },
  { key: "hosts",      icon: "✓",  label: "Verify Hosts" },
  { key: "reports",    icon: "🚩", label: "Reports"     },
  { key: "users",      icon: "👥", label: "Users"        },
  { key: "events",     icon: "📅", label: "Events"       },
  { key: "categories", icon: "🏷️", label: "Categories"  },
];

// ── Stat Card ────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = "red" }) {
  const colors = {
    red:    "bg-outdar-red/10 text-outdar-red",
    sky:    "bg-outdar-sky/10 text-outdar-sky",
    green:  "bg-outdar-green/10 text-outdar-green",
    yellow: "bg-outdar-yellow/10 text-outdar-navy",
    orange: "bg-outdar-orange/10 text-outdar-orange",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
          {icon}
        </span>
      </div>
      <p className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-outdar-green mt-1">{sub}</p>}
    </div>
  );
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [pendingHosts, setPendingHosts] = useState([]);
  const [events, setEvents]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports]       = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchEvents, setSearchEvents] = useState("");
  const [reportFilter, setReportFilter] = useState("all");
  const [actionMsg, setActionMsg]   = useState("");

  // Load data based on active tab
  useEffect(() => {
    setIsLoading(true);
    setActionMsg("");

    const loaders = {
      dashboard:  () => adminService.getStats().then(r => setStats(r.data)),
      analytics:  () => adminService.getStats().then(r => {
                    setStats(r.data);
                    setAnalyticsData(r.data);
                  }),
      hosts:      () => adminService.getPendingHosts().then(r => setPendingHosts(r.data.hosts)),
      reports:    () => Promise.resolve(setReports([
                    { _id: "1", targetType: "Event", reason: "spam", status: "pending",
                      details: "This event looks fake", createdAt: new Date(), reporter: { name: "Nadia El Fassi" }, targetTitle: "Suspicious Event" },
                    { _id: "2", targetType: "User", reason: "harassment", status: "pending",
                      details: "User was rude in chat", createdAt: new Date(), reporter: { name: "Karim Tazi" }, targetTitle: "Unknown User" },
                    { _id: "3", targetType: "Event", reason: "inappropriate", status: "resolved",
                      details: "Resolved last week", createdAt: new Date(), reporter: { name: "Leila Amrani" }, targetTitle: "Old Event" },
                  ])),
      users:      () => adminService.getUsers({ limit: 50 }).then(r => setUsers(r.data.users)),
      events:     () => adminService.getAdminEvents({ limit: 50 }).then(r => setEvents(r.data.events)),
      categories: () => adminService.getCategories().then(r => setCategories(r.data.categories)),
    };

    loaders[activeTab]?.()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  // ── Actions ──────────────────────────────────────────────
  const handleVerify = async (userId, name) => {
    try {
      await adminService.verifyHost(userId);
      setActionMsg(`✅ ${name} is now a Verified Host!`);
      setPendingHosts(prev => prev.filter(h => h._id !== userId));
    } catch (err) {
      setActionMsg(`❌ ${err.response?.data?.message}`);
    }
  };

  const handleBan = async (userId, name) => {
    if (!confirm(`Ban ${name}? This cannot be undone.`)) return;
    try {
      await adminService.banUser(userId);
      setActionMsg(`🚫 ${name} has been banned`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      setActionMsg(`❌ ${err.response?.data?.message}`);
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!confirm(`Remove "${title}" from the platform?`)) return;
    try {
      await adminService.forceDeleteEvent(eventId);
      setActionMsg(`🗑️ "${title}" removed`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      setActionMsg(`❌ ${err.response?.data?.message}`);
    }
  };

  const handleResolveReport = (reportId) => {
    setReports(prev => prev.map(r =>
      r._id === reportId ? { ...r, status: "resolved" } : r
    ));
    setActionMsg("✅ Report marked as resolved");
  };

  const handleDismissReport = (reportId) => {
    setReports(prev => prev.map(r =>
      r._id === reportId ? { ...r, status: "dismissed" } : r
    ));
    setActionMsg("🗑️ Report dismissed");
  };

  // Filter helpers
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchEvents.toLowerCase())
  );
  const filteredReports =
  reportFilter === "all"
    ? reports
    : reports.filter(r => r.status === reportFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-outdar-red flex items-center justify-center text-lg">🚪</div>
            <div>
              <p className="font-display font-extrabold text-sm text-gray-900 dark:text-white">OUTDAR</p>
              <p className="text-xs text-outdar-red font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.key
                  ? "bg-outdar-red/10 text-outdar-red"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {item.key === "hosts" && pendingHosts.length > 0 && (
                <span className="ml-auto text-xs bg-outdar-red text-white px-1.5 py-0.5 rounded-full">
                  {pendingHosts.length}
                </span>
              )}
              {item.key === "reports" && reports.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-auto text-xs bg-outdar-orange text-white px-1.5 py-0.5 rounded-full">
                  {reports.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700">
            <div className="w-7 h-7 rounded-full bg-outdar-red flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-outdar-red">Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors py-1"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">

          {/* Action message */}
          {actionMsg && (
            <div className="mb-4 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white">
              {actionMsg}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin"></div>
            </div>
          )}

          {/* ── DASHBOARD TAB ── */}
          {!isLoading && activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                  Dashboard 📊
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Platform overview
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="👥" label="Total Users" value={stats.stats.totalUsers}
                  sub={`+${stats.stats.recentSignups} this week`} color="sky" />
                <StatCard icon="🎟️" label="Total Events" value={stats.stats.totalEvents}
                  sub={`${stats.stats.activeEvents} upcoming`} color="red" />
                <StatCard icon="🎤" label="Hosts" value={stats.stats.totalHosts}
                  sub={stats.stats.pendingHosts > 0 ? `${stats.stats.pendingHosts} pending` : "All verified"} color="orange" />
                <StatCard icon="👥" label="RSVPs" value={stats.stats.totalAttendances}
                  color="green" />
              </div>

              {/* Top events */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                  <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                    🔥 Most Popular Events
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {stats.topEvents.map((event, i) => (
                    <div key={event._id} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.category?.icon} {event.category?.name} · {event.location?.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-outdar-red">
                          {event.attendeeCount}
                        </p>
                        <p className="text-xs text-gray-400">going</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                  <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                    🏷️ Events by Category
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  {stats.categoryStats.map(({ category, count }) => (
                    category && (
                      <div key={category._id} className="flex items-center gap-3">
                        <span className="text-lg w-6">{category.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {category.name}
                            </span>
                            <span className="text-gray-500">{count} events</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(100, (count / stats.stats.totalEvents) * 100)}%`,
                                backgroundColor: category.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HOSTS TAB ── */}
          {!isLoading && activeTab === "hosts" && (
            <div className="space-y-4">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                  Verify Hosts ✓
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pendingHosts.length} host{pendingHosts.length !== 1 ? "s" : ""} waiting for verification
                </p>
              </div>

              {pendingHosts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="font-display font-bold text-gray-900 dark:text-white">
                    All caught up!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    No pending host verifications
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingHosts.map((host) => (
                    <div key={host._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                      {/* Avatar */}
                      {host.avatar ? (
                        <img src={host.avatar} alt={host.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                          {host.name?.[0]}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">{host.name}</p>
                          <span className="text-xs bg-outdar-orange/10 text-outdar-orange px-2 py-0.5 rounded-full font-medium">
                            Host
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{host.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>📍 {host.city}</span>
                          <span>📅 {host.eventCount || 0} events created</span>
                          <span>
                            Joined {new Date(host.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                        {host.bio && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {host.bio}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleVerify(host._id, host.name)}
                          className="px-4 py-2 bg-outdar-green text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleBan(host._id, host.name)}
                          className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:border-red-300 hover:text-red-400 transition-all"
                        >
                          Ban
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── USERS TAB ── */}
          {!isLoading && activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                    Users 👥
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {users.length} total users
                  </p>
                </div>
                <input
                  type="text"
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  placeholder="Search users..."
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-outdar-red"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">City</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-white text-xs font-bold">
                                {u.name?.[0]}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            u.role === "admin" ? "bg-outdar-red/10 text-outdar-red" :
                            u.role === "host"  ? "bg-outdar-orange/10 text-outdar-orange" :
                            "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                          }`}>
                            {u.role}
                            {u.isVerified && " ✓"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{u.city}</td>
                        <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short",
                          })}
                        </td>
                        <td className="px-5 py-3">
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleBan(u._id, u.name)}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                            >
                              Ban
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EVENTS TAB ── */}
          {!isLoading && activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                    Events 📅
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {events.length} total events
                  </p>
                </div>
                <input
                  type="text"
                  value={searchEvents}
                  onChange={(e) => setSearchEvents(e.target.value)}
                  placeholder="Search events..."
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-outdar-red"
                />
              </div>

              <div className="space-y-2">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{event.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>{event.category?.icon} {event.category?.name}</span>
                        <span>📍 {event.location?.city}</span>
                        <span>👥 {event.attendeeCount}/{event.capacity}</span>
                        <span>🎤 {event.host?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        new Date(event.date) > new Date()
                          ? "bg-outdar-green/10 text-outdar-green"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-500"
                      }`}>
                        {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                      </span>
                      <button
                        onClick={() => handleDeleteEvent(event._id, event.title)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {!isLoading && activeTab === "analytics" && analyticsData && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                  Analytics 📈
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Platform performance overview
                </p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="🎟️" label="Total RSVPs"       value={analyticsData.stats.totalAttendances} color="red"    />
                <StatCard icon="⭐" label="Total Reviews"      value={analyticsData.stats.totalReviews}     color="yellow" />
                <StatCard icon="📅" label="Active Events"      value={analyticsData.stats.activeEvents}     color="green"  />
                <StatCard icon="🎤" label="Verified Hosts"
                  value={analyticsData.stats.totalHosts - analyticsData.stats.pendingHosts}
                  color="sky" />
              </div>

              {/* Events by category bars */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                    🏷️ Events by Category
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {analyticsData.stats.totalEvents} total
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  {analyticsData.categoryStats.map(({ category, count }) =>
                    category && (
                      <div key={category._id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {category.icon} {category.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {count} events ({Math.round((count / analyticsData.stats.totalEvents) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (count / analyticsData.stats.totalEvents) * 100)}%`,
                              backgroundColor: category.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Top events table */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                  <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                    🔥 Top Events by Attendance
                  </h2>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-slate-700">
                  {analyticsData.topEvents.map((event, i) => {
                    const fillPct = Math.round((event.attendeeCount / event.capacity) * 100);
                    return (
                      <div key={event._id} className="px-5 py-4 flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${fillPct}%`,
                                  backgroundColor: fillPct >= 80 ? "#E63946" : "#7CB342",
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {fillPct}% full
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-outdar-red">
                            {event.attendeeCount}/{event.capacity}
                          </p>
                          <p className="text-xs text-gray-400">attendees</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 text-center">
                  <p className="text-3xl font-extrabold text-outdar-red mb-1">
                    {analyticsData.stats.totalUsers + analyticsData.stats.totalHosts}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 text-center">
                  <p className="text-3xl font-extrabold text-outdar-green mb-1">
                    {analyticsData.stats.totalEvents > 0
                      ? Math.round((analyticsData.stats.totalAttendances / analyticsData.stats.totalEvents) * 10) / 10
                      : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg RSVPs per Event</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 text-center">
                  <p className="text-3xl font-extrabold text-outdar-sky mb-1">
                    +{analyticsData.stats.recentSignups}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">New Users This Week</p>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS TAB ── */}
          {!isLoading && activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                    Reports 🚩
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reports.filter(r => r.status === "pending").length} pending · {reports.length} total
                  </p>
                </div>
                <div className="flex gap-2">
                  {["all", "pending", "resolved"].map((filter) => (
                    <button key={filter}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 capitalize hover:border-outdar-red hover:text-outdar-red transition-all">
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="font-display font-bold text-gray-900 dark:text-white">No reports!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform is clean 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report._id}
                      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all ${
                        report.status === "pending"
                          ? "border-outdar-orange/40 dark:border-outdar-orange/30"
                          : "border-gray-100 dark:border-slate-700 opacity-60"
                      }`}>
                      <div className="flex items-start gap-4">

                        {/* Priority indicator */}
                        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                          report.status === "pending" ? "bg-outdar-orange" : "bg-gray-200 dark:bg-slate-600"
                        }`}></div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              report.reason === "spam"         ? "bg-yellow-100 text-yellow-700" :
                              report.reason === "harassment"   ? "bg-red-100 text-red-700" :
                              report.reason === "inappropriate"? "bg-orange-100 text-orange-700" :
                              report.reason === "scam"         ? "bg-purple-100 text-purple-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {report.reason}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {report.targetType}
                            </span>
                            <span className={`text-xs font-semibold ml-auto px-2 py-0.5 rounded-full ${
                              report.status === "pending"
                                ? "bg-outdar-orange/10 text-outdar-orange"
                                : report.status === "resolved"
                                ? "bg-outdar-green/10 text-outdar-green"
                                : "bg-gray-100 dark:bg-slate-700 text-gray-500"
                            }`}>
                              {report.status}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                            {report.targetTitle}
                          </p>
                          {report.details && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              "{report.details}"
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Reported by {report.reporter?.name} · {new Date(report.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short",
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        {report.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleResolveReport(report._id)}
                              className="px-3 py-1.5 bg-outdar-green text-white rounded-lg text-xs font-semibold hover:-translate-y-0.5 transition-all"
                            >
                              ✓ Resolve
                            </button>
                            <button
                              onClick={() => handleDismissReport(report._id)}
                              className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 rounded-lg text-xs font-semibold hover:border-gray-400 transition-all"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CATEGORIES TAB ── */}
          {!isLoading && activeTab === "categories" && (
            <div className="space-y-4">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-1">
                  Categories 🏷️
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {categories.length} categories
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div key={cat._id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 text-center">
                    <div
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: cat.color + "20" }}
                    >
                      {cat.icon}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{cat.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.slug}</p>
                    <div
                      className="w-full h-1 rounded-full mt-3"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;