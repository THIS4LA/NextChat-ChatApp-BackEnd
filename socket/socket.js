export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join a conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Store online users
    socket.on("userConnected", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys())); // broadcast
      console.log(`User ${userId} is online`);
    });

    // when user disconnects
    socket.on("disconnect", () => {
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
          console.log(`User ${userId} went offline`);
          break;
        }
      }
    });

    //Typing event
    socket.on("typing", ({ conversationId, user }) => {
      // Broadcast to others in the same room
      socket.to(conversationId).emit("userTyping", user);
    });

    //Stop typing event
    socket.on("stopTyping", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userStoppedTyping", user);
    });

    // Handle sending a message
    socket.on("sendMessage", (messageData) => {
      const receivedMessageData = {
        _id: Date.now(),
        text: messageData.text,
        createdAt: messageData.createdAt,
        sender: "other",
        otherUser: {
          username: messageData.sender.userName,
          avatar: messageData.sender.avatar,
        },
      };
      socket
        .to(messageData.conversationId)
        .emit("newMessage", receivedMessageData);
      console.log(
        `New message in conversation ${messageData.conversationId} from ${messageData.sender.userName}`
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
