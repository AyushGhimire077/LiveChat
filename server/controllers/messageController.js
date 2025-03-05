import Message from "../models/messageModel.js";
import socketService from "../config/socket.js";
import cloudinary from "../config/cloudinary.js";

export const sendMessage = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
  const { message } = req.body;
  const image = req.file ? req.file.path : null;

    // Validate input
    if (!message) {
        return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (!receiverId) {
        return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }
    if (!senderId) {
        return res.status(400).json({ success: false, message: "Sender ID is required" });
    }

    try {
        // Create the new message object
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message,
        });
           if (image) {
             try {
               const result = await cloudinary.uploader.upload(image, {
                 folder: "chat-app", 
               });
               newMessage.image = result.secure_url; 
             } catch (error) {
               console.error("Error uploading image:", error);
               return res
                 .status(500)
                 .json({ success: false, message: "Failed to upload image" });
             }
           }

           // Save the message in the database
           await newMessage.save();

        socketService.sendMessage(receiverId, { sender: senderId, message,  image: newMessage.image || null });

        // Send a success response
        return res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

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

export const deleteConversation = async (req, res) => {
  const receiverId = req.params.id;

  if (!receiverId) {
    return res
      .status(400)
      .json({ success: false, message: "Receiver ID is required" });
  }

  try {
    await Message.deleteMany({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    });

    return res
      .status(200)
      .json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
