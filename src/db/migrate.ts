import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';

const sqlite = new Database(path.resolve(process.cwd(), 'db/golearn.db'));
const db = drizzle(sqlite);

async function main() {
    console.log('Migrating database...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration complete.');
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
