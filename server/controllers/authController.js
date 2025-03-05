import bcrypt from "bcrypt";
import "dotenv/config"; 
import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  //check all fields are provide
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, message: "All fields are required" });}
  try {
    //check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const handPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      username,
      email,
      password: handPassword,
    });

    await newUser.save();

    //generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  //check all fields are provide
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    //check existing user
    const existing = await User.findOne({ email });
    if (!existing) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    } 

    //check password  
    const isPasswordCorrect = await bcrypt.compare(password, existing.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    } 

    //generate token  
    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, { 
      expiresIn: "7d",
    }); 

    res.cookie("token", token, {  
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });   

    return res.status(200).json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

};

export const logout = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "User logged out successfully" });
}

export const checkToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });    
  }
}

