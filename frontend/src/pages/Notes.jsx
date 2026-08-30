import { useState } from "react";
import api from "../api";

function Notes() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const saveActivity = (fileName) => {
    const existingActivity = JSON.parse(
      localStorage.getItem("recent_activity") || "[]"
    );

    const newActivity = [
      {
        type: "notes",
        title: "Analyzed study material",
        description: fileName,
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
        "/api/ai/notes/",
        formData
      );

      setResult(response.data);

      saveActivity(file.name);
    } catch (error) {
      console.error("Notes error:", error);

      if (error.response) {
        const message =
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to analyze the file.";

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
              Notes Analyzer
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Upload your study material and analyze it
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

            <h2 className="text-2xl font-semibold mb-3">
              Upload Study Material
            </h2>

            <p className="text-slate-400 mb-8">
              Upload PDF, DOCX, TXT, or PPTX study material.
            </p>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-slate-500 transition">

                <div className="text-5xl mb-4">
                  📚
                </div>

                <p className="text-slate-300 mb-2">
                  Click to select a study file
                </p>

                <p className="text-sm text-slate-500">
                  Supported: PDF, DOCX, TXT, PPTX
                </p>

                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>

            </label>

            {/* Selected file */}
            {file && (
              <div className="mt-6 p-4 rounded-lg bg-slate-800">

                <p className="text-sm text-slate-400">
                  Selected file
                </p>

                <p className="font-medium mt-1 break-all">
                  {file.name}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Type:{" "}
                  {file.name.split(".").pop().toUpperCase()}
                </p>

              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full mt-6 py-3 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? "Analyzing..." : "Analyze Notes"}
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

              {/* File Information */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold">
                  {result.filename}
                </h2>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      File Type
                    </p>

                    <p className="text-lg font-semibold mt-1">
                      {result.file_type || "Unknown"}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Words
                    </p>

                    <p className="text-lg font-semibold mt-1">
                      {result.word_count || 0}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Pages / Slides
                    </p>

                    <p className="text-lg font-semibold mt-1">
                      {result.pages || "N/A"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  📌 Summary
                </h2>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-7">
                    {result.summary}
                  </pre>
                </div>

              </div>

              {/* Extracted Text */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                  📄 Extracted Content
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

export default Notes;