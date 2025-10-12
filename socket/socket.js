export default function socketHandler(io) {
  // 🟢 Global store for all connected users
  const onlineUsers = new Map(); // { userId: socketId }

  io.on("connection", (socket) => {

    // When user connects
    socket.on("userConnected", (userId) => {
      onlineUsers.set(userId, socket.id);

      // Notify everyone
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));

      // Send current list to this new user too
      socket.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Typing events
    socket.on("typing", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userTyping", user);
    });

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
    });

    // When user disconnects
    socket.on("disconnect", () => {
      for (const [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
}
