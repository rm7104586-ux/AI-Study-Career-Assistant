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
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Logo */}
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold hover:text-slate-300 transition"
            >
              AI Study & Career Assistant
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center gap-2">

              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                to="/chat"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                AI Chat
              </Link>

              <Link
                to="/notes"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Notes
              </Link>

              <Link
                to="/quiz"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Quiz
              </Link>

              <Link
                to="/resume"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Resume
              </Link>

              <Link
                to="/profile"
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Profile
              </Link>

            </div>

            {/* User */}
            <div className="flex items-center gap-3">

              <span className="text-sm text-slate-400">
                {username}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Welcome */}
        <section className="mb-10">

          <p className="text-slate-400 mb-2">
            Your personal AI workspace
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome back, {username} 👋
          </h1>

          <p className="mt-4 text-slate-400 max-w-2xl">
            Learn, practice, analyze study materials, and improve your
            career profile from one place.
          </p>

        </section>

        {/* AI Tools */}
        <section className="mb-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              AI Tools
            </h2>

            <span className="text-sm text-slate-500">
              4 tools available
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* AI Study Chat */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition">

              <div className="text-4xl mb-5">
                🤖
              </div>

              <h3 className="text-xl font-semibold mb-3">
                AI Study Chat
              </h3>

              <p className="text-sm text-slate-400 mb-6">
                Ask study questions and get explanations from your AI
                study assistant.
              </p>

              <Link
                to="/chat"
                className="block text-center w-full py-2.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Open Chat
              </Link>

            </div>

            {/* Notes Analyzer */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition">

              <div className="text-4xl mb-5">
                📄
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Notes Analyzer
              </h3>

              <p className="text-sm text-slate-400 mb-6">
                Upload study notes and extract their content for analysis.
              </p>

              <Link
                to="/notes"
                className="block text-center w-full py-2.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Analyze Notes
              </Link>

            </div>

            {/* Quiz Generator */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition">

              <div className="text-4xl mb-5">
                📝
              </div>

              <h3 className="text-xl font-semibold mb-3">
                AI Quiz Generator
              </h3>

              <p className="text-sm text-slate-400 mb-6">
                Create quizzes, answer questions, and check your score.
              </p>

              <Link
                to="/quiz"
                className="block text-center w-full py-2.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Create Quiz
              </Link>

            </div>

            {/* Resume Analyzer */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition">

              <div className="text-4xl mb-5">
                📋
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Resume Analyzer
              </h3>

              <p className="text-sm text-slate-400 mb-6">
                Upload your resume and get a basic score, detected
                sections, skills, and suggestions.
              </p>

              <Link
                to="/resume"
                className="block text-center w-full py-2.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
              >
                Analyze Resume
              </Link>

            </div>

          </div>

        </section>

        {/* Recent Activity */}
        <section>

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              Recent Activity
            </h2>

            <span className="text-sm text-slate-500">
              From PostgreSQL
            </span>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl">

            {activityLoading ? (
              <div className="p-8 text-center text-slate-500">
                Loading activity...
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center">

                <div className="text-4xl mb-4">
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
                    className="flex items-center justify-between gap-4 p-5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                        {getActivityIcon(activity.type)}
                      </div>

                      <div>

                        <p className="font-medium">
                          {activity.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {activity.description}
                        </p>

                      </div>

                    </div>

                    <span className="text-xs text-slate-500">
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