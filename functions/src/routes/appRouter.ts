import express from "express";
import { getClient } from "../db";
import Game from "../models/Game";
import appRouter from "../models/Game";

const appRouter = express.Router();

const catchError = (err: any, res: any) => {
  console.error("FAIL", err);
  res.status(500).json({ message: "internal server error" });
};

appRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const results = client.db().collection<Game>("gamelist").find({ uid: id });
    res.json(await results.toArray());
  } catch (err) {
    catchError(err, res);
  }
});

appRouter.post("/", async (req, res) => {
  const newSavedGame: Game = req.body;
  try {
    const client = await getClient();
    await client.db().collection<Game>("gamelist").insertOne(newSavedGame);
    res.status(201).json(newSavedGame);
  } catch (err) {
    catchError(err, res);
  }
});

export default appRouter;
