import db from "./db";

const initDB = async () => {
  try {
    // create user db
    await db.query(`
    DO $$
    BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        CREATE TYPE roles AS ENUM ('employer', 'candidate');
    END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    role roles,
    fullName VARCHAR(128) NOT NULL,
    username VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE,
    password VARCHAR(256) NOT NULL
    );
        `);

    console.log("created successully!");
  } catch (error) {
    console.log(error);
  }
};

export default initDB;
