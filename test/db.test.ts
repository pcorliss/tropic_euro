import { Db, Migration } from "../src/Db";

describe("Db", () => {
    afterEach(() => {
        Db.conn.close();
        Db.conn = undefined;
    });

    describe("init", () => {
        it("instantiates a db construction", () => {
            expect(Db.conn).toBeUndefined();
            Db.init();
            expect(Db.conn).not.toBeNull();
        });

        it("doesn't init a new db if one is already connected", () => {
            Db.init();
            const conn = Db.conn;
            Db.init();
            expect(conn).toBe(Db.conn);
        });
    });

    describe("migrate", () => {
        it("runs migrations", () => {
            Db.init();
            const a = { priority: 0, migration: "CREATE TABLE a (info text);" };
            const b = { priority: 1, migration: "CREATE TABLE b (info text);" };

            Db.migrate([a, b]);
            expect(Db.conn.prepare("SELECT COUNT(*) FROM a").pluck().get()).toBe(0);
            expect(Db.conn.prepare("SELECT COUNT(*) FROM b").pluck().get()).toBe(0);
        });

        it("runs migrations in priority order", () => {
            Db.init();
            const a = { priority: 0, migration: "CREATE TABLE a (info text);" };
            const b = { priority: 1, migration: "ALTER TABLE a RENAME info TO cake;" };
            Db.migrate([b, a]);
        });

        it("skips migrations that have been run before", () => {
            Db.init();
            const a = { priority: 0, migration: "CREATE TABLE a (info text);" };
            const b = { priority: 1, migration: "ALTER TABLE a RENAME info TO cake;" };
            Db.migrate([a]);
            Db.migrate([a,b]);
        });
    });

    // describe("insert", () => {

    // });
});
