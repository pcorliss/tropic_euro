import DatabaseConstructor, {Database} from "better-sqlite3";

export type Migration = {
    priority: number
    migration: string
}

export class Db {
    static conn: Database;

    static init(options?: any): void {
        options ||= {};
        if (!options["verbose"] && process.env.DB_VERBOSE) {
            options["verbose"] = console.log;
        }
        const dbFile = process.env.DB || ":memory:";
        Db.conn ||= new DatabaseConstructor(dbFile, options);
    }

    static migrate(migrations: Migration[]): void {
        this.init();
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

    static close(): void {
        if (this && this.conn) {
            this.conn.close();
            this.conn = undefined;
        }
        return;
    }
}