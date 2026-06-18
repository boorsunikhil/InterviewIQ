import { useEffect, useState,useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/AuthStore";
import AppNavbar from "../components/AppNavbar";
import StatCard from "../components/StatCard";
import SessionCard from "../components/SessionCard";
import useInterviewStore from "../store/InterviewStore";
import Footer from "../components/Footer";

function Dashboard() {
  const [state,setState]=useState(false);
  const { user } = useAuthStore();
  const { setuserStats, userstats, generatequestions,sessionId } = useInterviewStore();
  const navigate = useNavigate();

  // Stats from backend
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Controls which popup is open: null | "technical" | "hr" | "coding"
  const [activeModal, setActiveModal] = useState(null);

  // Form state for the popup
  const [sessionForm, setSessionForm] = useState({
    topic: "",
    totalQuestions: 2,
    type: "technical",
  });
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const [generatequestionsData, setGeneratequestionsData] = useState(null);

  // Fetch dashboard stats when page loads
  useEffect(() => {
    setStatsLoading(true);
    const fetchStats = async () => {
      setStatsLoading(true);
      await setuserStats(); // assuming this fetches and updates userstats
    };
    fetchStats();
  }, [setuserStats]);

  const demo=useMemo(() => {
    if (userstats) {
      setStatsLoading(true); // Show skeleton while updating stats
      setStats(userstats);
      setStatsLoading(false); // ✅ stop skeleton when data arrives
      console.log("Dashboard stats updated:", userstats);
    }
  }, [userstats]);

  // Open popup — reset form each time
  const openModal = (type) => {
    setActiveModal(type);
    setSessionForm({ topic: "", totalQuestions: 2, type : type });
    setSessionError("");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSessionForm({type:"", topic: "", totalQuestions: 2 });
    setSessionError("");
  };

  // Submit popup form → start interview session
  const handleStartSession = async (e) => {
    e.preventDefault();
    setSessionError("");
    setSessionLoading(true);
    console.log("session form data in dashboard ", sessionForm);
    try {
      // GET /api/interview/start
      // Query params: type, topic, totalQuestions
      // Expected response: { sessionId, firstQuestion, ... }
      let dat;
      if (activeModal) {
         dat=await generatequestions(sessionForm);
        setGeneratequestionsData('prabath');
        console.log("session form data in dashboard ", sessionForm);
        console.log("generatequestionsData in dashboard ", dat);  
      }
      // if(generatequestionsData!=null){console.log("true","true","true")}
      // setStats(true)
      // console.log("sessionId in dashboard ", generatequestionsData);

      closeModal();
      // Navigate to the interview session page
      // Pass the first question + session info via router state
      navigate(`/session/${dat?.sessionId}`, {
        state: {
          sessionId: dat?.sessionId,
          firstQuestion: dat?.question,
          topic: sessionForm.topic,
          totalQuestions: sessionForm.totalQuestions,
        },
      });
    } catch (err) {
      setSessionError(
        err.response?.data?.message || "Failed to start session.",
      );
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSession = (e) => {
    e.preventDefault();
     
  };

  // Calculate score percentage for the progress ring
  const scorePercent =
    stats && stats.maxScore > 0
      ? Math.round((stats.totalScore / stats.maxScore) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-base-200">
      <AppNavbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* ── Welcome banner ── */}
        <div className="mb-8">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Welcome back,{" "}
            <span className="text-primary">{user?.username ?? "there"}</span> 👋
          </h1>
          <p className="text-base-content/50 mt-1">
            Track your progress and jump into a new interview session.
          </p>
        </div>

        {/* ── Stats section ── */}
        <section className="mb-10">
          <h2 className="text-xs font-bold mb-4 text-base-content/70 uppercase tracking-widest">
            Your Progress
          </h2>

          {statsLoading ? (
            // ── Skeleton: Stats cards ──
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="card bg-base-100 border border-base-300 shadow-sm"
                >
                  <div className="card-body p-5 gap-3">
                    <div className="skeleton w-8 h-8 rounded-lg" />
                    <div className="skeleton w-16 h-8 rounded" />
                    <div className="skeleton w-24 h-3 rounded" />
                    <div className="skeleton w-20 h-2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="🎯"
                label="Total Sessions"
                value={stats?.totalSessions ?? 0}
                desc="All time interviews"
                color="primary"
              />
              <StatCard
                icon="✅"
                label="Completed"
                value={stats?.completed ?? 0}
                desc="Finished sessions"
                color="success"
              />
              <StatCard
                icon="⏳"
                label="Pending"
                value={stats?.pending ?? 0}
                desc="In progress"
                color="warning"
              />
              {/* Score card with a visual progress bar */}
              <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-5">
                  <div className="text-3xl mb-1">🏆</div>
                  <div
                    className="text-3xl font-extrabold text-accent"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {stats?.totalScore ?? 0}
                    <span className="text-base text-base-content/40">
                      /{stats?.maxScore ?? 0}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-base-content/70">
                    Total Score
                  </div>
                  {/* Progress bar */}
                  <progress
                    className="progress progress-accent w-full mt-2"
                    value={scorePercent}
                    max="100"
                  />
                  <div className="text-xs text-base-content/40">
                    {scorePercent}% of max score
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score breakdown visual (donut-style using CSS) */}
          {!statsLoading && stats && stats.totalSessions > 0 && (
            <div className="mt-4 card bg-base-100 border border-base-300 shadow-sm p-5">
              <h3 className=" font-bold text-base-content/60 mb-3 uppercase tracking-widest text-xs">
                Session Breakdown
              </h3>
              <div className="flex items-center gap-6">
                {/* Visual bar */}
                <div className="flex-1 h-4 bg-base-200 rounded-full overflow-hidden flex">
                  <div
                    className="bg-success h-full rounded-l-full transition-all duration-700"
                    style={{
                      width: `${stats.totalSessions > 0 ? (stats.completed / stats.totalSessions) * 100 : 0}%`,
                    }}
                  />
                  <div
                    className="bg-warning h-full transition-all duration-700"
                    style={{
                      width: `${stats.totalSessions > 0 ? (stats.pending / stats.totalSessions) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex gap-4 text-xs font-semibold shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                    Completed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
                    Pending
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Start Interview section ── */}
        <section className="mb-10">
          <h2 className=" font-bold mb-4 text-base-content/70 uppercase tracking-widest text-xs">
            Start New Session
          </h2>

          {/* Skeleton while loading */}
          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card bg-base-100 border border-base-300 shadow-sm"
                >
                  <div className="card-body p-6 items-center gap-3">
                    <div className="skeleton w-14 h-14 rounded-full" />
                    <div className="skeleton w-36 h-5 rounded" />
                    <div className="skeleton w-44 h-3 rounded" />
                    <div className="skeleton w-40 h-3 rounded" />
                    <div className="skeleton w-full h-9 rounded-lg mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <SessionCard
                icon="🧠"
                title="Technical Interview"
                desc="Data structures, algorithms, system concepts and more."
                color="primary"
                onClick={() => openModal("technical")}
              />
              <SessionCard
                icon="💬"
                title="HR Interview"
                desc="Behavioral questions, situational and culture-fit rounds."
                color="secondary"
                onClick={() => openModal("hr")}
              />
              <SessionCard
                icon="💻"
                title="Coding Interview"
                desc="Solve coding problems with real-time AI feedback."
                color="accent"
                onClick={() => openModal("coding")}
              />
            </div>
          )}
        </section>

        {/* ── Tips section ── */}
        <section>
          <h2 className=" font-bold mb-4 text-base-content/70 uppercase tracking-widest text-xs">
            Quick Tips
          </h2>

          {/* Skeleton while loading */}
          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="card bg-base-100 border border-base-300 shadow-sm"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-3">
                      <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="skeleton w-24 h-3 rounded" />
                        <div className="skeleton w-full h-3 rounded" />
                        <div className="skeleton w-3/4 h-3 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: "🎯",
                  tip: "Be specific",
                  detail:
                    "Use real examples from your experience. Vague answers score lower.",
                },
                {
                  icon: "⏱️",
                  tip: "Manage time",
                  detail:
                    "Don't spend too long on one question. Move forward confidently.",
                },
                {
                  icon: "🔁",
                  tip: "Review feedback",
                  detail:
                    "After each session, read AI feedback carefully to improve.",
                },
                {
                  icon: "📚",
                  tip: "Study patterns",
                  detail:
                    "Revisit past sessions to spot your weak areas and practice them.",
                },
                {
                  icon: "💡",
                  tip: "Think aloud",
                  detail:
                    "In technical rounds, explain your thought process as you answer.",
                },
                {
                  icon: "🚀",
                  tip: "Stay consistent",
                  detail:
                    "One session a day compounds into massive improvement over weeks.",
                },
              ].map(({ icon, tip, detail }) => (
                <div
                  key={tip}
                  className="card bg-base-100 border border-base-300 shadow-sm"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="font-bold text-sm">{tip}</div>
                        <div className="text-xs text-base-content/50 mt-0.5">
                          {detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ══ START SESSION MODAL (popup) ══ */}
      {activeModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            {/* Modal header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">
                {activeModal === "technical"
                  ? "🧠"
                  : activeModal === "hr"
                    ? "💬"
                    : "💻"}
              </span>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {activeModal === "technical"
                    ? "Technical Interview"
                    : activeModal === "hr"
                      ? "HR Interview"
                      : "Coding Interview"}
                </h3>
                <p className="text-xs text-base-content/50">
                  Configure your session before starting
                </p>
              </div>
            </div>

            {/* Session error */}
            {sessionError && (
              <div className="alert alert-error mb-4 py-2 text-sm">
                {sessionError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStartSession} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">Topic Name</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    activeModal === "technical"
                      ? "e.g. Arrays, Trees, OS concepts"
                      : activeModal === "hr"
                        ? "e.g. Leadership, Teamwork, Conflict"
                        : "e.g. String manipulation, DP"
                  }
                  value={sessionForm.topic}
                  onChange={(e) =>
                    setSessionForm((f) => ({ ...f, topic: e.target.value }))
                  }
                  required
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">
                    Number of Questions
                  </span>
                  <span className="label-text-alt text-base-content/40">
                    1 – 20
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={sessionForm.totalQuestions}
                  onChange={(e) =>
                    setSessionForm((f) => ({
                      ...f,
                      totalQuestions: e.target.value,
                    }))
                  }
                  required
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div className="modal-action mt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sessionLoading}
                  className="btn btn-primary"
                  onClick={handleStartSession}
                >
                  {sessionLoading && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  {sessionLoading ? "Starting…" : "Start Session →"}
                </button>
              </div>
            </form>
          </div>
          {/* Click outside to close */}
          <div className="modal-backdrop" onClick={closeModal} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Dashboard;
