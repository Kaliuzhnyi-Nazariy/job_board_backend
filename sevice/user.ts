import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import { IUser } from "./interfaces";
import bcrypt from "bcryptjs";

/*
  check whether user exists
  return all data except for password
*/

const getMe = async (userId: string): Promise<IUser> => {
  const user = await db.query<IUser>(
    "SELECT role, username, full_name, email FROM users WHERE id=$1;",
    [userId],
  );

  if (!user.rows[0]) {
    throw errorHandler(404, "User not found");
  }

  return { ...user.rows[0], id: userId };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  id: string,
) => {
  const userPassword = await db.query(
    "SELECT password FROM users WHERE id = $1",
    [id],
  );

  if (!userPassword.rows[0]) {
    throw errorHandler(404, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    userPassword.rows[0].password,
  );

  if (!isPasswordMatch) {
    throw errorHandler(400, "Invalid credentials");
  }

  if (oldPassword == newPassword) {
    throw errorHandler(400, "Invalid credentials");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await db.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedNewPassword,
    id,
  ]);
};

const deleteAccount = async (id: string) => {
  await db.query("DELETE FROM users WHERE id=$1", [id]);
};

export default { getMe, changePassword, deleteAccount };
