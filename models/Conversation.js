import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
