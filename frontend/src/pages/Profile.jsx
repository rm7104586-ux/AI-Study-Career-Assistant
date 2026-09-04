import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Profile() {
  const username = localStorage.getItem("username") || "Student";

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await api.get("/api/ai/activity/");
        setActivities(response.data);
      } catch (error) {
        console.error("Profile activity error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const chatCount = activities.filter(
    (activity) => activity.type === "chat"
  ).length;

  const notesCount = activities.filter(
    (activity) => activity.type === "notes"
  ).length;

  const quizCount = activities.filter(
    (activity) => activity.type === "quiz"
  ).length;

  const resumeCount = activities.filter(
    (activity) => activity.type === "resume"
  ).length;

  const totalActivity =
    chatCount + notesCount + quizCount + resumeCount;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("recent_activity");

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
                ✦
              </div>

              <div>
                <div className="text-lg font-bold tracking-tight group-hover:text-indigo-300 transition">
                  AI Study & Career Assistant
                </div>
                <div className="text-xs text-slate-500">
                  Your personal AI workspace
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                to="/chat"
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                AI Chat
              </Link>

              <Link
                to="/notes"
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Notes
              </Link>

              <Link
                to="/quiz"
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Quiz
              </Link>

              <Link
                to="/resume"
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Resume
              </Link>

              <Link
                to="/profile"
                className="px-3 py-2 rounded-lg text-sm bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
              >
                Profile
              </Link>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-semibold text-indigo-300">
                  {username.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm text-slate-400">
                  {username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-sm text-slate-300 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Heading */}
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
            👤 Personal Profile
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Track your learning activity and progress.
          </p>
        </section>

        {/* Profile Card */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-4xl font-bold text-indigo-300">
                {username.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm text-indigo-300 font-medium">
                  Student Account
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  {username}
                </h2>

                <p className="text-slate-500 text-sm mt-2">
                  Member of AI Study & Career Assistant
                </p>
              </div>
            </div>

            {/* Total Activity */}
            <div className="sm:text-right px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/70">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Total Activity
              </p>

              <p className="text-3xl font-bold mt-1">
                {totalActivity}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                recent activities
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                Activity Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your recent usage across AI tools.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-10 text-center">
              <div className="w-7 h-7 mx-auto border-2 border-slate-700 border-t-indigo-400 rounded-full animate-spin"></div>

              <p className="text-sm text-slate-500 mt-4">
                Loading profile statistics...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Chat */}
              <div className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-slate-900 transition">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl mb-5">
                  🤖
                </div>

                <p className="text-sm text-slate-500">
                  AI Chat
                </p>

                <p className="text-3xl font-bold mt-1">
                  {chatCount}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  conversations
                </p>
              </div>

              {/* Notes */}
              <div className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-slate-900 transition">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl mb-5">
                  📄
                </div>

                <p className="text-sm text-slate-500">
                  Notes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {notesCount}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  analyses
                </p>
              </div>

              {/* Quiz */}
              <div className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-slate-900 transition">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl mb-5">
                  📝
                </div>

                <p className="text-sm text-slate-500">
                  Quizzes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {quizCount}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  completed
                </p>
              </div>

              {/* Resume */}
              <div className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-slate-900 transition">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-5">
                  📋
                </div>

                <p className="text-sm text-slate-500">
                  Resume
                </p>

                <p className="text-3xl font-bold mt-1">
                  {resumeCount}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  analyses
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your latest interactions with the assistant.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-7 h-7 mx-auto border-2 border-slate-700 border-t-indigo-400 rounded-full animate-spin"></div>

                <p className="text-sm text-slate-500 mt-4">
                  Loading activity...
                </p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                  📌
                </div>

                <p className="font-semibold text-slate-300 mt-5">
                  No activity yet
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Start using the AI tools from your dashboard.
                </p>

                <Link
                  to="/"
                  className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-slate-800 border border-slate-700/70 flex items-center justify-center text-xl">
                        {activity.type === "chat"
                          ? "🤖"
                          : activity.type === "notes"
                          ? "📄"
                          : activity.type === "quiz"
                          ? "📝"
                          : activity.type === "resume"
                          ? "📋"
                          : "📌"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate">
                          {activity.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    <span className="flex-shrink-0 text-xs text-slate-600 text-right">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-10 bg-gradient-to-r from-indigo-500/10 to-slate-900 border border-indigo-500/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-semibold">
                Ready to keep learning?
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Explore your AI tools and continue your study journey.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition"
            >
              Open Dashboard →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;