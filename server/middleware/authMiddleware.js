import jwt from "jsonwebtoken";
import User from "../models/authModel.js";
import 'dotenv/config';

export const authMiddleware = async (req, res, next) => { 
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);        
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}  
