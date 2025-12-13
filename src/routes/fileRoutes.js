import express from "express";2
import multer from "multer";
import { SubmitCase, NewCase, FetchAllCases, RemoveCase, FetchCase } from "../controllers/fileCntrl.js";
import { authVerify } from '../middleware/auth.js'

const caseRouter = express.Router();
const upload = multer({ dest: 'temp/' });

caseRouter.post("/submit", authVerify, upload.single('file'), SubmitCase);
caseRouter.post("/new", authVerify, upload.none(), NewCase);
caseRouter.get("/getcase/:id", authVerify, FetchCase);
caseRouter.get("/all", FetchAllCases);

caseRouter.patch("/delete/:id", authVerify, RemoveCase);
// caseRouter.patch("/edit/:id", );

export default caseRouter;
