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
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <Link
              to="/"
              className="text-xl md:text-2xl font-bold hover:text-slate-300 transition"
            >
              AI Study & Career Assistant
            </Link>

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
                className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-white"
              >
                Profile
              </Link>

            </div>

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
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Profile Header */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Student Profile
              </p>

              <h1 className="text-4xl font-bold mt-1">
                {username}
              </h1>

              <p className="text-slate-400 mt-2">
                AI Study & Career Assistant member
              </p>
            </div>

          </div>

        </section>

        {/* Statistics */}
        <section className="mt-8">

          <h2 className="text-2xl font-semibold mb-6">
            Activity Overview
          </h2>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              Loading profile statistics...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Chat */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">
                  🤖
                </div>

                <p className="text-sm text-slate-500">
                  AI Chat
                </p>

                <p className="text-3xl font-bold mt-1">
                  {chatCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  activities
                </p>
              </div>

              {/* Notes */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">
                  📄
                </div>

                <p className="text-sm text-slate-500">
                  Notes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {notesCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  analyses
                </p>
              </div>

              {/* Quiz */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">
                  📝
                </div>

                <p className="text-sm text-slate-500">
                  Quizzes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {quizCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  completed
                </p>
              </div>

              {/* Resume */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">
                  📋
                </div>

                <p className="text-sm text-slate-500">
                  Resume
                </p>

                <p className="text-3xl font-bold mt-1">
                  {resumeCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  analyses
                </p>
              </div>

            </div>
          )}

        </section>

        {/* Recent Activity */}
        <section className="mt-10">

          <h2 className="text-2xl font-semibold mb-6">
            Recent Activity
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl">

            {loading ? (
              <div className="p-8 text-center text-slate-500">
                Loading activity...
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center">

                <div className="text-4xl mb-4">
                  📌
                </div>

                <p className="font-medium text-slate-300">
                  No activity yet
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Start using the tools from your dashboard.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-slate-800">

                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-5 flex items-center justify-between gap-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
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

                      <div>

                        <p className="font-medium">
                          {activity.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {activity.description}
                        </p>

                      </div>

                    </div>

                    <span className="text-xs text-slate-500 text-right">
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

export default Profile;