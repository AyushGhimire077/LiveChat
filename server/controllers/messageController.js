import Message from "../models/messageModel.js";
import socketService from "../config/socket.js";

export const sendMessage = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (!receiverId ) {
        return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }
    if (!senderId) {
        return res.status(400).json({success: false, message:"SenderId is required"})
    }
    try {
        const newMessage = await new Message({
            sender: senderId,
            receiver: receiverId,
            message,
        })
        
        socketService.sendMessage(receiverId, { sender: senderId, message });
        await newMessage.save();
        return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to send message" });
    }
}

export const fetchMessages = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if(!senderId || !receiverId){
        return res.json({ success: false, message: 'Somewent worng' })
    }

    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).sort({ createdAt: 1 });

      return res.json({ success: true, messages });
    } catch (error) {
        return res.json({success: false, message:"Internal server error"})
    }
    
}