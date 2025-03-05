import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true } 
);

// Create Indexes for faster queries
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
