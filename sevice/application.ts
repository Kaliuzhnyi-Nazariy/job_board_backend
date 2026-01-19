import db from "../lib/db";
import { CandidateApplication, JobApplicatinon } from "./interfaces";

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
      [userId, jobId, coveringLetter],
    );
    return;
  } catch (error) {
    throw error;
  }
};

const getCandidatesApplications = async (
  userId: string,
): Promise<CandidateApplication[]> => {
  try {
    // const res = await db.query(
    //   "SELECT j.id, j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id as ja_id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1;",
    //   [userId]
    // );
    const res = await db.query(
      "SELECT  j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1;",
      [userId],
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
      [userId, jobApplicationId],
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

const getApplcations = async (jobId: string): Promise<JobApplicatinon[]> => {
  try {
    // const res = await db.query(
    //   `SELECT ja.id, ja.covering_letter, ja.status, ja.applied_at, u.full_name, u.email FROM job_applications ja LEFT JOIN users u ON ja.user_id = u.id WHERE ja.job_id = $1;`,
    //   [jobId]
    // );

    const res = await db.query(
      `SELECT ja.id, ja.status, ja.applied_at, u.full_name, u.id as user_id, ca.experience, ca.education, ca.speciality FROM job_applications ja LEFT JOIN users u ON ja.user_id = u.id LEFT JOIN candidate_profiles ca ON ca.user_id = u.id WHERE ja.job_id = $1;`,
      [jobId],
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
};

const getApplicationDetails = async ({
  jobId,
  applicationId,
}: {
  jobId: string;
  applicationId: string;
}) => {
  try {
    const res = await db.query(
      `SELECT ja.*, u.full_name, u.email, cp.* FROM job_applications ja LEFT JOIN users u ON ja.user_id = u.id LEFT JOIN candidate_profiles cp ON cp.user_id = u.id WHERE ja.job_id = $1 AND ja.id = $2;`,
      [jobId, applicationId],
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateApplicationStatus = async ({
  status,
  jobApplicationId,
}: {
  status: "rejected" | "accepted";
  jobApplicationId: string;
}) => {
  try {
    await db.query(
      `
      UPDATE job_applications SET status = $1 WHERE job_applications.id = $2;
`,
      [status, jobApplicationId],
    );

    return;
  } catch (error) {
    throw error;
  }
};

export default {
  apply,
  getCandidatesApplications,
  getCandidateApplciationDetails,
  getApplcations,
  getApplicationDetails,
  updateApplicationStatus,
};
