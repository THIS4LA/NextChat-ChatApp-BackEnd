import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const { members, isGroup, name } = req.body;
    const conversation = await Conversation.create({ members, isGroup, name });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user.id,
    }).populate("members", "username email");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
