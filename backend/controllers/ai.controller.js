import { ai } from "../lib/ai.js";
import InterviewSession from "../model/interviewSession.model.js";
import InterviewMessage from "../model/interviewMessage.model.js";
import {totalresult} from "./interview.controller.js";

export const generateQuestion = async (req, res) => {
  try {
    const { topic, totalQuestions, type } = req.body;
    const userId = req.user._id;

    if (!topic || !totalQuestions || !type) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    const prompt = `Generate ${totalQuestions} ${type} interview questions about ${topic}. 
    Return strictly a JSON array of strings. No markdown, no conversational text. 
    Example: ["Question 1", "Question 2"]`;

    // --- FALLBACK LOGIC START ---
    // List your free models in order of preference
    const availableModels = [
      "gemini-3.1-flash-lite-preview", 
      "gemini-2.5-flash", 
      "gemini-2.0-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash-lite-001",
      "gemini-2.0-flash-lite",
      "gemini-3-flash-preview",
      "gemini-3.1-pro-preview",
      "gemini-3.1-flash",
      "gemini-2.5-flash-preview-tts"
    ];

    let response;
    let success = false;
    let lastError;

    for (const modelId of availableModels) {
      try {
        console.log(`Attempting generation with: ${modelId}`);
        response = await ai.models.generateContent({
          model: modelId,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" } // Forces valid JSON
        });
        
        if (response && response.text) {
          success = true;
          break; // Exit loop if successful
        }
      } catch (err) {
        lastError = err;
        // Only retry if it's a 503 (Busy) or 429 (Rate Limit)
        if (err.status === 503 || err.status === 429) {
          console.warn(`${modelId} busy or limited. Trying next...`);
          continue; 
        } else {
          throw err; // If it's a different error (like auth), stop immediately
        }
      }
    }

    if (!success) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }
    // --- FALLBACK LOGIC END ---

    // Sanitize and Parse
    let rawText = response.text;
    const trimmedText = rawText.replace(/```json|```/g, "").trim();
    
    // Final sanitization for hidden control characters
    const sanitizedText = trimmedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    const questionsArray = JSON.parse(sanitizedText);

    // 1. Create the Session
    const interviewSession = new InterviewSession({
      userId,
      topic,
      totalQuestions,
      questionAsked: 1,
      type
    });
    await interviewSession.save();

    // 2. Prepare Message Objects
    const interviewMessagesObject = questionsArray.map((question, index) => ({
      sessionId: interviewSession._id,
      userId,
      question,
      questionNumber: index + 1,
    }));

    // 3. Save Questions 
    const savedMessages = await InterviewMessage.insertMany(interviewMessagesObject);

    res.status(200).json({
      success: true,
      question: questionsArray[0],
      sessionId: interviewSession._id,
      questionId: savedMessages[0]._id,
      questionNumber: 1,
      type
    });

  } catch (error) {
    console.error("Critical AI Error:", error);
    res.status(500).json({ 
      message: "AI generation failed after multiple attempts", 
      error: error.message 
    });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, sessionId, questionId } = req.body;

    // ✅ Validation
    if (!question || !answer || !sessionId || !questionId) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    // ✅ AI Prompt
    const prompt = `You are a strict technical interviewer.

Question: ${question}
Answer: ${answer}

Evaluate strictly.

Return ONLY JSON:
{
  "score": number (0-10),
  "feedback": "short constructive feedback with area of improvement and correct answer if wrong"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response?.text) {
      return res.status(500).json({ message: "AI failed" });
    }

    // ✅ Safe JSON parsing
    const cleanJson = response.text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      return res.status(500).json({ message: "Invalid AI response format" });
    }

    const { score, feedback } = parsed;

    // ✅ Update question
    const update = await InterviewMessage.findByIdAndUpdate(
      questionId,
      { answer, feedback, score },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ Update session (single DB call)
    const session = await InterviewSession.findByIdAndUpdate(
      sessionId,
      { $inc: { questionAnswered: 1 } },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // ✅ Completion check (safe)
    if (!session.completed && session.questionAnswered === session.totalQuestions) {
      session.completed = true;
      await session.save();

      // ✅ IMPORTANT: return to avoid double response
      return totalresult(sessionId, res);
    }

    // ✅ Fetch next question
    const nextQuestion = await InterviewMessage.findOne({
      sessionId: sessionId,
      questionNumber: session.questionAnswered, // ✅ fixed logic
    });

    if (!nextQuestion) {
      return res.status(200).json({
        success: true,
        message: "Interview completed",
      });
    }

    return res.status(200).json({
      success: true,
      score,
      feedback,
      nextQuestion: nextQuestion.question,
      questionId: nextQuestion._id,
      questionNumber: nextQuestion.questionNumber,
    });

  } catch (error) {
    console.log("AI error in evaluate answer", error);
    return res.status(500).json({ message: "AI failed" });
  }
};

// export const evaluateAnswer = async (req, res) => {
//   try {
//     const { question, answer, sessionId, questionNumber,questionId } = req.body;

//     if (!question || !answer || !sessionId||!questionId) {
//       return res.status(400).json({ message: "Please provide all the fields" });
//     }

//     const prompt = `You are a strict technical interviewer.

// Question: ${question}
// Answer: ${answer}

// Evaluate strictly.

// Return ONLY JSON:
// {
//   "score": number (0-10),
//   "feedback": "short constructive feedback with area of improvement and correct answer if the given answer is wrong",
// }`;
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });


//     console.log("Raw AI response for evaluation:", response.text);

//     if (!response?.text) {
//       return res.status(500).json({ message: "AI failed" });
//     }

//     const cleanJson = response.text.replace(/```json|```/g, "").trim();
//     const { score, feedback } = JSON.parse(cleanJson);
//     const update=await InterviewMessage.findByIdAndUpdate(questionId,{
//         answer,
//         feedback,
//         score
//     })

//     if(!update){
//         return res.status(404).json({message:'Question not found'})
//     }

//     const updatesession=await InterviewSession.findByIdAndUpdate(sessionId,{
//         $inc:{questionAnswered:1}
//     })

//     if(!updatesession){
//         return res.status(404).json({message:'Session not found'})
//     }

//     const session=await InterviewSession.findById(sessionId)

//     if(session.questionAnswered===session.totalQuestions){
//         session.completed=true
//         await session.save()

//        totalresult(sessionId,res);// Call the totalresult function to calculate and return the final results
//        // Exit early since the interview is completed
//     }

//     const nextQuestion=await InterviewMessage.findOne({
//         sessionId:sessionId,
//         questionNumber:session.questionAnswered+1
//     })

//     if (!nextQuestion) {
//       return res.status(200).json({
//         success: true,
//         message: "Interview completed",
//       });
//     }


// console.log("Next question fetched from DB:", nextQuestion);

//     res.status(200).json({
//       success: true,
//       score,
//       feedback,
//         nextQuestion: nextQuestion.question,
//         questionId: nextQuestion._id,
//         questionNumber: nextQuestion.questionNumber,
//     });

//   } catch (error) {
//     console.log("AI error in evaluate answer", error);
//     res.status(500).json({ message: "AI failed" });
//   }
// };





