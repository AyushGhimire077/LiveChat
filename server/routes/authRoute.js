import { register, login, logout, checkToken } from "../controllers/authController.js";
import express from 'express' 


const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", checkToken);

export default authRouter