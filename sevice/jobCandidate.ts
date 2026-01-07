import db from "../lib/db";
import { EmployerJobRes } from "./interfaces";

const getJobs = async (): Promise<EmployerJobRes> => {
  const res = await db.query("SELECT * FROM jobs");

  if (res.rowCount == 0) {
    return { ok: false, code: 500, message: "Server error!" };
  }

  return { ok: true, job: res.rows };
};

export default { getJobs };
