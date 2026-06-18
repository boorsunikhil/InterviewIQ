import { Router } from "express"
import { generateQuestion ,evaluateAnswer} from "../controllers/ai.controller.js"
import { checkAuth } from "../middlewares/auth.middleware.js"
import { allChats, chatHistory, totalresult,trial ,stats} from "../controllers/interview.controller.js"
const interviewRouter=Router()

interviewRouter.post('/generatequestion',checkAuth,generateQuestion)
interviewRouter.post('/evaluate',checkAuth,evaluateAnswer)
interviewRouter.get('/result',checkAuth,totalresult)
interviewRouter.get('/allchats',checkAuth,allChats)
interviewRouter.get('/chat-history',checkAuth,chatHistory)
interviewRouter.get('/trial',trial)
interviewRouter.get('/stats',checkAuth,stats)
export default interviewRouter