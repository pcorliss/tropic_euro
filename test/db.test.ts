import { Db } from "../src/Db";

describe("Db", () => {
    describe("init", () => {
        it("instantiates a db construction", () => {
            expect(Db.conn).toBeUndefined();
            Db.init();
            expect(Db.conn).not.toBeNull();
        });
    });
});
