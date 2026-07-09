import db from "../db";
import bcrypt from "bcryptjs";

export const usersSeed = async () => {
  const hashedPassword = await bcrypt.hash("Password1", 10);

  await db.query(
    `
    BEGIN
      IF NOT EXISTS (SELECT * FROM users 
                   WHERE email = $4)
        BEGIN
       INSERT INSERT INTO users (role, full_name, username, email, password) VALUES ($1, $2, $3, $4, $5)
       END
    END

    `,
    ["employer", "employer", "employer", "employer@email.com", hashedPassword],
  );

  await db.query(
    `
    BEGIN
      IF NOT EXISTS (SELECT * FROM users 
                   WHERE email = $4)
        BEGIN
       INSERT INSERT INTO users (role, full_name, username, email, password) VALUES ($1, $2, $3, $4, $5)
       END
    END
    `,
    [
      "candidate",
      "candidate",
      "candidate",
      "candidate@email.com",
      hashedPassword,
    ],
  );

  console.log("users seed finished!");
};
