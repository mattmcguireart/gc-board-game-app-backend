import express from "express";
import { getClient } from "../db";
import Game from "../models/Game";
import appRouter from "../models/Game";

const appRouter = express.Router();

const catchError = (err: any, res: any) => {
  console.error("FAIL", err);
  res.status(500).json({ message: "internal server error" });
};

appRouter.get("/", async (req, res) => {
  const client = await getClient();
  const results = await client
    .db()
    .collection<appRouter>("appRouters")
    .find()
    .toArray();
  res.json(results);
});

appRouter.post("/", async (req, res) => {
  const newSavedGame: Game = req.body;
  try {
    const client = await getClient();
    await client.db().collection<Game>("gamelist").insertOne(req.body);
    res.status(201).json(newSavedGame);
  } catch (err) {
    catchError(err, res);
  }
});
export default appRouter;
