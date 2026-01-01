import db from "../lib/db";
import { GetMe, IUser } from "./interfaces";

/*
  check whether user exists
  return all data except for password
*/

const getMe = async (userId: string): Promise<GetMe> => {
  const user = await db.query<IUser>(
    "SELECT role, username, fullname, email FROM users WHERE id=$1;",
    [userId]
  );

  if (user.rows.length === 0) {
    return { ok: false, code: 404, message: "User not found!" };
  }

  return { ok: true, user: user.rows[0] };
};

export default { getMe };
