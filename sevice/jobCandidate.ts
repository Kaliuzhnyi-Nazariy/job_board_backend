import db from "../lib/db";
import { CandidateJobRes, EmployerJobRes } from "./interfaces";

interface IGetJobsParams {
  page: number;
  limit: 12 | 16;
  order: "newest" | "oldest";
}

const getJobs = async ({
  page,
  limit,
  order,
}: IGetJobsParams): Promise<CandidateJobRes> => {
  const offset = (page - 1) * limit;
  const orderBy = order === "newest" ? "DESC" : "ASC";

  const resTotal = await db.query("SELECT COUNT(*) FROM jobs");

  const res = await db.query(
    `
    SELECT *
    FROM jobs
    ORDER BY created_at ${orderBy}
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 500, message: "Server error!" };
  }

  return {
    ok: true,
    data: {
      jobs: res.rows,
      meta: {
        page: page,
        limit: limit,
        total: Number(resTotal.rows[0].count),
      },
    },
  };
};

const getJob = async (jobId: string): Promise<CandidateJobRes> => {
  const res = await db.query("SELECT * FROM jobs WHERE id=$1", [jobId]);

  if (res.rows.length === 0) {
    return { ok: false, code: 404, message: "Job not found!" };
  }

  return { ok: true, data: { jobs: res.rows[0] } };
};

export default { getJobs, getJob };
