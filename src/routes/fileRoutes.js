import express from "express";
import multer from "multer";
import { SubmitCase, NewCase, FetchAllCases, RemoveCase, FetchCase, ApproveCase, RejectCase } from "../controllers/fileCntrl.js";
import { authVerify } from '../middleware/auth.js'
import roleCheck from '../middleware/rolecheck.js';

const caseRouter = express.Router();
const upload = multer({ dest: 'temp/' });

caseRouter.post("/submit", authVerify, roleCheck('defendant', 'plaintiff'), upload.single('file'), SubmitCase);
caseRouter.post("/new", authVerify, roleCheck('defendant', 'plaintiff'), upload.none(), NewCase);
caseRouter.get("/getcase/:id", authVerify, FetchCase);
caseRouter.get("/all", authVerify, FetchAllCases);
caseRouter.patch("/delete/:id", authVerify, roleCheck('judge'), RemoveCase);
caseRouter.patch('/:caseId/approve', roleCheck('judge'), authVerify, ApproveCase);
caseRouter.patch('/:caseId/reject', roleCheck('judge'), authVerify, RejectCase);

export default caseRouter;
