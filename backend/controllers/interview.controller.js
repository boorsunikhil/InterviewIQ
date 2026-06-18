import InterviewSession from "../model/interviewSession.model.js";
import InterviewMessage from "../model/interviewMessage.model.js";
import { ai } from "../lib/ai.js";
import { GoogleGenAI } from "@google/genai";
import mongoose from 'mongoose';


// export const totalresult = async (sessionId, res) => {
//   try {
//     const sessionid = sessionId;

//     if (!sessionid) {
//       return res.status(400).json({ message: "Please provide session id" });
//     }

//     const session = await InterviewSession.findById(sessionid);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }
//     const allMessages = await InterviewMessage.find({ sessionId: sessionid });

//     if (allMessages.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No messages found for this session" });
//     }

//     const totalScore = allMessages.reduce((acc, message) => {
//       return acc + (Number(message.score) || 0);
//     }, 0);

//     const averageScore = allMessages.length
//       ? totalScore / allMessages.length
//       : 0;
//     const outoftotal = allMessages.length * 10;

//     const simplified = allMessages.map((message) => ({
//       question: message.question,
//       answer: message.answer,
//       feedback: message.feedback,
//       score: message.score,
//     }));

//     const prompt = `
// You are a senior interviewer.

// Based on this interview session, provide:

// - Overall performance
// - Strengths
// - Weaknesses
// - Improvements

// Return ONLY JSON:
// {
//   "feedback": "detailed feedback"
// }

// Interview data:
// ${JSON.stringify(simplified)}
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     });

//     if (!response?.text) {
//       return res.status(500).json({ message: "AI failed" });
//     }
//     const cleanfeedback = response.text.replace(/```json|```/g, "").trim();
//     const finalFeedback = JSON.parse(cleanfeedback);

//     res.status(200).json({
//       success: true,
//       totalScore,
//       averageScore,
//       outoftotal,
//       feedback: finalFeedback,
//       details: allMessages.map((msg) => ({
//         question: msg.question,
//         answer: msg.answer,
//         feedback: msg.feedback,
//         score: msg.score,
//       })),
//     });
//   } catch (error) {
//     console.log("AI error in total result", error);
//     res.status(500).json({ message: "AI failed" });
//   }
// };


