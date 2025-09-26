import express from "express";
import { createUser, deleteUserById, getAttendants, getUserById, getUsers, updateUserById, updateUserPasswordById } from "@/controllers/user.controller"; 


const usersRouter = express.Router();
usersRouter.post("/users", createUser)
usersRouter.get("/users", getUsers)
usersRouter.get("/attendants", getAttendants)
usersRouter.get("/users/:id", getUserById)
usersRouter.put("/users/:id", updateUserById)
usersRouter.put("/users/update-password/:id", updateUserPasswordById)
usersRouter.delete("/users/:id", deleteUserById)

export default usersRouter;