import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import cors from "cors";

import { GameState } from "./state/GameState";
import { Db } from "./db";


export class Server {
  app = express();


  constructor() {
    this.app.use(express.static("public"));

    this.app.use(cors({
      origin: "http://localho.st:3000"
    }));

    Db.init();

    // Construct a schema, using GraphQL schema language
    const schema = buildSchema(fs.readFileSync("./src/schema.graphql", "utf8"));

    // The root provides a resolver function for each API endpoint
    const root = {
      hello: () => {
        return "Hello pie!";
      },
      gameState: ({id}: {id: string}) => {
        const gs = GameState.find(id);
        return gs;
      },
      createGame: ({players}: {players: [string]}) => {
        const gs = new GameState(players);
        gs.save();
        return gs;
      },
      applyAction: ({gs, player, key}: {gs: string, player: string, key: string}) => {
        const gameState = GameState.find(gs);
        const p = gameState.players.find((p) => p.name == player);
        gameState.applyAction(p, key);
        return gameState;
      },
    };

    this.app.use("/graphql", graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }));
  }
}
