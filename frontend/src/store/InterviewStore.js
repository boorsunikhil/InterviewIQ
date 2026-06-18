import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";


// const useInterviewStore = create((set) => ({
//   userstats: {
//     totalSessions: 0,
//     completed: 0,
//     pending: 0,
//     totalScore: 0,
//     maxScore: 0,
//     question:'',
//     chatHistory:[],
//     allcharts:[],
//     sessionId:''

//   },
//   setuserStats:async () =>{
//     try{
//         const res=await api.get("/interview/stats");
//         set({userstats:res.data});

//     }
//     catch(error){
//       console.log("error in setStats in interviewstore ", error);
//     }
// },
// generatequestions: async (data) => {
//   try {
//     console.log("Data received in generatequestions:", data);

//     const res = await api.post("/interview/generatequestion", data);

//     set({
//       question: res.data.question,
//       sessionId: res.data.sessionId,
//     });
//     // getChatHistory(res.data.sessionId); // Fetch chat history for the new session
//     return res.data;
//   } catch (error) {
//     console.log("error in generatequestions in interviewstore ", error);
//     toast.error("Failed to generate questions. Please try again.");
//   }
// },
// evaluateAnswer:async(data)=>{
//   try{
//     const res=await api.post("/interview/evaluate",data);
//     return res.data;
//   }catch(error){
//     console.log("error in evaluateAnswer in interviewstore ", error);
//     toast.error("Failed to evaluate answer. Please try again.")
//   }
// },
// getChatHistory:async(sessionid)=>{
//   try{
//     const res=await api.get(`/interview/chat-history?query=${sessionid}`);
//     set({chatHistory:res.data.messages});
//     return res.data;
//   }
//   catch(error){
//     console.log("error in getChatHistory in interviewstore ", error);
//     toast.error("Failed to fetch chat history. Please try again.")
//   }
// },
// getAllChats:async()=>{
//   try{
//     const res=await api.get("/interview/allchats");
//     set({allcharts:res.data.sessions});
//     return res.data;
//   }
//   catch(error){
//     console.log("error in getAllChats in interviewstore ", error);
//     toast.error("Failed to fetch all chats. Please try again.")
//   } 
// }

// }));




const useInterviewStore = create((set) => ({
  totalSessions: 0,
  completed: 0,
  pending: 0,
  totalScore: 0,
  maxScore: 0,
  userstats:{},
  question: "",
  chatHistory: [],
  allChats: [],
  sessionId: "",
  isStatsLoading: false,
  
  setuserStats: async () => {
    set({ isStatsLoading: true });
    try {
      const res = await api.get("/interview/stats");
      set({ userstats: res.data });
    } catch (error) {
      console.log("error in setStats", error);
    }finally {
      set({ isStatsLoading: false });
    }
  },

  generatequestions: async (data) => {
    try {
      const res = await api.post("/interview/generatequestion", data);

      set({
        question: res.data.question,
        sessionId: res.data.sessionId,
      });

      return res.data;
    } catch (error) {
      console.log("error in generatequestions", error);
      toast.error("Failed to generate questions.");
    }
  },

  evaluateAnswer: async (data) => {
    try {
      const res = await api.post("/interview/evaluate", data);
      set
      return res.data;
    } catch (error) {
      console.log("error in evaluateAnswer", error);
      toast.error("Failed to evaluate answer.");
    }
  },

  getChatHistory: async (sessionId) => {
    try {
      const res = await api.get(
        `/interview/chat-history?sessionid=${sessionId}`
      );
      set({ chatHistory: res.data });
    } catch (error) {
      console.log("error in getChatHistory", error);
      toast.error("Failed to fetch chat history.");
    }
  },

  getAllChats: async () => {
    try {
      const res = await api.get("/interview/allchats");
      set({ allChats: res.data.sessions });
    } catch (error) {
      console.log("error in getAllChats", error);
      toast.error("Failed to fetch all chats.");
    }
  },
}));
export default useInterviewStore;