import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      text,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).populate("sender", "username");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
