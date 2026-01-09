import db from "../lib/db";
import { Candidates } from "./interfaces";

const getCandidates = async (): Promise<Candidates> => {
  const res = await db.query(
    "SELECT id, role, full_name, username, email FROM users WHERE role='candidate'"
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 404, message: "Candidates not found" };
  }

  return { ok: true, data: res.rows };
};

const getCandidate = async (id: string): Promise<Candidates> => {
  const res = await db.query(
    `
    SELECT
    u.id,
  u.full_name,
  u.username,
  u.email,

  c.biography,
  c.speciality,
  c.date_of_birth,
  c.gender,
  c.experience,
  c.education,
  c.website,
  c.location,
  c.phone,
  c.created_at,
  c.updated_at
FROM users u
JOIN candidate_profiles c
  ON u.id = c.user_id
WHERE u.id = $1;`,
    [id]
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 404, message: "Candidate not found!" };
  }

  return { ok: true, data: res.rows[0] };
};

export default { getCandidates, getCandidate };
