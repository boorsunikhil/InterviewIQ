import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authrouter from './routes/auth.route.js';
import interviewRouter from './routes/interview.route.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const app=express();

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // VERY IMPORTANT
  }));
app.use(express.json());
app.use(cookieParser());


app.use('/api',authrouter);
app.use('/api/interview',interviewRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}




connectDB();
app.listen(process.env.PORT,()=>{
    console.log('Server is running on port ' ,process.env.PORT)
})
