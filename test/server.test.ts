import { Server } from "../src/server";
import { GameState } from "../src/state/GameState";

import RequestPromise from "request-promise";
import * as http from "http";
import { Db } from "../src/Db";

const API = "http://localhost:4999/graphql";

describe("server", () => {
    let s: Server = null;
    let l: http.Server = null;

    beforeAll(async () => {
        s = new Server();
        l = s.app.listen(4999);
    });

    afterAll(async () => {
        l.close();
        Db.conn.close();
    });

    it("Hello Pie!", async () => {
        const query = `
            query {
                hello
            }
        `;

        const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
        expect(response.data.hello).toBe("Hello pie!");
        expect(response).toMatchSnapshot();
    });

    describe("Get GameState", () => {
        it("looks up a gamestate by id", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            Db.init();
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "${gs.id}")
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(JSON.parse(response.data.gameState).id).toBe(gs.id);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });
    });
});