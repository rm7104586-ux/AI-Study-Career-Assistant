import { useState } from "react";
import api from "../api";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveActivity = (question) => {
    const existingActivity = JSON.parse(
      localStorage.getItem("recent_activity") || "[]"
    );

    const newActivity = [
      {
        type: "chat",
        title: "Asked a question in AI Study Chat",
        description: question,
        time: "Just now",
      },
      ...existingActivity,
    ].slice(0, 10);

    localStorage.setItem(
      "recent_activity",
      JSON.stringify(newActivity)
    );
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    // Save actual chat activity
    saveActivity(userMessage);

    try {
      const response = await api.post("/api/ai/chat/", {
        message: userMessage,
      });

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.detail ||
          "Request failed.";

        setMessages((previousMessages) => [
          ...previousMessages,
          {
            role: "assistant",
            content: `Error: ${errorMessage}`,
          },
        ]);
      } else {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            role: "assistant",
            content: "Could not connect to Django.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AI Study Chat
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Ask anything about your studies
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

      {/* Chat Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">

        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-5xl mb-5">
                🤖
              </div>

              <h2 className="text-3xl font-bold">
                What are you studying today?
              </h2>

              <p className="text-slate-400 mt-3">
                Ask a question and your AI study assistant will help you.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-xl px-5 py-4 rounded-2xl ${
                    item.role === "user"
                      ? "bg-white text-slate-950"
                      : "bg-slate-900 border border-slate-800"
                  }`}
                >
                  {item.content}
                </div>

              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 px-5 py-4 rounded-2xl text-slate-400">
                  Thinking...
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Input */}
      <div className="border-t border-slate-800 p-5">

        <form
          onSubmit={handleSend}
          className="max-w-5xl mx-auto flex gap-3"
        >

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Ask a study question..."
            className="flex-1 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Chat;