import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import {
  CandidateResData,
  Candidates,
  CandidatesRes,
  IUser,
  UpdateCandidateProfile,
  UpdatePortfolio,
} from "./interfaces";

const getCandidates = async ({
  location,
  order,
  search,
  limit,
}: {
  location: string | null;
  order: "DESC" | "ASC";
  search: string;
  limit: number;
}): Promise<CandidateResData> => {
  const resTotal = await db.query(`SELECT COUNT(*) FROM candidate_profiles; `);

  const res = await db.query(
    `
    SELECT
  u.id,
  u.role,
  u.full_name,
  u.email,
  cp.location,
  cp.experience
FROM users u
LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
WHERE
  u.role = 'candidate'
  AND (
    $1::text IS NULL OR
    COALESCE(cp.speciality, '') ILIKE '%' || $1 || '%' OR
    COALESCE(u.full_name, '') ILIKE '%' || $1 || '%' OR
    COALESCE(cp.experience, '') ILIKE '%' || $1 || '%' OR
    COALESCE(cp.education, '') ILIKE '%' || $1 || '%'
  )
  AND (
    $2::text IS NULL OR
    COALESCE(cp.location, '') ILIKE '%' || $2 || '%'
  ) ORDER BY cp.created_at ${order} ;`,
    [search, location],
  );

  return { data: res.rows, meta: { total: resTotal.rows[0].count, limit } };
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
    throw errorHandler(404, "Candidate not found");
  }

  return { data: res.rows[0] };
};

// make amultiple updates, for personal and candidates profile data, also split candidate upd request

const updatePersonal = async (data: UpdateCandidateProfile) => {
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
}: UpdatePortfolio) => {
  await db.query(
    `UPDATE candidate_profiles SET biography=$1, date_of_birth=$2, gender=$3, experience=$4, education=$5 WHERE user_id=$6`,
    [biography, date_of_birth, gender, experience, education, id],
  );
};

const updateContact = async ({
  id,
  location,
  phone,
  email,
}: {
  id: string;
  location?: string;
  phone?: string;
  email?: string;
}) => {
  if (!location && !phone && !email) return;

  await db.query(
    `
      UPDATE candidate_profiles cp
SET
  location = COALESCE($1::text, cp.location),
  phone    = COALESCE($2::text, cp.phone)
FROM users u
WHERE cp.user_id = u.id
  AND u.id = $3;
`,
    [location, phone, id],
  );

  await db.query(
    `UPDATE users
SET email = COALESCE($1::text, email)
WHERE id = $2;`,
    [email, id],
  );

  return;
};

export default {
  getCandidates,
  getCandidate,
  updateProfile,
  updatePersonal,
  updateContact,
};
