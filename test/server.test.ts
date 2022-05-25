import RequestPromise from "request-promise";
import { Server } from "../src/server";
import * as http from "http";

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
});