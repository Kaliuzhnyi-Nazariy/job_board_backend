import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import {
  EmployerJobRes,
  EmployerRecentJobsRes,
  PostJob,
  UpdateJob,
} from "./interfaces";

const postJob = async ({
  title,
  position,
  location,
  salary,
  education,
  experience,
  responsibilities,
  workTime,
  description,
  owner,
}: PostJob): Promise<EmployerJobRes> => {
  const newJob = await db.query(
    "INSERT INTO jobs (title, location, position, salary, education, experience, description, responsibilities, work_time, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
      title,
      location,
      position,
      salary,
      education,
      experience,
      description,
      responsibilities,
      workTime,
      owner,
    ],
  );

  if (newJob.rows.length == 0) {
    throw errorHandler(400, "Something went wrong");
  }

  return { job: newJob.rows[0] };
};

const getMyJobs = async ({
  ownerId,
  page,
}: {
  ownerId: string;
  page: number;
}): Promise<EmployerJobRes> => {
  const LIMIT = 6;

  const offset = (page - 1) * LIMIT;

  const result = await db.query(
    `SELECT j.id, j.title, j.work_time, j.created_at, COUNT(ja.id) as applications_count FROM jobs j LEFT JOIN job_applications ja ON j.id = ja.job_id WHERE owner_id=$1 GROUP BY
  j.id,
  j.title,
  j.work_time,
  j.created_at LIMIT ${LIMIT} OFFSET $2`,
    [ownerId, offset],
  );

  const myJobsCount = await db.query(
    "SELECT COUNT(*) FROM jobs WHERE owner_id=$1",
    [ownerId],
  );

  return {
    job: result.rows,
    meta: { allAmountOfJobs: Number(myJobsCount.rows[0].count), limit: LIMIT },
  };
};

const getMyJobById = async ({
  ownerId,
  jobId,
}: {
  ownerId: string;
  jobId: string;
}): Promise<EmployerJobRes> => {
  const result = await db.query(
    "SELECT * FROM jobs WHERE owner_id=$1 AND id=$2",
    [ownerId, jobId],
  );

  if (result.rows.length === 0) {
    throw errorHandler(404, "Job not found");
  }

  return { job: result.rows[0] };
};

const updateJob = async ({
  title,
  position,
  location,
  salary,
  workTime,
  description,
  jobId,
  education,
  responsibilities,
  experience,
  owner,
}: Partial<UpdateJob>): Promise<EmployerJobRes> => {
  const res = await db.query(
    "UPDATE jobs SET title=$1, position=$2, location=$3, salary=$4,education=$5, experience=$6, responsibilities=$7,  work_time=$8, description=$9 WHERE id=$10 AND owner_id=$11 RETURNING *",
    [
      title,
      position,
      location,
      salary,
      education,
      experience,
      responsibilities,
      workTime,
      description,
      jobId,
      owner,
    ],
  );

  if (res.rows.length == 0) {
    throw errorHandler(500, "Some error occured on server");
  }

  return { job: res.rows[0] };
};

const deleteJob = async ({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}): Promise<EmployerJobRes> => {
  const res = await db.query(
    "DELETE FROM jobs WHERE id = $1 AND owner_id=$2 RETURNING *",
    [jobId, userId],
  );

  if (res.rows.length == 0) {
    throw errorHandler(404, "Job not found");
  }

  return { job: res.rows[0] };
};

const getFiveRecentJobs = async (
  userId: string,
): Promise<EmployerRecentJobsRes> => {
  const res = await db.query(
    `
      SELECT
    j.id,
    j.title,
    j.work_time,
    j.position,
    j.created_at,
    COUNT(ja.id)::int AS applications_count
  FROM jobs j
  LEFT JOIN job_applications ja
    ON ja.job_id = j.id
  WHERE j.owner_id = $1
  GROUP BY
    j.id,
    j.title,
    j.work_time,
    j.position,
    j.created_at
  ORDER BY j.created_at DESC
  LIMIT 5;
  `,
    [userId],
  );

  return { data: res.rows };
};

export default {
  postJob,
  getMyJobs,
  getMyJobById,
  updateJob,
  deleteJob,
  getFiveRecentJobs,
};
