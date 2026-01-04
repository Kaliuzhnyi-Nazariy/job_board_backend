// /*
//     we receive data for job (title, position, location, salary, workTime, owner_id)
//     add to db and return new job writing from DB.
// */

import db from "../lib/db";
import { EmployerJobRes, IJobData, PostJob, UpdateJob } from "./interfaces";

const postJob = async ({
  title,
  position,
  location,
  salary,
  workTime,
  description,
  owner,
}: PostJob): Promise<EmployerJobRes> => {
  const newJob = await db.query(
    "INSERT INTO jobs (title, location, position, salary, workTime, description, owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [title, location, position, salary, workTime, description, owner]
  );

  if (newJob.rows.length == 0) {
    return { ok: false, code: 400, message: "Something went wrong!" };
  }

  return { ok: true, job: newJob.rows[0] };
};

const getJobs = async ({
  ownerId,
}: {
  ownerId: string;
}): Promise<EmployerJobRes> => {
  const result = await db.query(`SELECT * FROM jobs WHERE owner=$1`, [ownerId]);

  if (result.rows.length === 0) {
    return { ok: false, code: 404, message: "Jobs not found!" };
  }

  return { ok: true, job: result.rows };
};

const updateJob = async ({
  title,
  position,
  location,
  salary,
  workTime,
  description,
  jobId,
}: Partial<UpdateJob>): Promise<EmployerJobRes> => {
  const res = await db.query(
    "UPDATE jobs SET title=$1, position=$2, location=$3, salary=$4, workTime=$5, description=%6 WHERE id=$7 RETURNING *",
    [title, position, location, salary, workTime, description, jobId]
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

export default { postJob, getJobs, updateJob, deleteJob };
