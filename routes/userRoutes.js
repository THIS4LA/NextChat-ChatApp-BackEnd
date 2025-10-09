import express from "express";
import { getAvailableUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/search", getAvailableUsers);

export default userRouter;