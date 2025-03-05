import { Server } from "socket.io";

class SocketService {
  constructor() {
    this.io = null; 
    this.activeUsers = {}; 
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Store user when they set their ID
      socket.on("set-userId", (userId) => {
        this.activeUsers[userId] = socket.id;
        console.log(`User ${userId} is online`);
      });

      // Remove user when they disconnect
      socket.on("disconnect", () => {
        const userId = Object.keys(this.activeUsers).find(
          (key) => this.activeUsers[key] === socket.id
        );
        if (userId) {
          delete this.activeUsers[userId];
          console.log(`User ${userId} went offline`);
        }
      });
    });
  }

  sendMessage(receiverId, messageData) {
    const recipientSocketId = this.activeUsers[receiverId];
    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit("receive-message", messageData);
      console.log(`Message sent to ${receiverId}`);
    } else {
      console.log(`User ${receiverId} is offline, storing message in DB.`);
    }
  }
}

export default new SocketService();
