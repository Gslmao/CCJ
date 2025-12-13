// app.js
import path from 'path';
import dotenv from "dotenv";
dotenv.config({ path: path.resolve('.env') }); // now path is defined

import express from "express";
import cors from "cors";

import authRouter from "./routes/routes.js";
import caseRouter from "./routes/fileRoutes.js";

const app = express();

// NOTE: JSON/urlencoded must be registered BEFORE your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRouter);
app.use('/cases', caseRouter);

export default app;
