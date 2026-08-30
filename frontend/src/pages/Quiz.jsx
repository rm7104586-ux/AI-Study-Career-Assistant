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
        return "border-white bg-slate-800";
      }

      return "border-slate-700 hover:bg-slate-800";
    }

    if (option === question.answer) {
      return "border-green-500 bg-green-500/10";
    }

    if (
      answers[index] === option &&
      option !== question.answer
    ) {
      return "border-red-500 bg-red-500/10";
    }

    return "border-slate-700";
  };

  const resetQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AI Quiz Generator
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Create and practice personalized quizzes
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

        {/* Quiz Setup */}
        {!quiz && (
          <div className="max-w-2xl mx-auto">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

              <div className="text-5xl text-center mb-5">
                📝
              </div>

              <h2 className="text-2xl font-semibold text-center mb-3">
                Create Your Quiz
              </h2>

              <p className="text-slate-400 text-center mb-8">
                Choose a topic and customize your quiz.
              </p>

              <form
                onSubmit={handleGenerate}
                className="space-y-6"
              >

                {/* Topic */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Study Topic
                  </label>

                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(event) =>
                      setTopic(event.target.value)
                    }
                    placeholder="Example: DBMS Normalization"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Question Count */}
                <div>
                  <label
                    htmlFor="questionCount"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Number of Questions
                  </label>

                  <select
                    id="questionCount"
                    value={questionCount}
                    onChange={(event) =>
                      setQuestionCount(Number(event.target.value))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(event.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300">
                    {error}
                  </div>
                )}

                {/* Generate */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Quiz"}
                </button>

              </form>

            </div>

          </div>
        )}

        {/* Quiz */}
        {quiz && (
          <div className="max-w-3xl mx-auto">

            {/* Quiz Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                {quiz.topic}
              </h2>

              <p className="text-slate-400 mt-2">
                Difficulty: {quiz.difficulty}
              </p>

              <p className="text-slate-400 mt-1">
                Questions: {quiz.questions.length}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-6">

              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >

                  <h3 className="font-semibold text-lg mb-5">
                    {index + 1}. {question.question}
                  </h3>

                  <div className="space-y-3">

                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`block p-4 rounded-lg border transition ${
                          submitted
                            ? "cursor-default"
                            : "cursor-pointer"
                        } ${getAnswerStyle(
                          question,
                          index,
                          option
                        )}`}
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
                          className="mr-3"
                        />

                        {option}

                      </label>
                    ))}

                  </div>

                  {/* Question Result */}
                  {submitted && (
                    <div className="mt-4">

                      {answers[index] === question.answer ? (
                        <p className="text-green-400 text-sm font-medium">
                          ✓ Correct
                        </p>
                      ) : (
                        <div>
                          <p className="text-red-400 text-sm font-medium">
                            ✗ Incorrect
                          </p>

                          <p className="text-slate-400 text-sm mt-1">
                            Correct answer:{" "}
                            <span className="text-green-400">
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
                disabled={
                  Object.keys(answers).length === 0
                }
                className="w-full mt-8 py-3 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}

            {/* Score */}
            {submitted && score !== null && (
              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

                <div className="text-5xl mb-4">
                  🎯
                </div>

                <h2 className="text-3xl font-bold">
                  Quiz Complete
                </h2>

                <p className="text-slate-400 mt-3">
                  Your score
                </p>

                <p className="text-5xl font-bold mt-2">
                  {score} / {quiz.questions.length}
                </p>

                <p className="text-slate-400 mt-3">
                  {score === quiz.questions.length
                    ? "Excellent work!"
                    : score >= quiz.questions.length / 2
                    ? "Good job! Keep practicing."
                    : "Keep studying and try again."}
                </p>

                {savingScore && (
                  <p className="text-sm text-slate-500 mt-4">
                    Saving your result...
                  </p>
                )}

                <button
                  onClick={resetQuiz}
                  className="mt-6 px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
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