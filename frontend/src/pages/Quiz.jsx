import { useState } from "react";
import api from "../api";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingScore, setSavingScore] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a study topic.");
      return;
    }

    setLoading(true);
    setError("");
    setQuiz(null);
    setAnswers({});
    setScore(null);
    setSubmitted(false);

    try {
      const response = await api.post("/api/ai/quiz/", {
        topic: topic.trim(),
        questionCount: questionCount,
        difficulty: difficulty,
      });

      setQuiz(response.data);
    } catch (error) {
      console.error("Quiz error:", error);

      if (error.response) {
        const message =
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to generate quiz.";

        setError(message);
      } else {
        setError("Could not connect to Django.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, answer) => {
    if (submitted) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionIndex]: answer,
    }));
  };

  const saveQuizActivity = async (quizScore) => {
    if (!quiz) {
      return;
    }

    setSavingScore(true);

    try {
      await api.post("/api/ai/quiz/", {
        action: "complete",
        topic: quiz.topic,
        score: quizScore,
        totalQuestions: quiz.questions.length,
      });
    } catch (error) {
      console.error("Could not save quiz activity:", error);
    } finally {
      setSavingScore(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || submitted) {
      return;
    }

    let totalCorrect = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setSubmitted(true);

    await saveQuizActivity(totalCorrect);
  };

  const getAnswerStyle = (question, index, option) => {
    if (!submitted) {
      if (answers[index] === option) {
        return "border-indigo-400 bg-indigo-500/10 shadow-sm shadow-indigo-500/10";
      }

      return "border-slate-700/80 hover:border-indigo-400/60 hover:bg-slate-800/80";
    }

    if (option === question.answer) {
      return "border-emerald-500/70 bg-emerald-500/10";
    }

    if (answers[index] === option && option !== question.answer) {
      return "border-red-500/70 bg-red-500/10";
    }

    return "border-slate-700/70";
  };

  const resetQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setError("");
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
              📝
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                AI Quiz Generator
              </h1>
              <p className="text-xs text-slate-500">
                Practice smarter with AI
              </p>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Quiz Setup */}
        {!quiz && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
                ✨ AI-Powered Practice
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Create Your Quiz
              </h2>

              <p className="text-slate-400 mt-3 max-w-lg mx-auto">
                Choose a topic, set your difficulty, and let AI create a
                personalized quiz for you.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Topic */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-semibold text-slate-200 mb-2"
                  >
                    Study Topic
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      🔍
                    </span>

                    <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      placeholder="Example: DBMS Normalization"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition"
                    />
                  </div>
                </div>

                {/* Question Count + Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="questionCount"
                      className="block text-sm font-semibold text-slate-200 mb-2"
                    >
                      Number of Questions
                    </label>

                    <select
                      id="questionCount"
                      value={questionCount}
                      onChange={(event) =>
                        setQuestionCount(Number(event.target.value))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 transition"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block text-sm font-semibold text-slate-200 mb-2"
                    >
                      Difficulty
                    </label>

                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(event) =>
                        setDifficulty(event.target.value)
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 transition"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Quick info */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-800/50 border border-slate-700/70 p-3 text-center">
                    <div className="text-sm font-semibold text-white">
                      {questionCount}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Questions
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800/50 border border-slate-700/70 p-3 text-center">
                    <div className="text-sm font-semibold text-white">
                      {difficulty}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Level
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800/50 border border-slate-700/70 p-3 text-center">
                    <div className="text-sm font-semibold text-white">
                      AI
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Generated
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/60 text-red-300">
                    <span>⚠️</span>
                    <p className="text-sm leading-6">{error}</p>
                  </div>
                )}

                {/* Generate */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Generating your quiz...
                    </span>
                  ) : (
                    "✨ Generate Quiz"
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-slate-600 mt-5">
              AI-generated questions may vary each time you create a quiz.
            </p>
          </div>
        )}

        {/* Quiz */}
        {quiz && (
          <div className="max-w-4xl mx-auto">
            {/* Quiz Heading */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
                    🧠 Practice Quiz
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {quiz.topic}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-400">
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                      🎯 {quiz.difficulty}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                      📋 {totalQuestions} Questions
                    </span>
                  </div>
                </div>

                {!submitted && (
                  <div className="text-sm text-slate-400">
                    <span className="text-white font-semibold">
                      {answeredCount}
                    </span>{" "}
                    / {totalQuestions} answered
                  </div>
                )}
              </div>

              {/* Progress */}
              {!submitted && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-5">
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg shadow-black/10"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    <h3 className="font-semibold text-lg leading-7 text-slate-100">
                      {question.question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition ${
                          submitted
                            ? "cursor-default"
                            : "cursor-pointer"
                        } ${getAnswerStyle(question, index, option)}`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() =>
                            handleAnswer(index, option)
                          }
                          disabled={submitted}
                          className="sr-only"
                        />

                        <span
                          className={`w-7 h-7 flex-shrink-0 rounded-lg border flex items-center justify-center text-xs font-semibold ${
                            answers[index] === option
                              ? "border-indigo-400 bg-indigo-500/20 text-indigo-300"
                              : "border-slate-700 text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <span className="text-sm sm:text-base text-slate-200 leading-6">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Question Result */}
                  {submitted && (
                    <div className="mt-5 pt-4 border-t border-slate-800">
                      {answers[index] === question.answer ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            ✓
                          </span>
                          Correct answer
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                            <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                              ✕
                            </span>
                            Incorrect answer
                          </div>

                          <p className="text-sm text-slate-400 ml-8">
                            Correct answer:{" "}
                            <span className="text-emerald-400 font-medium">
                              {question.answer}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            {!submitted && (
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0}
                className="w-full mt-8 py-4 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}

            {/* Score */}
            {submitted && score !== null && (
              <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-10 text-center shadow-2xl shadow-black/20">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-5">
                  🎯
                </div>

                <p className="text-sm text-indigo-300 font-medium">
                  Quiz Complete
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold mt-2">
                  Your Results
                </h2>

                <div className="mt-6">
                  <p className="text-5xl sm:text-6xl font-bold tracking-tight">
                    {score}
                    <span className="text-slate-600">
                      {" "}
                      / {totalQuestions}
                    </span>
                  </p>

                  <p className="text-slate-400 mt-3">
                    {Math.round((score / totalQuestions) * 100)}% score
                  </p>
                </div>

                <div className="mt-6 px-5 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                  <p className="text-slate-300">
                    {score === totalQuestions
                      ? "🎉 Excellent work! You got every question correct."
                      : score >= totalQuestions / 2
                      ? "👏 Good job! Keep practicing to improve further."
                      : "📚 Keep studying and try the quiz again."}
                  </p>
                </div>

                {savingScore && (
                  <p className="text-sm text-slate-500 mt-5">
                    Saving your result...
                  </p>
                )}

                <button
                  onClick={resetQuiz}
                  className="mt-7 px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
                >
                  Create Another Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Quiz;