import { Server } from "./server";

const server = new Server();
server.app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");