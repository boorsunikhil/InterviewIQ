import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInterviewStore from "../store/InterviewStore";
import AppNavbar from "../components/AppNavbar";
import ChatBubble from "../components/ChatBubble";

import { useParams, useLocation } from "react-router-dom";

function InterviewSessionInner() {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getChatHistory, chatHistory, evaluateAnswer, sessionId } =
    useInterviewStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState(null);

  const sessionIdFromState = location.state?.sessionId;
  const firstQuestionFromState = location.state?.firstQuestion;
  const topicFromState = location.state?.topic;
  const totalQuestionsFromState = location.state?.totalQuestions;
  id = sessionIdFromState || id; // Use sessionId from state if available, otherwise fallback to URL param

  console.log("Session ID from URL:", id);
  console.log("Session ID from state:", sessionIdFromState);
  console.log("First question from state:", firstQuestionFromState);
  console.log("Topic from state:", topicFromState);
  console.log("Total questions from state:", totalQuestionsFromState);
  console.log("session id from store", sessionId);

   const [isMuted, setIsMuted] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    // console.log("SpeechRecognition window:", SpeechRecognition);

    if (!SpeechRecognition) {
      alert("Not supported");
      return;
    }

    const recog = new SpeechRecognition();

    recog.continuous = true;
    recog.interimResults = true;
    recog.maxAlternatives = 2;
    recog.lang = "en-IN";

    recog.onstart = () => {
      console.log("🎤 STARTED LISTENING");
      setIsListening(true);
    };

    recog.onend = () => {
      console.log("🛑 STOPPED");
      setIsListening(false);
    };

    recog.onresult = (event) => {
      console.log("RESULT EVENT FIRED");
      const transcript = event.results[0][0].transcript;
      console.log("You said:", transcript);
      console.log("Confidence:", event.results[0][0].confidence);
      console.log("Is Final:", event.results[0][0].isFinal);
      console.log("All alternatives:", event.results[0]);
      setAnswer(transcript);
    };

    recog.onerror = (event) => {
      console.log("❌ ERROR:", event.error);
    };

    setRecognition(recog);
  }, []);

  const startListening = () => {
    console.log("Start button clicked");

    if (!recognition) {
      console.log("❌ recognition is NULL");
      return;
    }

    try {
      speechSynthesis.cancel();
      recognition.start();
    } catch (err) {
      console.log("Start error:", err);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (!recognition) return;
    recognition.stop();
    handleSubmitAnswer();
  };

  const speak = (text) => {
    if (!text) return;
    let clean = text
      .replace(/\*\*/g, "") // remove **
      .replace(/\*/g, "")
      .replace(/\`/g, "") // remove *
      .replace(/-/g, "") // remove dashes
      .replace(/\n/g, " ") // remove new lines
      .replace(/\s+/g, " ") // normalize spaces
      .trim();
    speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(clean);

    const voices = speechSynthesis.getVoices();

    utterance.voice =
      voices.find((v) => v.name.includes("Female")) ||
      voices.find((v) => v.name === "Google UK English Female") ||
      voices[0];
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-IN";

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isMuted) {
      speechSynthesis.cancel(); // stop any ongoing speech when muted
    }
    if (!sessionData?.messages?.length) return;

    const lastMessage = sessionData.messages[sessionData.messages.length - 1];

    const lastAIfeedback =
      sessionData.messages[sessionData.messages.length - 2];

    if (
      lastAIfeedback?.feedback &&
      lastAIfeedback?.score &&
      !isMuted &&
      !loading
    ) {
      speak(
        `${lastAIfeedback.feedback}Your score for this question was ${lastAIfeedback.score} out of 10., "Here's the next question.", ${lastMessage.question}`,
      );
    } else if (lastMessage.question && !isMuted && !loading) {
      speak(`Here's the first question. ${lastMessage.question}`);
    }
    // Prioritize speaking feedback if available, otherwise speak the question

    return () => {
      speechSynthesis.cancel(); // cleanup on unmount or when dependencies change
    };
  }, [sessionData.messages, loading, isMuted]);

  const handleanswer = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    const lastquestionobject = sessionData.messages.find(
      (msg) => msg.questionNumber === sessionData.messages.length,
    );
    const questionId = lastquestionobject?._id;
    const questionNumber = sessionData.messages.length;
    const question = lastquestionobject?.question;
    const sessionId = sessionData.sessionId;
    const payload = {
      question,
      answer,
      sessionId,
      questionNumber,
      questionId,
    };
    console.log("Payload for evaluation:", payload);
    setData(payload);
  };

  useEffect(() => {
    console.log("Data to submit for evaluation:", data);
    if (data) {
      const submitAnswer = async () => {
        console.log("Submitting answer with payload:", data);
        const res = await evaluateAnswer(data);
        if (res) {
          await getChatHistory(id);
        }
        setData(null); // reset data after submission
        setAnswer(""); // clear textarea after submission
      };
      submitAnswer();
    }
  }, [data, evaluateAnswer, getChatHistory, id]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      await getChatHistory(id); // wait for store to update
      setLoading(false);
    };

    fetchChats();
  }, [getChatHistory, id, data]);

  useEffect(() => {
    if (chatHistory) {
      setSessionData(chatHistory);
      // console.log("Session data set in PastSession:", chatHistory);
    }
  }, [chatHistory, data]);

  const isCompleted = sessionData?.status === "completed";

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <AppNavbar />

      {/* Skeleton — past session chat loading */}
      {loading && (
        <div className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Skeleton header bar */}
            <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="skeleton w-8 h-8 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <div className="skeleton w-40 h-4 rounded" />
                  <div className="skeleton w-24 h-3 rounded" />
                </div>
              </div>
              <div className="skeleton w-16 h-8 rounded" />
            </div>

            {/* Alternating question/answer skeleton bubbles */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                {/* Question — left */}
                <div className="chat chat-start">
                  <div className="chat-bubble bg-base-300 flex flex-col gap-2 max-w-sm">
                    <div className="skeleton w-48 h-3 rounded bg-base-content/10" />
                    <div className="skeleton w-64 h-3 rounded bg-base-content/10" />
                    <div className="skeleton w-40 h-3 rounded bg-base-content/10" />
                  </div>
                </div>
                {/* Answer — right */}
                <div className="chat chat-end">
                  <div className="chat-bubble bg-base-300 flex flex-col gap-2 max-w-xs">
                    <div className="skeleton w-40 h-3 rounded bg-base-content/10" />
                    <div className="skeleton w-32 h-3 rounded bg-base-content/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && sessionData.length == 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl block mb-3">😕</span>
            <p className="text-base-content/50">Session not found.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate("/history")}
            >
              Back to History
            </button>
          </div>
        </div>
      )}

      {!loading && sessionData && (
        <>
          {/* Session header */}
          <div className="bg-base-100 border-b border-base-300 px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {sessionData.type === "technical"
                      ? "🧠"
                      : sessionData.type === "hr"
                        ? "💬"
                        : "💻"}
                  </span>
                  <h2
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {sessionData.topic || `${sessionData.type} Interview`}
                  </h2>
                  <span
                    className={`badge badge-sm ${
                      isCompleted ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {sessionData.status}
                  </span>
                </div>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Session ID: {id}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Score display */}
                <div className="text-right">
                  <div className="font-extrabold text-xl text-primary">
                    {sessionData.score ?? "—"}
                    <span className="text-sm text-base-content/40">
                      /{sessionData.maxScore ?? "—"}
                    </span>
                  </div>

                  <div className="text-xs text-base-content/40">
                    final score
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm"
                    onClick={() => setIsMuted((prev) => !prev)}
                  >
                    {isMuted ? "🔇 Muted" : "🔊 Voice"}
                  </button>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate("/history")}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>

          {/* Chat replay area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-2">
              {(!sessionData.messages || sessionData.messages.length === 0) && (
                <div className="text-center text-base-content/30 py-20">
                  No messages recorded for this session.
                </div>
              )}

              {sessionData.messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.question && (
                    <ChatBubble
                      side="left"
                      content={`Q. ${msg.question}`}
                      label="InterviewIQ AI"
                    />
                  )}

                  {msg.answer && (
                    <ChatBubble side="right" content={msg.answer} label="You" />
                  )}

                  {msg.feedback && (
                    <ChatBubble
                      side="left"
                      content={`${msg.feedback} score : ${msg.score}`}
                      label="AI Feedback"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Disabled input for completed sessions */}
          <div className="bg-base-100 border-t border-base-300 px-4 py-4 sticky bottom-0">
            <div className="max-w-4xl mx-auto">
              {sessionData.completed ? (
                <div className="flex items-center justify-center gap-2 py-2 text-base-content/40 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  This session is completed — input is disabled.
                </div>
              ) : (
                // Session is pending — allow continuing
                <div className="flex gap-3 items-end">
                  <textarea
                    className="textarea textarea-bordered flex-1 resize-none text-sm opacity-50"
                    rows={3}
                    placeholder="Session is in progress…"
                    onChange={handleanswer}
                    value={answer}
                    disabled={isCompleted}
                  />
                  {/* 🎤 MIC BUTTON */}
                  <button
                    className={`btn ${isListening ? "btn-error" : "btn-secondary"}`}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? "🎤 Listening..." : "🎤 Speak"}
                  </button>

                  <button
                    className="btn btn-primary h-full px-6"
                    onClick={handleSubmitAnswer}
                    disabled={isCompleted || answer.trim() === ""}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InterviewSessionInner;
