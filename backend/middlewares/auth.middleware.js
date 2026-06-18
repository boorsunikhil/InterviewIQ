import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import User from '../model/user.model.js'

config()
export  const checkAuth=async(req,res,next)=>{
    try {
        const token=req.cookies?.token
    
        if(!token){
            return res.status(401).json({message:'unauthorized user '})
        }
        const tokenverify=jwt.verify(token,process.env.JWT_SECRET)
    
        if(!tokenverify){
             return res.status(401).json({message:'unauthorized user '})
        }
        const user = await User.findById(tokenverify.userid).select('-password')
        req.user=user
        next()
        
    } catch (error) {
        console.log('error in checkAuth in middleware ',error)
        res.status(500).json({message:'Internal server error'})
        
    }
}