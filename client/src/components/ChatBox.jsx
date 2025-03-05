import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FaImage, FaTimes } from "react-icons/fa";

const ChatBox = () => {
  const { receiverId } = useParams();
  const { fetchMessages, messages, isLoading, sendMessage } =
    useContext(AppContext);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clear image preview
  const removeImagePreview = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if (!receiverId || (!message.trim())) {
      toast.error("Message is required!");
      return;
    }

    try {
      await sendMessage(receiverId, message, image);
      setMessage("");
      removeImagePreview();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  useEffect(() => {
    if (receiverId) {
      fetchMessages(receiverId);
    }
  }, [receiverId, fetchMessages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-700 to-gray-800">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-600">
        <h3 className="text-xl font-semibold text-gray-100">Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === receiverId ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === receiverId
                    ? "bg-gray-600 text-gray-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Message attachment"
                    className="mt-2 max-w-xs rounded-lg border border-gray-500"
                  />
                )}
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-600">
        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mb-4 max-w-xs">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg border border-gray-600"
            />
            <button
              onClick={removeImagePreview}
              className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <label className="flex items-center px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <FaImage className="w-5 h-5 text-gray-300" />
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </label>

          <input
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() && !image}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
