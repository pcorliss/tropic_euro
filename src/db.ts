import DatabaseConstructor, {Database} from "better-sqlite3";

export type Migration = {
    priority: number
    migration: string
}

export class Db {
    static conn: Database;

    static init(): void {
        Db.conn ||= new DatabaseConstructor(":memory:", { verbose: console.log });
    }

    static migrate(migrations: Migration[]): void {
        const migrationsCreate = "CREATE TABLE IF NOT EXISTS migrations (priority INTEGER)";
        Db.conn.prepare(migrationsCreate).run();
        const migrationExists = Db.conn.prepare("SELECT 1 FROM migrations WHERE priority = ?");
        const insertMigration = Db.conn.prepare("INSERT INTO migrations VALUES (?)");
        migrations
            .filter((m) => {
                // undefined vs "1" to filter out existing migrations
                return !migrationExists.get(m.priority);
            })
            .sort((a, b) => a.priority - b.priority)
            .forEach((m) => {
                Db.conn.prepare(m.migration).run();
                insertMigration.run(m.priority);
            });
        return;
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