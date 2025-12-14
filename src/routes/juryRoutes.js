import express from "express";
import { CastVote, GetResults } from "../controllers/juryCntrl.js";
import { authVerify } from '../middleware/auth.js';
import roleCheck from '../middleware/rolecheck.js';
const juryRouter = express.Router();

juryRouter.post("/vote/:caseId/:party", authVerify, roleCheck('juror'), CastVote); // party can be 'guilty' or 'not_guilty'
juryRouter.post("/results/:caseId", authVerify, roleCheck('juror', 'judge'), GetResults);   

export default juryRouter;