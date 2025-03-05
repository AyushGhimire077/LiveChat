import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { receiverId } = useParams(); // Get receiverId from URL using useParams
  const { fetchMessages, messages, isLoading, sendMessage } =
    useContext(AppContext);

  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!receiverId || !message.trim()) {
      toast.error("Receiver ID and message are required!");
      return;
    }

    try {
      await sendMessage(receiverId, message);
      setMessage(""); // Clear input field after sending
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while sending the message."
      );
    }
  };

  // Fetch messages when component mounts or receiverId changes
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
          <div className="text-center text-gray-400">Loading messages...</div>
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
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString()}
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
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message} // Set the input value correctly to 'message'
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
