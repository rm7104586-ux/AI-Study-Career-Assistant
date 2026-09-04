import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("access_token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            token ? <Navigate to="/" replace /> : <Register />
          }
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            token ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* AI Study Chat */}
        <Route
          path="/chat"
          element={
            token ? <Chat /> : <Navigate to="/login" replace />
          }
        />

        {/* Notes Analyzer */}
        <Route
          path="/notes"
          element={
            token ? <Notes /> : <Navigate to="/login" replace />
          }
        />

        {/* Quiz Generator */}
        <Route
          path="/quiz"
          element={
            token ? <Quiz /> : <Navigate to="/login" replace />
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/resume"
          element={
            token ? <Resume /> : <Navigate to="/login" replace />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            token ? <Profile /> : <Navigate to="/login" replace />
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;