import { deleteConversation, fetchMessages, sendMessage } from "../controllers/messageController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const messageRouter = express.Router();

messageRouter.post("/send/:id",authMiddleware, upload.single("image"), sendMessage);
messageRouter.get("/fetch-messages/:id",authMiddleware, fetchMessages);
messageRouter.delete("/delete-conversation/:id", authMiddleware, deleteConversation);

export default messageRouter;