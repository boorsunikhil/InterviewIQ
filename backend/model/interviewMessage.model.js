import mongoose from "mongoose";


export const interviewMessageSchema=new mongoose.Schema({
    sessionId:{
        type:String,
        require:true
    },
    question:{
        type:String,
        require:true
    },
    answer:{
        type:String,
        
    },
    feedback:{
        type:String,
       
    },
    score:{
        type:String,
        
    },
    questionNumber:{
        type:Number,
       
    }
},{timestamps:true})

const InterviewMessage= mongoose.model('interviewMessage',interviewMessageSchema)

export default InterviewMessage