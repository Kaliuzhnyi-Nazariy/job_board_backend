import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import { CandidateJobRes, EmployerJobRes } from "./interfaces";

interface IGetJobsParams {
  page: number;
  limit: 12 | 16;
  order: "newest" | "oldest";
  location: string | null;
  title: string | null;
}

const getJobs = async ({
  page,
  limit,
  order,
  location,
  title,
}: IGetJobsParams): Promise<CandidateJobRes> => {
  const offset = (page - 1) * limit;
  const orderBy = order === "newest" ? "DESC" : "ASC";

  const resTotal = await db.query(
    `SELECT COUNT(*) FROM jobs WHERE ($1::text IS NULL OR title ILIKE '%' || $1::text || '%' OR position ILIKE '%' || $1::text || '%' OR education ILIKE '%' || $1::text || '%' OR experience ILIKE '%' || $1::text || '%' OR description ILIKE '%' || $1::text || '%' OR responsibilities ILIKE '%' || $1::text || '%')
    AND ($2::text IS NULL OR location ILIKE '%' || $2::text || '%')`,
    [title, location],
  );

  const res = await db.query(
    `
  SELECT *
  FROM jobs
  WHERE
    ($1::text IS NULL OR title ILIKE '%' || $1::text || '%' OR position ILIKE '%' || $1::text || '%' OR education ILIKE '%' || $1::text || '%' OR experience ILIKE '%' || $1::text || '%' OR description ILIKE '%' || $1::text || '%' OR responsibilities ILIKE '%' || $1::text || '%')
    AND ($2::text IS NULL OR location ILIKE '%' || $2::text || '%')
  ORDER BY created_at ${orderBy}
  LIMIT $3 OFFSET $4
  `,
    [title, location, limit, offset],
  );

  return {
    jobs: res.rows,
    meta: {
      page: page,
      limit: limit,
      total: Number(resTotal.rows[0].count),
    },
  };
};

const getJobById = async (jobId: string): Promise<CandidateJobRes> => {
  const res = await db.query("SELECT * FROM jobs WHERE id=$1", [jobId]);

  if (res.rows.length === 0) {
    throw errorHandler(404, "Job not found");
  }

  return { jobs: res.rows[0] };
};

export default { getJobs, getJobById };
