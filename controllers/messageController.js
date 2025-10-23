import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;
    let conversationId = null;

    const findConversation = await Conversation.findOne({
      isGroup: false,
      members: { $all: [senderId, receiverId] },
    });
    conversationId = findConversation ? findConversation._id : null;

    if (!findConversation) {
      const newConversation = await Conversation.create({
        isGroup: false,
        members: [senderId, receiverId],
      });
      conversationId = newConversation._id;
    }

    const message = await Message.create({
      conversationId: conversationId,
      sender: senderId,
      text: text,
    });
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text: text,
      },
      updatedAt: Date.now(),
    });
    res.status(201).json(message, conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const receiverId = req.params.id;
  const senderId = req.user.id;

  try {
    // Try to find existing 1-to-1 conversation
    let conversation = await Conversation.findOne({
      isGroup: false,
      members: { $all: [senderId, receiverId] },
    }).populate("members", "userName avatar");

    // If no conversation exists → create a new one and return basic info
    if (!conversation) {
      const newConversation = await Conversation.create({
        isGroup: false,
        members: [senderId, receiverId],
      });

      const receiver = await User.findById(receiverId).select(
        "userName avatar"
      );

      return res.json({
        conversation: {
          _id: newConversation._id,
          isGroup: false,
          chatName: receiver.userName,
          otherUser: {
            username: receiver.userName,
            avatar: receiver.avatar,
          },
        },
        messages: [],
      });
    }

    // Determine other user & chat name
    const otherUser = conversation.members.find(
      (member) => member._id.toString() !== senderId
    );
    const chatName = conversation.isGroup
      ? conversation.name
      : otherUser?.userName;

    // Fetch messages
    const messages = await Message.find({
      conversationId: conversation._id,
    }).populate("sender", "userName avatar");

    // Format messages
    const formattedMessages = messages.map((msg) => {
      const isMe = msg.sender._id.toString() === senderId;
      return {
        _id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        sender: isMe ? "me" : "other",
        otherUser: !isMe
          ? { username: otherUser?.userName, avatar: otherUser?.avatar }
          : { username: msg.sender.userName, avatar: msg.sender.avatar },
        seenBy: msg.seenBy,
      };
    });

    // Send final response
    res.json({
      conversation: {
        _id: conversation._id,
        isGroup: conversation.isGroup,
        chatName,
        otherUser: {
          username: otherUser?.userName,
          avatar: otherUser?.avatar,
        },
      },
      messages: formattedMessages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
