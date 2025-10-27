import { changePassword, forgotPassword, userLogin, verifyToken } from "@/controllers/login.controller";
import express from "express";

const loginRouter = express.Router();

loginRouter.post("/auth/login", userLogin )
loginRouter.put("/auth/forgot-password", forgotPassword)
loginRouter.get("/auth/verify-token", verifyToken)
loginRouter.put("/auth/change-password", changePassword)



export default loginRouter;