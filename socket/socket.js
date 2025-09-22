export default function socketHandler(io) {
  io.on("connection", (socket,cb) => {
    console.log("🔌 User connected:", socket.id);
    cb("Hello from server");

    // Join a conversation room
    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
      cb(`User ${socket.id} joined room ${conversationId}`);
    });

    // Handle message send
    socket.on("sendMessage", (data) => {
      // data: { conversationId, senderId, text }
      io.to(data.conversationId).emit("newMessage", data);
    });

    // Disconnect
    socket.on("disconnect", () => {
      cb("❌ User disconnected:", socket.id);
    });
  });
}
