import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Send,
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  Brain,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const suggestions = [
  {
    icon: BookOpen,
    title: "Explain a topic",
    text: "Explain database normalization in simple terms",
  },
  {
    icon: Lightbulb,
    title: "Help me understand",
    text: "What is the difference between SQL and NoSQL?",
  },
  {
    icon: Brain,
    title: "Prepare for exam",
    text: "Give me 5 important DBMS questions",
  },
];

function AITutor() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! 👋 I'm your CampusConnect AI Tutor. Ask me anything about your studies and I'll help you understand it.",
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setMessage("");
    setIsSending(true);

    try {
      const token = localStorage.getItem("campusconnect_token");

      const response = await fetch(`${API_URL}/api/ai-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get AI response."
        );
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          data.reply ||
          "Not available in the provided document.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error("AI Tutor error:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Sorry, I could not process your question right now.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestion = (text) => {
    setMessage(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Bot size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Tutor
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your personal study assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Sparkles size={20} />
              </div>

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                CampusConnect AI
              </p>

              <p className="text-xs text-green-600">
                {isSending ? "Thinking..." : "Online"}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isSending
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            Gemini AI
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`flex gap-3 ${
                item.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {item.sender === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-6 ${
                  item.sender === "user"
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-100 text-slate-700"
                }`}
              >
                {item.sender === "ai" ? (
                  <div
                    className="
                      prose prose-sm max-w-none
                      prose-headings:mb-3
                      prose-headings:mt-5
                      prose-headings:font-bold
                      prose-p:my-2
                      prose-ul:my-2
                      prose-ol:my-2
                      prose-li:my-1
                      prose-table:my-4
                      prose-th:border
                      prose-th:border-slate-300
                      prose-th:bg-slate-200
                      prose-th:px-3
                      prose-th:py-2
                      prose-td:border
                      prose-td:border-slate-300
                      prose-td:px-3
                      prose-td:py-2
                      prose-code:rounded
                      prose-code:bg-slate-200
                      prose-code:px-1
                      prose-code:py-0.5
                      prose-pre:my-4
                    "
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  item.text
                )}
              </div>

              {item.sender === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isSending && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Bot size={18} />
              </div>

              <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Try asking
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;

              return (
                <button
                  key={suggestion.title}
                  type="button"
                  onClick={() =>
                    handleSuggestion(suggestion.text)
                  }
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon size={15} />
                  {suggestion.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isSending}
              placeholder="Ask your AI Tutor anything..."
              className="max-h-32 min-h-12 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <span className="text-sm font-bold">...</span>
              ) : (
                <Send size={19} />
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}

export default AITutor;