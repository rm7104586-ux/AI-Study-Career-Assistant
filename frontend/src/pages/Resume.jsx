import { useState } from "react";
import api from "../api";

function Resume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const saveActivity = (fileName, score) => {
    const existingActivity = JSON.parse(
      localStorage.getItem("recent_activity") || "[]"
    );

    const newActivity = [
      {
        type: "resume",
        title: "Resume analyzed",
        description: `${fileName} - Score: ${score}/100`,
        time: "Just now",
      },
      ...existingActivity,
    ].slice(0, 10);

    localStorage.setItem(
      "recent_activity",
      JSON.stringify(newActivity)
    );
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile || null);
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file || loading) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "/api/ai/resume/",
        formData
      );

      setResult(response.data);

      saveActivity(
        file.name,
        response.data.score ?? 0
      );
    } catch (error) {
      console.error("Resume error:", error);

      if (error.response) {
        const message =
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to analyze the resume.";

        setError(message);
      } else {
        setError("Could not connect to Django.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Resume Analyzer
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Upload your resume and analyze its content
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        <div className="max-w-4xl mx-auto">

          {/* Upload Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="text-5xl text-center mb-5">
              📋
            </div>

            <h2 className="text-2xl font-semibold text-center mb-3">
              Upload Your Resume
            </h2>

            <p className="text-slate-400 text-center mb-8">
              Upload your resume as a PDF to analyze its content.
            </p>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-slate-500 transition">

                <div className="text-4xl mb-4">
                  📄
                </div>

                <p className="text-slate-300 mb-2">
                  Click to select your resume
                </p>

                <p className="text-sm text-slate-500">
                  PDF files only
                </p>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>

            </label>

            {/* Selected file */}
            {file && (
              <div className="mt-6 p-4 rounded-lg bg-slate-800">

                <p className="text-sm text-slate-400">
                  Selected resume
                </p>

                <p className="font-medium mt-1 break-all">
                  {file.name}
                </p>

              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full mt-6 py-3 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300">
                {error}
              </div>
            )}

          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 space-y-6">

              {/* Resume Score */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-6">
                  Resume Score
                </h2>

                <div className="flex items-center gap-8">

                  <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
                    <span className="text-4xl font-bold">
                      {result.score}
                    </span>
                  </div>

                  <div>
                    <p className="text-slate-300 text-lg">
                      Overall score
                    </p>

                    <p className="text-slate-500 text-sm mt-2">
                      Based on detected resume sections and contact information.
                    </p>
                  </div>

                </div>

              </div>

              {/* Resume Information */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-5">
                  Resume Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      File
                    </p>

                    <p className="font-medium mt-1 break-all">
                      {result.filename}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Pages
                    </p>

                    <p className="text-lg font-semibold mt-1">
                      {result.pages}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Words
                    </p>

                    <p className="text-lg font-semibold mt-1">
                      {result.word_count}
                    </p>
                  </div>

                </div>

              </div>

              {/* Detected Skills */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  🛠 Detected Skills
                </h2>

                {result.detected_skills &&
                result.detected_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">

                    {result.detected_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>
                ) : (
                  <p className="text-slate-500">
                    No supported skills were detected.
                  </p>
                )}

              </div>

              {/* Detected Sections */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  📂 Detected Sections
                </h2>

                {result.detected_sections &&
                result.detected_sections.length > 0 ? (
                  <div className="space-y-3">

                    {result.detected_sections.map((section) => (
                      <div
                        key={section}
                        className="p-3 rounded-lg bg-slate-800 border border-slate-700"
                      >
                        ✓ {section}
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="text-slate-500">
                    No major sections were detected.
                  </p>
                )}

              </div>

              {/* Missing Sections */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  ⚠ Missing Recommended Sections
                </h2>

                {result.missing_sections &&
                result.missing_sections.length > 0 ? (
                  <div className="space-y-3">

                    {result.missing_sections.map((section) => (
                      <div
                        key={section}
                        className="p-3 rounded-lg bg-slate-800 border border-slate-700"
                      >
                        {section}
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="text-green-400">
                    No major recommended sections appear to be missing.
                  </p>
                )}

              </div>

              {/* Suggestions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  💡 Suggestions
                </h2>

                <div className="space-y-3">

                  {result.suggestions &&
                  result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-slate-950 border border-slate-800"
                    >
                      {index + 1}. {suggestion}
                    </div>
                  ))}

                </div>

              </div>

              {/* Extracted Resume Text */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  📄 Extracted Resume Text
                </h2>

                <div className="max-h-96 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-6">
                    {result.text}
                  </pre>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Resume;