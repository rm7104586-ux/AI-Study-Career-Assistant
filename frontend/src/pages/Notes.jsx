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

    localStorage.setItem("recent_activity", JSON.stringify(newActivity));
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
      const response = await api.post("/api/ai/notes/", formData);

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
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Notes Analyzer
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Turn your study material into useful revision content
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              ← Dashboard
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">

        {/* Page intro */}
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 mb-4">
            <span>📚</span>
            AI-powered study analysis
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Analyze your notes
          </h2>

          <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
            Upload your study material and let the AI organize the content
            into a clear summary and useful revision material.
          </p>
        </section>

        {/* Upload Card */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">

          <div className="flex items-start gap-4 mb-7">

            <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
              📄
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Upload Study Material
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Supported formats: PDF, DOCX, TXT, PPTX
              </p>
            </div>

          </div>

          {/* File picker */}
          <label className="block cursor-pointer">

            <div className="group border-2 border-dashed border-slate-700 rounded-2xl p-10 md:p-14 text-center bg-slate-950/40 hover:bg-slate-950/70 hover:border-slate-500 transition-all duration-300">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-105 transition">
                📚
              </div>

              <p className="text-slate-200 font-medium text-lg">
                Click to select your study file
              </p>

              <p className="text-sm text-slate-500 mt-2">
                PDF, DOCX, TXT or PPTX
              </p>

              <div className="mt-5 inline-flex px-4 py-2 rounded-lg bg-slate-800 text-sm text-slate-300 group-hover:bg-slate-700 transition">
                Choose File
              </div>

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
            <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                  📎
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Selected file
                  </p>

                  <p className="font-medium text-slate-200 mt-1 break-all">
                    {file.name}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {file.name.split(".").pop().toUpperCase()} file
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full mt-6 py-3.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-slate-950 animate-spin" />
                Analyzing your notes...
              </span>
            ) : (
              "Analyze Notes →"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300">
              <p className="font-medium">Analysis failed</p>
              <p className="text-sm mt-1 text-red-400">
                {error}
              </p>
            </div>
          )}

        </section>

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">

            {/* Result heading */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 mb-3">
                <span>✨</span>
                Analysis complete
              </div>

              <h2 className="text-2xl md:text-3xl font-bold">
                Your Study Analysis
              </h2>
            </div>

            {/* File Information */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                  📁
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-semibold break-all">
                    {result.filename}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Uploaded study material
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    File Type
                  </p>

                  <p className="text-xl font-semibold mt-2">
                    {result.file_type || "Unknown"}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Words
                  </p>

                  <p className="text-xl font-semibold mt-2">
                    {result.word_count || 0}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Pages / Slides
                  </p>

                  <p className="text-xl font-semibold mt-2">
                    {result.pages || "N/A"}
                  </p>
                </div>

              </div>

            </section>

            {/* Summary */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  📌
                </div>

                <h3 className="text-xl font-semibold">
                  Summary
                </h3>

              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm md:text-base leading-7">
                  {result.summary}
                </pre>
              </div>

            </section>

            {/* Extracted Content */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  📄
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Extracted Content
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Text extracted from your uploaded file
                  </p>
                </div>

              </div>

              <div className="max-h-96 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-7">
                  {result.text}
                </pre>
              </div>

            </section>

          </div>
        )}

      </main>
    </div>
  );
}

export default Notes;