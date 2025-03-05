import { fetchUsers } from "../controllers/userController.js";
import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/get-users",authMiddleware ,fetchUsers);

export default userRouter