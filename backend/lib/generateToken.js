import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
export const generateToken=(userid,res)=>{
    const token= jwt.sign({userid:userid},process.env.JWT_SECRET,{
        expiresIn:"1h"
    });
   return res.cookie('token',token,{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=='development',
        maxAge: 60*60*1000

    })
}