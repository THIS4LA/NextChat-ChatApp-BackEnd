import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
