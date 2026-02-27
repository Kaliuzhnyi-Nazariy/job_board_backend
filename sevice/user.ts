import multer, { Multer } from "multer";
import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import { IUser } from "./interfaces";
import bcrypt from "bcryptjs";
import { deleteCloudPhoto, uploadPhoto } from "../lib/cloudinary/service";
import fs from "fs/promises";

/*
  check whether user exists
  return all data except for password
*/

const getMe = async (userId: string): Promise<IUser> => {
  const user = await db.query<IUser>(
    "SELECT role, username, full_name, email, photo FROM users WHERE id=$1;",
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

const uploadUserPhoto = async (file: Express.Multer.File, userId: string) => {
  const res = await uploadPhoto(file, userId);

  try {
    await db.query("UPDATE users SET photo=$1 WHERE id=$2", [
      res.secure_url,
      userId,
    ]);
  } catch (error) {
    await deleteCloudPhoto(userId);
    throw error;
  } finally {
    await fs.unlink(file?.path);
  }
};

const deletePhoto = async (userId: string) => {
  const userPhoto = await db.query("SELECT photo FROM users WHERE id=$1", [
    userId,
  ]);

  const isPhoto = userPhoto.rows[0]?.photo;

  if (!isPhoto) throw errorHandler(400, "User don't have photo");

  await deleteCloudPhoto(userId);
  await db.query("UPDATE users SET photo=NULL WHERE id=$1", [userId]);
};

export default {
  getMe,
  changePassword,
  deleteAccount,
  uploadUserPhoto,
  deletePhoto,
};
