import db from "../lib/db";
import { Candidates } from "./interfaces";

const getCandidates = async (): Promise<Candidates> => {
  const res = await db.query(
    "SELECT id, role, fullname, username, email FROM users WHERE role='candidate'"
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 404, message: "Candidates not found" };
  }

  return { ok: true, data: res.rows };
};

const getCandidate = async (id: string): Promise<Candidates> => {
  const res = await db.query(
    "SELECT id, role, fullname, username, email FROM users WHERE role='candidate' AND id=$1",
    [id]
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 404, message: "Candidate not found!" };
  }

  return { ok: true, data: res.rows[0] };
};

export default { getCandidates, getCandidate };
