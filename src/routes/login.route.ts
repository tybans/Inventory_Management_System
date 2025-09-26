import { userLogin } from "@/controllers/login.controller";
import express from "express";

const loginRouter = express.Router();

loginRouter.post("/auth/login", userLogin )



export default loginRouter;