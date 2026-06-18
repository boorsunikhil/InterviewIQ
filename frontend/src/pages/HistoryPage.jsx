import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInterviewStore from "../store/InterviewStore";
import AppNavbar from "../components/AppNavbar";



function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getAllChats ,allChats} = useInterviewStore();



useEffect(() => {
  const fetchChats = async () => {
    setLoading(true);
    await getAllChats(); // wait for store to update
    setLoading(false);
  };

  fetchChats();
}, [getAllChats]);

useEffect(() => {
  if (allChats) {
    setSessions(allChats);
    console.log("Fetched sessions:", allChats);
  }
}, [allChats]);

  

  const typeIcon = (type) => {
    if (type === "technical") return "🧠";
    if (type === "hr") return "💬";
    return "💻";
  };

  const typeColor = (type) => {
    if (type === "technical") return "primary";
    if (type === "hr") return "secondary";
    return "accent";
  };

  return (
    <div className="min-h-screen bg-base-200">
      <AppNavbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Interview History 📋
            </h1>
            <p className="text-base-content/50 mt-1">
              All your past interview sessions
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Skeleton — history list loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon placeholder */}
                      <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                      <div className="flex flex-col gap-2">
                        {/* Title + badges row */}
                        <div className="flex items-center gap-2">
                          <div className="skeleton w-32 h-4 rounded" />
                          <div className="skeleton w-16 h-4 rounded-full" />
                          <div className="skeleton w-16 h-4 rounded-full" />
                        </div>
                        {/* Date + questions row */}
                        <div className="skeleton w-40 h-3 rounded" />
                      </div>
                    </div>
                    {/* Score placeholder */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="skeleton w-16 h-6 rounded" />
                      <div className="skeleton w-8 h-3 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        { sessions.length === 0 && (
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center py-20">
              <span className="text-6xl mb-4">📭</span>
              <h2 className="card-title">No sessions yet</h2>
              <p className="text-base-content/50">
                Start your first interview from the dashboard.
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* Session list */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => navigate(`/history/${session._id}`)}
              >
                <div className="card-body p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeIcon(session.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-bold"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                          >
                            {session.topic || `${session.type} Interview`}
                          </span>
                          <span className={`badge badge-${typeColor(session.type)} badge-sm`}>
                            {session.type}
                          </span>
                          <span
                            className={`badge badge-sm ${
                              session.completed
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {session.completed? "Completed" : "In Progress"}
                          </span>
                        </div>
                        <div className="text-xs text-base-content/40 mt-0.5">
                          {new Date(session.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          • {session.totalQuestions} questions
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="font-extrabold text-lg text-primary">
                        {session.score ?? "—"}
                        <span className="text-sm text-base-content/40">
                          /{session.maxScore ?? "—"}
                        </span>
                      </div>
                      <div className="text-xs text-base-content/40">score</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;