export const totalresult = async (sessionId, res) => {
  try {
    if (!sessionId) {
      return res.status(400).json({ message: "Please provide session id" });
    }

   

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const allMessages = await InterviewMessage.find({ sessionId });

    if (!allMessages.length) {
      return res.status(404).json({
        message: "No messages found for this session",
      });
    }

    // ✅ Score calculation
    const totalScore = allMessages.reduce(
      (acc, msg) => acc + (Number(msg.score) || 0),
      0
    );

    const averageScore = totalScore / allMessages.length;
    const outoftotal = allMessages.length * 10;

    const simplified = allMessages.map((msg) => ({
      question: msg.question,
      answer: msg.answer,
      feedback: msg.feedback,
      score: msg.score,
    }));

    // ✅ AI final feedback
    const prompt = `
You are a senior interviewer.

Based on this interview session, provide:
- Overall performance
- Strengths
- Weaknesses
- Improvements

Return ONLY JSON:
{
  "feedback": "detailed feedback"
}

Interview data:
${JSON.stringify(simplified)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response?.text) {
      return res.status(500).json({ message: "AI failed" });
    }

    // ✅ Safe parsing
    const cleanfeedback = response.text.replace(/```json|```/g, "").trim();

    let finalFeedback;
    try {
      finalFeedback = JSON.parse(cleanfeedback);
    } catch (err) {
      return res.status(500).json({ message: "Invalid AI response format" });
    }

    console.log("Stats - Total Score:", totalScore, "Average Score:", averageScore, "Max Score:", outoftotal);

    return res.status(200).json({
      success: true,
      totalScore,
      averageScore,
      maxScore: outoftotal,
      feedback: finalFeedback,
      details: simplified,
    });

  } catch (error) {
    console.log("AI error in total result", error);
    return res.status(500).json({ message: "AI failed" });
  }

};
export const allChats = async (req, res) => {
  try {
    const  userid  = req.user._id;
    // console.log("User ID for fetching all chats:", req.user._id);
    if (!userid) {
      return res.status(400).json({ message: "Please provide user id" });
    }

    const sessions = await InterviewSession.find({ userId: userid });// Fetch all sessions for the user
    const sessionsWithStatus = sessions.map((session) => ({
      _id: session._id,
      type: session.type,
      topic: session.topic,
      totalQuestions: session.totalQuestions,
      completed: session.completed,
      createdAt: session.createdAt,
    }));

  const scores = await InterviewMessage.find({ sessionId: { $in: sessions.map((s) => s._id) } })// Fetch all messages for the user's sessions
// console.log("Aggregated scores:", scores);
    if (sessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for this user" });
    }

    res.status(200).json({
      success: true,
      sessions: sessionsWithStatus.map((session) => {
   
        const score = scores.filter((s) => s.sessionId === session._id.toString());
        const totalScore = score.reduce((acc, msg) => acc + (Number(msg.score) || 0), 0);
        // console.log(`Session ID: ${session._id}, Score Object:`, score, "Total Score:", totalScore);
        return {
          ...session,
          score: score ? totalScore : 0,
          maxScore: session.totalQuestions * 10,
          type: session.type || "interview",
        };
      }),
    });// Return the sessions as they are, without populating messages
  } catch (error) {
    console.log("Error fetching all chats", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const chatHistory = async (req, res) => {
  try {
    const { sessionid } = req.query;

    if (!sessionid) {
      return res.status(400).json({ message: "Please provide session id"});
    }
     if (!sessionid || !mongoose.Types.ObjectId.isValid(sessionid)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    const interviewtype=await InterviewSession.findById(sessionid).select("type completed topic totalQuestions");
    const messages = await InterviewMessage.find({ sessionId: sessionid }).sort({ questionNumber: 1 });;


      if(!interviewtype){
        return res.status(404).json({ message: "session does not exist" });
      }
    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this session" });
    }

   const filteredMessages = messages.filter((msg) => {
  return msg.answer;
});
  if(filteredMessages.length === 0) {
    filteredMessages.push(messages[0]);
  }else{
    filteredMessages.push(messages[messages.length-1]);
  }

    if(filteredMessages.length >messages.length ){
      interviewtype.completed=true;
      await interviewtype.save();

    

      return res.status(200).json({
        success: true,
        messages:filteredMessages,
        sessionId: sessionid,
        type:interviewtype.type || 'interview',
        completed:interviewtype.completed,
        topic:interviewtype.topic,
        totalQuestions:interviewtype.totalQuestions,
        score:filteredMessages.reduce((acc, msg) => acc + (Number(msg.score) || 0), 0),
        maxScore:interviewtype.totalQuestions * 10
      });
    }else{
      interviewtype.completed=false;
      await interviewtype.save();
    }



    res.status(200).json({
      success: true,
      messages:filteredMessages,
      sessionId: sessionid,
      type:interviewtype.type || 'interview',
      completed:interviewtype.completed,
      topic:interviewtype.topic,
      totalQuestions:interviewtype.totalQuestions
    });
  } catch (error) {
    console.log("Error fetching chat history", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};




export const stats = async (req, res) => {
  try {
    const userid = req.user._id;
    const sessions = await InterviewSession.find({ userId: userid });// Fetch all sessions for the user

    const totalSessions = sessions.length;
    const completed = sessions.filter((s) => s.completed).length;
    const totalquestions = sessions.reduce((acc, s) => acc +Number( s.totalQuestions), 0);
    // console.log('sessions are : ',sessions);
    const pending = totalSessions - completed;
    const totalScore = await InterviewMessage.find({ sessionId: { $in: sessions.map((s) => s._id) } })// Fetch all messages for the user's sessions
    const score=totalScore.reduce((acc, msg) => acc + (Number(msg.score) || 0), 0);// Calculate total score across all messages
    const maxScore = totalquestions* 10; // Assuming max score per question is 10
    console.log("Stats - Total Sessions:", totalquestions, "Completed:", completed, "Pending:", pending, "Total Score:", score, "Max Score:", maxScore);
    res.status(200).json({
      totalSessions,
      completed,
      pending,
      totalScore: score || 0,
      maxScore,
    });
  }
    catch (error) {
        console.log("Error fetching stats", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};


import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const trial = async (req, res) => {

async function checkMyModels() {
  try {
    // We use the underlying fetch API because the SDK 
    // focuses mostly on generation rather than listing.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log("--- YOUR ACCESSIBLE MODELS ---");
    data.models.forEach((m) => {
      // Look for 'generateContent' in supported methods
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`Model ID: ${m.name.split('/')[1]}`);
        console.log(`Description: ${m.description}`);
        console.log("------------------------------");
      }
    });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

checkMyModels();

//--- YOUR ACCESSIBLE MODELS ---
// Model ID: gemini-2.5-flash
// Description: Stable version of Gemini 2.5 Flash, our mid-size multimodal model that supports up to 1 million tokens, released in June of 2025.
// ------------------------------
// Model ID: gemini-2.5-pro
// Description: Stable release (June 17th, 2025) of Gemini 2.5 Pro
// ------------------------------
// Model ID: gemini-2.0-flash
// Description: Gemini 2.0 Flash
// ------------------------------
// Model ID: gemini-2.0-flash-001
// Description: Stable version of Gemini 2.0 Flash, our fast and versatile multimodal model for scaling across diverse tasks, released in January of 2025.
// ------------------------------
// Model ID: gemini-2.0-flash-lite-001
// Description: Stable version of Gemini 2.0 Flash-Lite
// ------------------------------
// Model ID: gemini-2.0-flash-lite
// Description: Gemini 2.0 Flash-Lite
// ------------------------------
// Model ID: gemini-2.5-flash-preview-tts
// Description: Gemini 2.5 Flash Preview TTS
// ------------------------------
// Model ID: gemini-2.5-pro-preview-tts
// Description: Gemini 2.5 Pro Preview TTS
// ------------------------------
// Model ID: gemma-3-1b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-3-4b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-3-12b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-3-27b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-3n-e4b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-3n-e2b-it
// Description: undefined
// ------------------------------
// Model ID: gemma-4-26b-a4b-it
// Description: Gemma 4 26B A4B IT
// ------------------------------
// Model ID: gemma-4-31b-it
// Description: Gemma 4 31B IT
// ------------------------------
// Model ID: gemini-flash-latest
// Description: Latest release of Gemini Flash
// ------------------------------
// Model ID: gemini-flash-lite-latest
// Description: Latest release of Gemini Flash-Lite
// ------------------------------
// Model ID: gemini-pro-latest
// Description: Latest release of Gemini Pro
// ------------------------------
// Model ID: gemini-2.5-flash-lite
// Description: Stable version of Gemini 2.5 Flash-Lite, released in July of 2025
// ------------------------------
// Model ID: gemini-2.5-flash-image
// Description: Gemini 2.5 Flash Preview Image
// ------------------------------
// Model ID: gemini-3-pro-preview
// Description: Gemini 3 Pro Preview
// ------------------------------
// Model ID: gemini-3-flash-preview
// Description: Gemini 3 Flash Preview
// ------------------------------
// Model ID: gemini-3.1-pro-preview
// Description: Gemini 3.1 Pro Preview
// ------------------------------
// Model ID: gemini-3.1-pro-preview-customtools
// Description: Gemini 3.1 Pro Preview optimized for custom tool usage
// ------------------------------
// Model ID: gemini-3.1-flash-lite-preview
// Description: Gemini 3.1 Flash Lite Preview
// ------------------------------
// Model ID: gemini-3-pro-image-preview
// Description: Gemini 3 Pro Image Preview
// ------------------------------
// Model ID: nano-banana-pro-preview
// Description: Gemini 3 Pro Image Preview
// ------------------------------
// Model ID: gemini-3.1-flash-image-preview
// Description: Gemini 3.1 Flash Image Preview.
// ------------------------------
// Model ID: lyria-3-clip-preview
// Description: Lyria 3 30s model Preview
// ------------------------------
// Model ID: lyria-3-pro-preview
// Description: Lyria 3 Pro Preview
// ------------------------------
// Model ID: gemini-robotics-er-1.5-preview
// Description: Gemini Robotics-ER 1.5 Preview
// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// Model ID: deep-research-pro-preview-12-2025
// Description: Preview release (December 12th, 2025) of Deep Research Pro
// ------------------------------

// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// Model ID: deep-research-pro-preview-12-2025
// Description: Preview release (December 12th, 2025) of Deep Research Pro
// ------------------------------



// ------------------------------
// Model ID: gemini-2.5-computer-use-preview-10-2025
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// Description: Gemini 2.5 Computer Use Preview 10-2025
// ------------------------------
// Model ID: deep-research-pro-preview-12-2025
// Model ID: deep-research-pro-preview-12-2025
// Description: Preview release (December 12th, 2025) of Deep Research Pro
// Description: Preview release (December 12th, 2025) of Deep Research Pro
// ------------------------------
};



