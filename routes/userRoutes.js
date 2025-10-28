import express from "express";
import { getAvailableUsers,updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/search", getAvailableUsers);
userRouter.put("/:id", updateUser);

export default userRouter;