import db from "../lib/db";
import {
  Candidates,
  CandidatesRes,
  IUser,
  UpdateCandidateProfile,
  UpdatePortfolio,
} from "./interfaces";

const getCandidates = async ({
  // position,
  // location,
  // order,
  search,
}: {
  // position: string | null;
  // location: string | null;
  // order: "DESC" | "ASC";
  search: string;
}): Promise<CandidatesRes> => {
  // console.log({ search });
  // const res = await db.query(
  //   "SELECT id, role, full_name, username, email FROM users WHERE role='candidate'",
  // );

  const res = await db.query(
    "SELECT id, role, full_name, email FROM users   JOIN candidate_profiles cp ON id = cp.user_id  WHERE role='candidate' AND ($1::text IS NULL OR cp.speciality ILIKE '%' || $1::text || '%'  OR cp.location ILIKE '%' || $1::text || '%'  );",
    [search],
  );

  // if (res.rowCount == 0) {
  //   return { ok: false, code: 404, message: "Candidates not found" };
  // }

  return res.rows;
  // return { ok: true, data: res.rows };
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
    [id],
  );

  if (res.rowCount == 0) {
    return { ok: false, code: 404, message: "Candidate not found!" };
  }

  return { ok: true, data: res.rows[0] };
};

// make amultiple updates, for personal and candidates profile data, also split candidate upd request

const updatePersonal = async (
  data: UpdateCandidateProfile,
): Promise<Candidates> => {
  // console.log({ data });

  await db.query("BEGIN");

  try {
    await db.query(
      `
  UPDATE users
  SET full_name=$1
  WHERE id=$2
  `,
      [data.full_name, data.id],
    );

    await db.query(
      `
      UPDATE candidate_profiles
      SET
  speciality=$2, experience=$3, education=$4, website=$5 WHERE user_id = $1
      `,
      [data.id, data.speciality, data.experience, data.education, data.website],
    );

    await db.query("COMMIT");
    return { ok: true };
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

const updateProfile = async ({
  biography,
  date_of_birth,
  gender,
  experience,
  education,
  id,
}: UpdatePortfolio): Promise<Candidates> => {
  try {
    await db.query(
      `UPDATE candidate_profiles SET biography=$1, date_of_birth=$2, gender=$3, experience=$4, education=$5 WHERE user_id=$6`,
      [biography, date_of_birth, gender, experience, education, id],
    );

    return { ok: true };
  } catch (error) {
    throw error;
  }
};

export default { getCandidates, getCandidate, updateProfile, updatePersonal };
