import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", sendMessage);
messageRouter.get("/:conversationId", getMessages);

export default messageRouter;
