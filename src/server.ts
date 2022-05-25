import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import { GameState } from "./state/GameState";

export class Server {
  app = express();

  constructor() {
    // Construct a schema, using GraphQL schema language
    const schema = buildSchema(fs.readFileSync("./src/schema.graphql", "utf8"));

    // // The root provides a resolver function for each API endpoint
    const root = {
      hello: () => {
        return "Hello pie!";
      },
      gameState: () => {
        return JSON.stringify(new GameState(["Alice", "Bob", "Carol"]));
      },
    };

    this.app.use("/graphql", graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }));
  }
}
