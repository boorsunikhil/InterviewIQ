import { generateToken } from "../lib/generateToken.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!req.body) {
      return res.status(400).json({ message: "Body is missing" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "all Fields are required" });
    }
    const userexist = await User.findOne({ email });
    if (userexist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedpassword,
    });
    await user.save();
    res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log("error in signup controller ", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!req.body) {
      return res.status(400).json({ message: "Body is missing" });
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "please enter a valid credentials" });
    }
    const validuser = await User.findOne({ email });
    if (!validuser) {
      return res
        .status(400)
        .json({ message: "please enter a valid credentials" });
    }
    const validpassword = await bcrypt.compare(password, validuser.password);
    if (!validpassword) {
      return res
        .status(400)
        .json({ message: "please enter a valid email or password" });
    }
    generateToken(validuser._id, res);
    validuser.password = undefined;
    res.status(200).json(validuser);
  } catch (error) {
    console.log("error in login controller ", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfull" });
  } catch (error) {
    console.log("error in logout controller ", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check controller ", error);
    res.status(500).json({ message: "internal server error" });
  }
};
