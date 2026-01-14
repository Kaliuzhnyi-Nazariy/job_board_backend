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

const getCandidatesApplies = async (
  userId: string
): Promise<CandidateApplication[]> => {
  try {
    const res = await db.query(
      "SELECT j.id, j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1;",
      [userId]
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
};

export default { apply, getCandidatesApplies };
