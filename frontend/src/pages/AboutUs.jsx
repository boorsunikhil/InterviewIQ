import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";   // shows logo only (no auth buttons)
import Footer from "../components/Footer";
import useAuthStore  from "../store/AuthStore.js"; // to show correct CTA

// ── Reusable section heading ──
function SectionHeading({ label, title, sub }) {
  return (
    <div className="text-center mb-10">
      {/* Small label above heading */}
      <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">
        {label}
      </span>
      <h2
        className="text-3xl font-extrabold tracking-tight mt-2"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="text-base-content/50 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Feature card ──
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <div className="card-body p-5">
        <div className="text-3xl mb-3">{icon}</div>
        <h3
          className="font-bold text-base mb-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-base-content/55 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── How it works step ──
function Step({ number, title, desc, icon }) {
  return (
    <div className="flex gap-4 items-start">
      {/* Step number circle */}
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-primary font-extrabold text-sm font-mono">{number}</span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{icon}</span>
          <h3
            className="font-bold text-base"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {title}
          </h3>
        </div>
        <p className="text-sm text-base-content/55 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── Tech badge ──
function TechBadge({ name, color = "badge-ghost" }) {
  return (
    <span className={`badge ${color} badge-md font-mono text-xs gap-1`}>
      {name}
    </span>
  );
}

// ── Stat card ──
function StatCard({ value, label, icon }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-extrabold text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {value}
      </div>
      <div className="text-sm text-base-content/50 mt-1">{label}</div>
    </div>
  );
}

// ── Logo (inline — same as navbar) ──
function Logo({ size = 40 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-primary flex items-center justify-center"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="11" r="3" fill="white" />
        <circle cx="29" cy="17" r="2.5" fill="white" opacity=".8" />
        <circle cx="29" cy="26" r="2.5" fill="white" opacity=".8" />
        <circle cx="20" cy="30" r="3" fill="white" />
        <circle cx="11" cy="26" r="2.5" fill="white" opacity=".8" />
        <circle cx="11" cy="17" r="2.5" fill="white" opacity=".8" />
        <circle cx="20" cy="20" r="3" fill="white" />
        <line x1="20" y1="14" x2="20" y2="17" stroke="white" strokeWidth="1.8" />
        <line x1="27" y1="18.5" x2="23" y2="19" stroke="white" strokeWidth="1.8" />
        <line x1="27" y1="24.5" x2="23" y2="21" stroke="white" strokeWidth="1.8" />
        <line x1="20" y1="27" x2="20" y2="23" stroke="white" strokeWidth="1.8" />
        <line x1="13" y1="24.5" x2="17" y2="21" stroke="white" strokeWidth="1.8" />
        <line x1="13" y1="18.5" x2="17" y2="19" stroke="white" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

// ── Main About Page ──────────────────────────────────────
export default function AboutUs() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar — minimal, shows logo only */}
      <AppNavbar />

      <main className="flex-1">

        {/* ════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════ */}
        <section className="bg-base-100 border-b border-base-300 py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">

            {/* Logo + badge */}
            <div className="flex justify-center mb-5">
              <Logo size={64} />
            </div>
            <div className="badge badge-primary badge-outline badge-sm font-mono mb-4">
              AI-Powered Interview Prep
            </div>

            {/* Main headline */}
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ace every interview with{" "}
              <span className="text-primary">InterviewIQ</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base-content/55 mt-4 text-lg leading-relaxed max-w-xl mx-auto">
              A full-stack AI interview simulator that gives you real questions,
              evaluates your answers instantly, and tracks your progress — so you
              walk into every interview prepared.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 justify-center flex-wrap mt-8">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg font-bold">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/" className="btn btn-primary btn-lg font-bold">
                    Get Started Free →
                  </Link>
                  <Link to="/" className="btn btn-ghost btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "🧠 Technical",
                "💬 HR / Behavioral",
                "💻 Coding rounds",
                "📊 AI feedback",
                "📋 Session history",
              ].map((pill) => (
                <span key={pill} className="badge badge-ghost font-mono text-xs">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — WHAT IS INTERVIEWIQ
        ════════════════════════════════════════ */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              label="About the project"
              title="What is InterviewIQ?"
              sub="InterviewIQ is a personal interview preparation platform built to simulate real interview environments with AI."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left — description */}
              <div className="space-y-4 text-sm text-base-content/65 leading-relaxed">
                <p>
                  Most people prepare for interviews by reading articles or watching videos —
                  but the best way to prepare is to <strong className="text-base-content">actually practice</strong>.
                  InterviewIQ lets you do exactly that.
                </p>
                <p>
                  You choose the interview type — technical, HR, or coding — pick a topic
                  and number of questions, and the AI generates a realistic interview session.
                  You answer in a chat-style interface, get immediate AI feedback on every
                  answer, and see your score at the end.
                </p>
                <p>
                  Every session is saved to your history, so you can review past interviews,
                  spot weak areas, and track how you improve over time.
                </p>
              </div>

              {/* Right — quick highlights */}
              <div className="space-y-3">
                {[
                  { icon: "🎯", text: "AI-generated questions tailored to your topic" },
                  { icon: "⚡", text: "Instant per-answer feedback and scoring" },
                  { icon: "📋", text: "Full session history with chat replay" },
                  { icon: "📊", text: "Dashboard tracking your overall progress" },
                  { icon: "🔒", text: "Secure user auth with session management" },
                  { icon: "📱", text: "Fully responsive — works on any device" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 bg-base-100 border border-base-300 rounded-xl px-4 py-3"
                  >
                    <span className="text-lg shrink-0">{icon}</span>
                    <span className="text-sm text-base-content/70">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ════════════════════════════════════════ */}
        <section className="py-16 px-4 bg-base-100 border-y border-base-300">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="Process"
              title="How it works"
              sub="From signup to your first interview session in under two minutes."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Step
                number="01"
                icon="🔐"
                title="Create your account"
                desc="Sign up in seconds with just your username, email, and password. No credit card needed."
              />
              <Step
                number="02"
                icon="🚀"
                title="Start a session"
                desc="Choose Technical, HR, or Coding. Pick a topic and set how many questions you want."
              />
              <Step
                number="03"
                icon="💬"
                title="Answer and get feedback"
                desc="Answer each question in the chat. The AI evaluates your response and gives instant feedback and a score."
              />
            </div>

            {/* Arrow connector (desktop) */}
            <div className="hidden md:flex justify-center items-center gap-4 mt-8">
              {["Sign up", "Configure session", "Practice and improve"].map(
                (step, i, arr) => (
                  <div key={step} className="flex items-center gap-4">
                    <span className="badge badge-primary badge-sm font-mono">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-base-content/30 text-lg">→</span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — FEATURES
        ════════════════════════════════════════ */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              label="Features"
              title="Everything you need to prepare"
              sub="Built with the tools and workflows that real interview preparation demands."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon="🧠"
                title="Technical interview mode"
                desc="Data structures, algorithms, OS concepts, databases, system design — AI generates questions matched to your topic."
              />
              <FeatureCard
                icon="💬"
                title="HR & behavioral mode"
                desc="Leadership, teamwork, conflict resolution, situational questions — practice answering with the STAR method."
              />
              <FeatureCard
                icon="💻"
                title="Coding interview mode"
                desc="Write code or explanations in a textarea and get evaluated on correctness, efficiency, and clarity."
              />
              <FeatureCard
                icon="📊"
                title="Progress dashboard"
                desc="Track total sessions, completed vs pending, and your cumulative score across all interviews at a glance."
              />
              <FeatureCard
                icon="📋"
                title="Full session history"
                desc="Every interview is saved. Revisit any past session to see the full Q&A chat and AI feedback."
              />
              <FeatureCard
                icon="⚡"
                title="Instant AI feedback"
                desc="After every answer, get specific feedback on what was good, what was missing, and how to improve."
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — TECH STACK
        ════════════════════════════════════════ */}
        <section className="py-16 px-4 bg-base-100 border-y border-base-300">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="Tech stack"
              title="Built with modern tools"
              sub="A clean, production-grade MERN stack with AI integration."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Frontend */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-5">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/50 mb-3 font-mono">
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TechBadge name="React 18" color="badge-info" />
                    <TechBadge name="React Router v6" color="badge-info" />
                    <TechBadge name="Zustand" color="badge-info" />
                    <TechBadge name="Axios" color="badge-info" />
                    <TechBadge name="Tailwind CSS v4" color="badge-info" />
                    <TechBadge name="DaisyUI" color="badge-info" />
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-5">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/50 mb-3 font-mono">
                    Backend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TechBadge name="Node.js" color="badge-success" />
                    <TechBadge name="Express.js" color="badge-success" />
                    <TechBadge name="MongoDB" color="badge-success" />
                    <TechBadge name="Mongoose" color="badge-success" />
                    <TechBadge name="JWT / Sessions" color="badge-success" />
                    <TechBadge name="REST API" color="badge-success" />
                  </div>
                </div>
              </div>

              {/* AI */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-5">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/50 mb-3 font-mono">
                    AI Integration
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TechBadge name="AI Question Gen" color="badge-warning" />
                    <TechBadge name="AI Evaluation" color="badge-warning" />
                    <TechBadge name="Scoring Engine" color="badge-warning" />
                    <TechBadge name="Feedback Engine" color="badge-warning" />
                  </div>
                </div>
              </div>

              {/* DevOps / Tools */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-5">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/50 mb-3 font-mono">
                    Tools & workflow
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TechBadge name="Vite" />
                    <TechBadge name="Git & GitHub" />
                    <TechBadge name="Postman" />
                    <TechBadge name="VS Code" />
                    <TechBadge name="npm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 6 — STATS
        ════════════════════════════════════════ */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="By the numbers"
              title="Built to scale"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value="3" label="Interview types" icon="🎯" />
              <StatCard value="∞" label="AI-generated questions" icon="🧠" />
              <StatCard value="100%" label="Instant feedback" icon="⚡" />
              <StatCard value="1" label="Platform to rule them all" icon="🏆" />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 7 — CTA
        ════════════════════════════════════════ */}
        <section className="py-16 px-4 bg-primary/5 border-t border-primary/10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <Logo size={52} />
            </div>
            <h2
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ready to start practicing?
            </h2>
            <p className="text-base-content/50 mt-3 text-sm leading-relaxed">
              Create a free account, start your first session, and find out
              exactly where you stand — before the real interview.
            </p>
            <div className="flex gap-3 justify-center flex-wrap mt-7">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg font-bold">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/" className="btn btn-primary btn-lg font-bold">
                    Start for free →
                  </Link>
                  <Link to="/" className="btn btn-ghost btn-lg">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}