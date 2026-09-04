import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const username = localStorage.getItem("username") || "Student";

  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await api.get("/api/ai/activity/");
        setActivities(response.data);
      } catch (error) {
        console.error("Activity loading error:", error);
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("recent_activity");

    window.location.href = "/login";
  };

  const getActivityIcon = (type) => {
    if (type === "chat") return "🤖";
    if (type === "notes") return "📄";
    if (type === "quiz") return "📝";
    if (type === "resume") return "📋";

    return "📌";
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
              className="text-xl md:text-2xl font-bold tracking-tight hover:text-slate-300 transition"
            >
              AI Study & Career Assistant
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center gap-1">

              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm text-white bg-slate-800 transition"
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
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Profile
              </Link>

            </div>

            {/* User */}
            <div className="flex items-center gap-3">

              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold">
                  {username.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm text-slate-300">
                  {username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Welcome Hero */}
        <section className="relative overflow-hidden mb-12 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-10">

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-slate-700/10 blur-3xl" />

          <div className="relative">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/60 text-sm text-slate-300 mb-5">
              <span>✨</span>
              <span>Your personal AI workspace</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome back, {username} 👋
            </h1>

            <p className="mt-4 text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed">
              Learn, practice, analyze study materials, and improve your
              career profile from one place.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                to="/chat"
                className="px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition shadow-lg"
              >
                Start Studying →
              </Link>

              <Link
                to="/resume"
                className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-white font-semibold hover:bg-slate-800 transition"
              >
                Analyze Resume
              </Link>
            </div>

          </div>
        </section>

        {/* AI Tools */}
        <section className="mb-14">

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">
                Everything you need
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold">
                AI Tools
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              4 tools available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* AI Study Chat */}
            <div className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                🤖
              </div>

              <h3 className="text-xl font-semibold mb-3">
                AI Study Chat
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-7">
                Ask study questions and get clear explanations from your AI
                study assistant.
              </p>

              <Link
                to="/chat"
                className="block text-center w-full py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Open Chat
              </Link>

            </div>

            {/* Notes Analyzer */}
            <div className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                📄
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Notes Analyzer
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-7">
                Upload study notes and turn them into summaries, key points,
                and revision material.
              </p>

              <Link
                to="/notes"
                className="block text-center w-full py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Analyze Notes
              </Link>

            </div>

            {/* Quiz Generator */}
            <div className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                📝
              </div>

              <h3 className="text-xl font-semibold mb-3">
                AI Quiz Generator
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-7">
                Create AI-generated quizzes, answer questions, and check your
                performance.
              </p>

              <Link
                to="/quiz"
                className="block text-center w-full py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Create Quiz
              </Link>

            </div>

            {/* Resume Analyzer */}
            <div className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition">
                📋
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Resume Analyzer
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-7">
                Upload your resume and get a score, detected sections, skills,
                and career suggestions.
              </p>

              <Link
                to="/resume"
                className="block text-center w-full py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Analyze Resume
              </Link>

            </div>

          </div>
        </section>

        {/* Recent Activity */}
        <section>

          <div className="flex items-end justify-between mb-6">

            <div>
              <p className="text-sm text-slate-500 mb-1">
                Your latest actions
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold">
                Recent Activity
              </h2>
            </div>

            <span className="text-sm text-slate-500 hidden sm:block">
              Synced with PostgreSQL
            </span>

          </div>

          <div className="overflow-hidden bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">

            {activityLoading ? (

              <div className="p-10 text-center">
                <div className="w-8 h-8 mx-auto mb-4 rounded-full border-2 border-slate-700 border-t-white animate-spin" />
                <p className="text-slate-500">
                  Loading activity...
                </p>
              </div>

            ) : activities.length === 0 ? (

              <div className="p-10 text-center">

                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                  📌
                </div>

                <p className="text-slate-300 font-medium">
                  No recent activity
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Start using the tools and your activity will appear here.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-800">

                {activities.map((activity) => (

                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-4 p-5 hover:bg-slate-800/40 transition"
                  >

                    <div className="flex items-center gap-4 min-w-0">

                      <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="min-w-0">

                        <p className="font-medium text-slate-200">
                          {activity.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {activity.description}
                        </p>

                      </div>

                    </div>

                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {activity.time}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;