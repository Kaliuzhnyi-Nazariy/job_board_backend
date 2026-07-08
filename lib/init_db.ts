import db from "./db";

const initDB = async () => {
  try {
    // create user db
    await db.query(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
            CREATE TYPE roles AS ENUM ('employer', 'candidate');
        END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'worktimes') THEN
        CREATE TYPE workTimes AS ENUM ('full_time', 'part_time', 'internship', 'contract');
    END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statuses') THEN
            CREATE TYPE statuses AS ENUM ('applied', 'rejected', 'accepted');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'genders') THEN
            CREATE TYPE genders AS ENUM ('Mr', 'Ms', 'Mx');
        END IF;
    END$$ LANGUAGE plpgsql;

            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY NOT NULL,
            role roles,
            full_name VARCHAR(128) NOT NULL,
            username VARCHAR(128) NOT NULL,
            email VARCHAR(128) UNIQUE,
            password VARCHAR(256) NOT NULL,
            photo VARCHAR (256) DEFAULT NULL,
            stripe_client_id TEXT DEFAULT NULL
            );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY,
    user_id INT REFERENCES users(id) UNIQUE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        title VARCHAR(128) NOT NULL,
        location VARCHAR(256) NOT NULL,
        position VARCHAR(128) NOT NULL,
        salary VARCHAR(128) NOT NULL,

        education VARCHAR(128),
        experience VARCHAR(128),

        description VARCHAR(256)
            CHECK (char_length(trim(description)) BETWEEN 20 AND 1048),

        responsibilities TEXT CHECK (char_length(trim(responsibilities)) BETWEEN 20 AND 1048),

        work_time workTimes,
        owner_id INT REFERENCES users(id) ON DELETE CASCADE,

        created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS candidate_profiles (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
        biography VARCHAR(1024) DEFAULT '',

        speciality VARCHAR(128),
        date_of_birth DATE, 
        gender genders,
        experience VARCHAR(64),
        education VARCHAR(128),

        website VARCHAR(256),
        location VARCHAR(256),
        phone VARCHAR(32),
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    filename VARCHAR(128),
    file_size INT,
    created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES users(id) NOT NULL,
    job_id UUID REFERENCES jobs(id)  ON DELETE CASCADE NOT NULL,
    covering_letter VARCHAR(512),
    status statuses default 'applied',
    cv_id UUID REFERENCES cvs(id) NOT NULL,
    applied_at TIMESTAMP DEFAULT now(),

    CONSTRAINT unique_user_job_application UNIQUE (user_id, job_id)

    );

    CREATE TABLE IF NOT EXISTS subscriptionsPlan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(64) NOT NULL,
    price INTEGER NOT NULL,
    stripe_product_id TEXT NOT NULL,
    stripe_price_id TEXT NOT NULL,
    limits INT
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscriptionsPlan(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    subscription_id TEXT NOT NULL
    );
    

    `,
    );
  } catch (error) {
    console.log(error);
  }
};

export default initDB;
