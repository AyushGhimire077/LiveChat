// src/socket.js
import { io } from "socket.io-client";

// Set up the socket connection to your server
export const socketClient = io("http://localhost:4000", {
  autoConnect: false, // Don't auto connect initially
  transports: ["websocket"], // Specify transport method (you can omit this if you're happy with default settings)
});

export const connectSocket = () => {
  socketClient.connect();
};

export const disconnectSocket = () => {
  socketClient.disconnect();
};

export const sendMessage = (messageData) => {
  socketClient.emit("sendMessage", messageData); // Send a message to the server
};

export const listenForMessages = (callback) => {
  socketClient.on("receive-message", callback); // Listen for incoming messages
};
