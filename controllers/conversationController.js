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
    })
      .populate("members", "userName avatar email")
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((item) => {
      const otherUser = item.members.find(
        (m) => m._id.toString() !== req.user.id
      );

      return {
        _id: item._id,
        otherUserId: otherUser ? otherUser._id : item._id,
        isGroup: item.isGroup,
        name: item.isGroup ? item.name : otherUser?.userName,
        avatar: item.isGroup ? null : otherUser?.avatar,
        lastMessage: item.lastMessage,
      };
    });

    res.json(formattedConversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
