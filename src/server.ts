import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import { GameState } from "./state/GameState";
import { Db } from "../src/Db";

export class Server {
  app = express();

  constructor() {
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
    };

    this.app.use("/graphql", graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }));
  }
}
