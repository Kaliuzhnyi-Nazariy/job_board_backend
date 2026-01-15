import db from "../lib/db";
import { CandidateApplication } from "./interfaces";

const apply = async ({
  userId,
  jobId,
  coveringLetter,
}: {
  userId: string;
  jobId: string;
  coveringLetter?: string;
}): Promise<void> => {
  try {
    await db.query(
      `INSERT INTO job_applications (user_id, job_id, covering_letter) VALUES ($1, $2, $3)`,
      [userId, jobId, coveringLetter]
    );
    return;
  } catch (error) {
    throw error;
  }
};

const getCandidatesApplications = async (
  userId: string
): Promise<CandidateApplication[]> => {
  try {
    // const res = await db.query(
    //   "SELECT j.id, j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id as ja_id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1;",
    //   [userId]
    // );
    const res = await db.query(
      "SELECT  j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1;",
      [userId]
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
};

const getCandidateApplciationDetails = async ({
  userId,
  jobApplicationId,
}: {
  userId: string;
  jobApplicationId: string;
}) => {
  try {
    const res = await db.query(
      `
      
  SELECT j.title, j.work_time, j.position, j.salary, j.location, j.description, j.responsibilities, ja.covering_letter, ja.status, ja.applied_at FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1 AND ja.id = $2;`,
      [userId, jobApplicationId]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export default {
  apply,
  getCandidatesApplications,
  getCandidateApplciationDetails,
};
