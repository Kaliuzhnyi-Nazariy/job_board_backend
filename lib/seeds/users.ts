import db from "../db";
import bcrypt from "bcryptjs";

export const usersSeed = async () => {
  const hashedPassword = await bcrypt.hash("Password1", 10);

  await db.query(
    `
    INSERT INTO users (role, full_name, username, email, password)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email) DO NOTHING;
    `,
    ["employer", "employer", "employer", "employer@email.com", hashedPassword],
  );

  await db.query(
    `
    INSERT INTO users (role, full_name, username, email, password)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email) DO NOTHING;
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
