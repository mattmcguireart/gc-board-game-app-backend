import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Game from "../models/Game";
import appRouter from "../models/Game";

const appRouter = express.Router();

const catchError = (err: any, res: any) => {
  console.error("FAIL", err);
  res.status(500).json({ message: "internal server error" });
};

appRouter.get("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const client = await getClient();
    const results = client.db().collection<Game>("gamelist").find({ uid });
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

appRouter.delete("/:id", async (req, res) => {
  const id: string = req.params.id;
  try {
    const client = await getClient();
    await client
      .db()
      .collection<Game>("gamelist")
      .deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(204);
  } catch (err) {
    catchError(err, res);
  }
});

appRouter.get("/recommend/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const client = await getClient();
    const results = client
      .db()
      .collection<Game>("gamelist")
      .aggregate([
        {
          $group: {
            _id: "$uid",
            avgAge: { $avg: "$min_age" },
            avgMaxPlayer: { $avg: "$max_players" },
            avgMinPlayer: { $avg: "$min_players" },
            avgMaxPlaytime: { $avg: "$max_playtime" },
            avgMinPlaytime: { $avg: "$min_playtime" },
            avgPrice: { $avg: "$price" },
          },
        },
        { $match: { _id: uid } },
      ]);

    res.json(await results.toArray());
  } catch (err) {
    catchError(err, res);
  }
});

export default appRouter;
