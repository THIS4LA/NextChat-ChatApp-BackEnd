import express from "express";
import { getAvailableUsers,updateUser,getUserById } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/search", getAvailableUsers);
userRouter.put("/:id", updateUser);
userRouter.get("/:id", getUserById);
export default userRouter;