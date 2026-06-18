import { Router } from "express";
import {signup,login,logout,check} from '../controllers/auth.controller.js';
import {checkAuth} from '../middlewares/auth.middleware.js'

const authrouter=Router();


authrouter.post('/signup',signup);
authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.get('/check',checkAuth,check);

export default authrouter;



