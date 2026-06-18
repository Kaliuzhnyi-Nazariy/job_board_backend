import {
  deleteFile,
  generatePresignedURL,
  uploadFile,
} from "../lib/storage/cloudStorage";
import db from "../lib/db";
import { errorHandler } from "../helper/errorHandler";

const uploadCV = async (
  user_id: string,
  file: Express.Multer.File,
  filename?: string,
) => {
  const nameForCheck = filename
    ? `${filename}.${file.mimetype.split("/")[1]}`
    : file.originalname;

  const cv = await db.query(
    "SELECT * FROM cvs WHERE user_id=$1 AND filename=$2",
    [user_id, nameForCheck],
  );

  if (cv.rows.length > 0) {
    throw errorHandler(400, "CV with that name is already exist");
  }

  const finalFinalName = filename
    ? `${filename}.${file.mimetype.split("/")[1]}`
    : file.originalname + user_id;

  try {
    await uploadFile(file.buffer, finalFinalName);

    await db.query(
      `INSERT INTO cvs (user_id, filename, file_size) VALUES ($1, $2, $3);`,
      [user_id, finalFinalName, file.size],
    );
  } catch (error) {
    await deleteFile(finalFinalName);
    throw error;
  }
};

const deleteCV = async (userId: string, cvId: string) => {
  const isCV = await db.query("SELECT * FROM cvs WHERE user_id=$1 AND id=$2", [
    userId,
    cvId,
  ]);

  if (isCV.rowCount == 0) {
    throw errorHandler(400, "CV is not found");
  }

  await deleteFile(isCV.rows[0].filename);
  // await deleteFile(filename);
  await db.query(`DELETE FROM cvs WHERE user_id=$1 AND id=$2;`, [userId, cvId]);
};

const updateCV = async (
  userId: string,
  cvId: string,
  file: Express.Multer.File,
  filename: string,
  newFilename?: string,
) => {
  const finalNewFilename = newFilename
    ? `${newFilename}.${file.mimetype.split("/")[1]}`
    : filename;

  const cv = await db.query(
    "SELECT filename FROM cvs WHERE user_id=$1 AND id=$2",
    [userId, cvId],
  );

  if (!cv.rows[0]) throw errorHandler(400, "CV is not found");

  await uploadFile(file.buffer, finalNewFilename);

  try {
    await db.query(
      `UPDATE cvs SET filename=$1, file_size=$2 WHERE user_id=$3 AND id =$4;`,
      [finalNewFilename, file.size, userId, cvId],
    );

    if (cv.rows[0].filename !== finalNewFilename) {
      await deleteFile(filename);
    }
  } catch (error) {
    await deleteFile(finalNewFilename);
    throw error;
  }
};

const getPresignedURL = async (cvId: string, userId: string) => {
  const isCV = await db.query("SELECT * FROM cvs WHERE id=$1 AND user_id=$2", [
    cvId,
    userId,
  ]);

  if (isCV.rowCount == 0) {
    throw errorHandler(400, "CV is not found");
  }

  return await generatePresignedURL(isCV.rows[0].filename);
};

const getCVs = async (userId: string) => {
  const res = await db.query("SELECT * FROM cvs WHERE user_id=$1", [userId]);

  return res.rows;
};

export default { uploadCV, deleteCV, updateCV, getPresignedURL, getCVs };
