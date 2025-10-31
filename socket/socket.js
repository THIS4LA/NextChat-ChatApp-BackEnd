export default function socketHandler(io) {
  // Global store for all connected users
  const onlineUsers = new Map(); // { userId: socketId }

  io.on("connection", (socket) => {
    // --- USER CONNECTED ---
    socket.on("userConnected", (userId) => {
      if (onlineUsers.has(userId)) return;

      onlineUsers.set(userId, socket.id);

      const allOnline = Array.from(onlineUsers.keys());
      io.emit("updateOnlineUsers", allOnline);
      socket.emit("updateOnlineUsers", allOnline);
    });

        // --- USER LOGOUT ---
    socket.on("userLogout", (userId) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.delete(userId);
        io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
      }
      // optionally force disconnect this socket
      socket.disconnect(true);
    });

    // --- JOIN CONVERSATION ---
    socket.on("joinConversation", (conversationId) => {
      if (socket.rooms.has(conversationId)) return;
      socket.join(conversationId);
    });

    // --- TYPING EVENTS ---
    socket.on("typing", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userTyping", user);
    });

    socket.on("stopTyping", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userStoppedTyping", user);
    });

    // --- SEND MESSAGE ---
    socket.on("sendMessage", (messageData) => {
      const receivedMessageData = {
        _id: Date.now(),
        text: messageData.text,
        createdAt: messageData.createdAt,
        sender: "other",
        senderId: messageData.sender._id,
        conversationId: messageData.conversationId,
        otherUser: {
          username: messageData.sender.userName,
          avatar: messageData.sender.avatar,
        },
      };

      socket
        .to(messageData.conversationId)
        .emit("newMessage", receivedMessageData);
    });

    // --- DISCONNECT ---
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
