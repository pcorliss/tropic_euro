import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import { GameState } from "./state/GameState";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(fs.readFileSync("./src/schema.graphql", "utf8"));

// // The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return "Hello pie!";
  },
  dolly: () => {
    return "Hello cake!";
  },
  gameState: () => {
    return JSON.stringify(new GameState(["Alice", "Bob", "Carol"]));
  },
};

const app = express();
app.use("/graphql", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");