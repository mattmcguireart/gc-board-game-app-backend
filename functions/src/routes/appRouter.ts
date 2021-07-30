import express from "express";
import { getClient } from "../db";
import appRouter from "../models/Game";

const appRouter = express.Router();

appRouter.get("/", async (req, res) => {
  const client = await getClient();
  const results = await client
    .db()
    .collection<appRouter>("appRouters")
    .find()
    .toArray();
  res.json(results);
});

export default appRouter;
