import db from "../lib/db";
import { EmployerJobRes, IJobData, PostJob, UpdateJob } from "./interfaces";

const postJob = async ({
  title,
  position,
  location,
  salary,
  education,
  experience,
  responsobilities,
  workTime,
  description,
  owner,
}: PostJob): Promise<EmployerJobRes> => {
  const newJob = await db.query(
    "INSERT INTO jobs (title, location, position, salary, education, experience, description, responsobilities, work_time, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
      title,
      location,
      position,
      salary,
      education,
      experience,
      description,
      responsobilities,
      workTime,
      owner,
    ]
  );

  if (newJob.rows.length == 0) {
    return { ok: false, code: 400, message: "Something went wrong!" };
  }

  return { ok: true, job: newJob.rows[0] };
};

const getMyJobs = async ({
  ownerId,
}: {
  ownerId: string;
}): Promise<EmployerJobRes> => {
  const result = await db.query(`SELECT * FROM jobs WHERE owner_id=$1`, [
    ownerId,
  ]);

  if (result.rows.length === 0) {
    return { ok: false, code: 404, message: "Jobs not found!" };
  }

  return { ok: true, job: result.rows };
};

const getMyJob = async ({
  ownerId,
  jobId,
}: {
  ownerId: string;
  jobId: string;
}): Promise<EmployerJobRes> => {
  const result = await db.query(
    "SELECT * FROM jobs WHERE owner_id=$1 AND id=$2",
    [ownerId, jobId]
  );

  if (result.rows.length === 0) {
    return { ok: false, code: 404, message: "Job not found!" };
  }

  return { ok: true, job: result.rows[0] };
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
  responsobilities,
  experience,
}: Partial<UpdateJob>): Promise<EmployerJobRes> => {
  const res = await db.query(
    "UPDATE jobs SET title=$1, position=$2, location=$3, salary=$4,education=$5, experience=$6, responsobilities=$7,  work_time=$8, description=$9 WHERE id=$10 RETURNING *",
    [
      title,
      position,
      location,
      salary,
      education,
      experience,
      responsobilities,
      workTime,
      description,
      jobId,
    ]
  );

  if (res.rows.length == 0) {
    return { ok: false, code: 400 };
  }

  return { ok: true, job: res.rows[0] };
};

const deleteJob = async ({
  jobId,
}: {
  jobId: string;
}): Promise<EmployerJobRes> => {
  const res = await db.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [
    jobId,
  ]);

  if (res.rows.length == 0) {
    return { ok: false, code: 404 };
  }

  return { ok: true, job: res.rows[0] };
};

export default { postJob, getMyJobs, getMyJob, updateJob, deleteJob };
