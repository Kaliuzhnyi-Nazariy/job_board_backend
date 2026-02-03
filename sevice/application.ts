import db from "../lib/db";
import {
  CandiadteAnswers,
  CandidateApplication,
  CandidateRecentApplications,
  JobApplicatinon,
} from "./interfaces";

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

const getCountOfApliedApplications = async (
  userId: string,
): Promise<{ count: number }> => {
  const { rows } = await db.query(
    "SELECT COUNT(*) FROM job_applications WHERE user_id=$1",
    [userId],
  );

  const count = Number(rows[0]?.count ?? 0);

  return { count };
};

const getCandidatesApplications = async ({
  userId,
  page,
}: {
  userId: string;
  page: number;
}): Promise<CandidateApplication[]> => {
  try {
    const offset = (page && page - 1) * 8;

    const res = await db.query(
      "SELECT  j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1 ORDER BY applied_at DESC LIMIT 8 OFFSET $2 ;",
      [userId, offset],
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

const getRecentApplications = async (
  userId: string,
): Promise<CandidateRecentApplications[]> => {
  try {
    const res = await db.query(
      "SELECT ja.id, ja.status, ja.applied_at, j.title, j.location, j.work_time, j.salary FROM job_applications ja LEFT JOIN jobs j ON ja.job_id = j.id WHERE user_id = $1 ORDER BY applied_at DESC LIMIT 5;",
      [userId],
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
};

export default {
  apply,
  getCountOfApliedApplications,
  getCandidatesApplications,
  getCandidateApplciationDetails,
  getApplcations,
  getApplicationDetails,
  updateApplicationStatus,
  getRecentApplications,
};
