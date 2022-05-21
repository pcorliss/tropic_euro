import DatabaseConstructor, {Database} from "better-sqlite3";

export class Db {
    static conn: Database;

    static init(): void {
        Db.conn = new DatabaseConstructor(":memory:", { verbose: console.log });
    }
}
// const db = new Database(":memory:", { verbose: console.log });

// db.prepare("CREATE TABLE lorem (info text)").run();
// const insert = db.prepare("INSERT into lorem VALUES (?)");
// insert.run("Text A");
// insert.run("Text B");
// insert.run("Text C");

// const select = db.prepare("SELECT * FROM lorem");
// console.log("Single Row", select.get());
// console.log("All Rows", select.all());

// for (const row of select.iterate()) {
//     console.log("Row:", row);
// }