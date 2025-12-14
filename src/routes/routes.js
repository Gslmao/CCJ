import express from "express";
import { Login, Signup } from "../controllers/userCntrl.js";

const authRouter = express.Router();

authRouter.post("/signin", Login);
authRouter.post("/signup", Signup);

export default authRouter;