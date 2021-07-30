import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import appRouter from "./routes/appRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", appRouter);
export const api = functions.https.onRequest(app);
