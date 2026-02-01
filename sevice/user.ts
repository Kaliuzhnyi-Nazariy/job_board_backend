import db from "../lib/db";
import { GetMe, IUser } from "./interfaces";
import bcrypt from "bcryptjs";

/*
  check whether user exists
  return all data except for password
*/

const getMe = async (userId: string): Promise<GetMe> => {
  const user = await db.query<IUser>(
    "SELECT role, username, full_name, email FROM users WHERE id=$1;",
    [userId],
  );

  if (user.rows.length === 0) {
    return { ok: false, code: 404, message: "User not found!" };
  }

  return { ok: true, user: { ...user.rows[0], id: userId } };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  id: string,
) => {
  try {
    if (newPassword !== confirmPassword) {
      throw Error("Passwords not match");
    }

    const userPassword = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [id],
    );

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userPassword.rows[0].password,
    );

    if (!isPasswordMatch) {
      throw Error("Old message is not match!");
    }

    if (oldPassword == confirmPassword) {
      throw Error("New password cannot be the same as old one!");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      id,
    ]);
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (id: string) => {
  try {
    await db.query("DELETE FROM users WHERE id=$1", [id]);
  } catch (error) {
    throw error;
  }
};

export default { getMe, changePassword, deleteAccount };
