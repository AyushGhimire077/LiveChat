import React, { useEffect, useContext, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaArrowDown } from "react-icons/fa";

const ChatBox = () => {
  const { receiverId } = useParams();
  const { fetchMessages, messages, isLoading, sendMessage } =
    useContext(AppContext);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isFirstLoad = useRef(true);

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

  const removeImagePreview = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if (!receiverId || (!message.trim() && !image)) {
      toast.error("Please add a message or image!");
      return;
    }

    try {
      await sendMessage(receiverId, message, image);
      setMessage("");
      removeImagePreview();

      // Only auto-scroll if user is already near the bottom
      if (isUserAtBottom) {
        scrollToBottom(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  const scrollToBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    setIsUserAtBottom(true);
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px tolerance
    setIsUserAtBottom(isNearBottom);
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    if (receiverId) {
      fetchMessages(receiverId);
    }
  }, [receiverId, fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        scrollToBottom(false); // No animation on first load
        isFirstLoad.current = false;
      } else if (isUserAtBottom) {
        scrollToBottom(true); // Smooth scroll if user is at bottom
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-700 to-gray-800">
      <div className="p-4 bg-gray-800 border-b border-gray-600">
        <h3 className="text-xl font-semibold text-gray-100">Chat</h3>
      </div>

      {/* Chat Messages Section */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
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
                  <div className="bg-gray-700 p-2 rounded-lg shadow-md">
                    <img
                      src={msg.image}
                      alt="Message attachment"
                      className="max-w-xs h-auto rounded-md"
                    />
                  </div>
                )}
                {msg.message && <p className="text-sm mt-2">{msg.message}</p>}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className="fixed bottom-20 right-5 bg-blue-600 p-3 rounded-full shadow-lg text-white hover:bg-blue-700 transition"
        >
          <FaArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Message Input Section */}
      <div className="p-4 bg-gray-800 border-t border-gray-600">
        {imagePreview && (
          <div className="relative mb-4 max-w-xs">
            <div className="bg-gray-700 p-2 rounded-lg shadow-md">
              <img src={imagePreview} alt="Preview" className="rounded-md" />
              <button
                onClick={removeImagePreview}
                className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4 text-white" />
              </button>
            </div>
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
            placeholder="Type your message or send image..."
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
