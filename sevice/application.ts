import db from "../lib/db";
import {
  CandiadteAnswers,
  CandidateApplication,
  CandidateRecentApplications,
  JobApplicatinon,
} from "./interfaces";

const applyToJob = async ({
  userId,
  jobId,
  coveringLetter,
  cvId,
}: {
  userId: string;
  jobId: string;
  coveringLetter?: string;
  cvId: string;
}): Promise<void> => {
  await db.query(
    `INSERT INTO job_applications (user_id, job_id, covering_letter, cv_id) VALUES ($1, $2, $3, $4)`,
    [userId, jobId, coveringLetter, cvId],
  );
};

const getMyApplicationsCount = async (
  userId: string,
): Promise<{ count: number }> => {
  const { rows } = await db.query(
    "SELECT COUNT(*) FROM job_applications WHERE user_id=$1",
    [userId],
  );

  const count = Number(rows[0]?.count ?? 0);

  return { count };
};

const getMyApplications = async ({
  userId,
  page,
}: {
  userId: string;
  page: number;
}): Promise<CandidateApplication[]> => {
  const offset = (page && page - 1) * 8;

  const res = await db.query(
    "SELECT  j.title, j.location, j.salary, j.work_time, ja.status, ja.applied_at, ja.id FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1 ORDER BY applied_at DESC LIMIT 8 OFFSET $2 ;",
    [userId, offset],
  );

  return res.rows;
};

const getMyApplicationById = async ({
  userId,
  jobApplicationId,
}: {
  userId: string;
  jobApplicationId: string;
}) => {
  const res = await db.query(
    `
      
  SELECT j.title, j.work_time, j.position, j.salary, j.location, j.description, j.responsibilities, ja.covering_letter, ja.status, ja.applied_at FROM jobs j JOIN job_applications ja ON j.id = ja.job_id WHERE ja.user_id = $1 AND ja.id = $2;`,
    [userId, jobApplicationId],
  );

  return res.rows[0];
};

// employer

const getApplcationsByJobId = async (
  jobId: string,
): Promise<JobApplicatinon[]> => {
  const res = await db.query(
    `SELECT ja.id, ja.status, ja.applied_at, u.full_name, u.id as user_id, ca.experience, ca.education, ca.speciality FROM job_applications ja LEFT JOIN users u ON ja.user_id = u.id LEFT JOIN candidate_profiles ca ON ca.user_id = u.id WHERE ja.job_id = $1 ORDER BY ja.applied_at DESC;`,
    [jobId],
  );

  return res.rows;
};

const getApplicationDetails = async ({
  jobId,
  applicationId,
}: {
  jobId: string;
  applicationId: string;
}) => {
  const res = await db.query(
    `SELECT ja.*, u.full_name, u.email, cp.*, c.filename FROM job_applications ja LEFT JOIN users u ON ja.user_id = u.id LEFT JOIN candidate_profiles cp ON cp.user_id = u.id LEFT JOIN cvs c ON c.id=ja.cv_id  WHERE ja.job_id = $1 AND ja.id = $2;`,
    [jobId, applicationId],
  );

  return res.rows[0];
};

const updateApplicationStatus = async ({
  status,
  jobApplicationId,
}: {
  status: "rejected" | "accepted";
  jobApplicationId: string;
}) => {
  await db.query(
    `
      UPDATE job_applications SET status = $1 WHERE job_applications.id = $2;
`,
    [status, jobApplicationId],
  );
};

const getMyRecentApplications = async (
  userId: string,
): Promise<CandidateRecentApplications[]> => {
  const res = await db.query(
    "SELECT ja.id, ja.status, ja.applied_at, j.title, j.location, j.work_time, j.salary FROM job_applications ja LEFT JOIN jobs j ON ja.job_id = j.id WHERE ja.user_id = $1 ORDER BY applied_at DESC LIMIT 5;",
    [userId],
  );

  return res.rows;
};

export default {
  applyToJob,
  getMyApplications,
  getMyApplicationsCount,
  getMyApplicationById,
  getApplcationsByJobId,
  getApplicationDetails,
  updateApplicationStatus,
  getMyRecentApplications,
};
