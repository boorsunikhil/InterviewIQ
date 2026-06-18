import mongoose from "mongoose";


export const interviewSessionSchema=new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    topic:{
        type:String,
        require:true
    },
   
    totalQuestions:{
        type:Number,
        require:true
    },
    completed:{
        type:Boolean,
        require:true,
        default:false
    },
    questionAnswered:{
        type:Number,
        
    },
    questionAsked:{
        type:Number,
        
    },
    type:{
        type:String,
        require:true
    },
},{timestamps:true})

const InterviewSession=  mongoose.model('interviewSession',interviewSessionSchema)

export default InterviewSession