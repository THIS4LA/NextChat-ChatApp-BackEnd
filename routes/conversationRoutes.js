import express from "express";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.post("/", createConversation);
conversationRouter.get("/", getUserConversations);

export default conversationRouter;
