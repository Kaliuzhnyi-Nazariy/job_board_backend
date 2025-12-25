import db from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ISignIn, ISignUp, AuthResponse } from "./interfaces";

const { JWT_SECRET } = process.env;

/*
  1. Checking email as it unique value in DB.
  2. Returning user-friendly error messages.
  3. Return token to controller to set it in cookies
  3.1. Not return user, because we will get it from /user/me.
*/

const signup = async ({
  role,
  fullName,
  username,
  email,
  password,
  confirmPassword,
}: ISignUp): Promise<AuthResponse> => {
  const user = await db.query(`select * from users where email=$1`, [email]);

  if (user.rows.length > 0) {
    return { ok: false, code: 409, message: "User is already exist!" };
  }

  if (password !== confirmPassword) {
    return { ok: false, code: 400, message: "Passwords do not match!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.query(
    "INSERT INTO users (role, fullName, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING email, id, role, username, fullName",
    [role, fullName, username, email, hashedPassword]
  );

  const payload = {
    id: newUser.rows[0].id,
    email: newUser.rows[0].email,
  };

  const token = jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "96h",
  });

  return { ok: true, payload: token };
};

/*
Checking whether user exist in DB
Checking passwords
generating new token  
*/

const signin = async ({ email, password }: ISignIn): Promise<AuthResponse> => {
  const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  if (user.rows.length == 0) {
    return { ok: false, code: 400, message: "Email or Password is incorrect!" };
  }

  const userData = user.rows[0];

  const comparePassword = await bcrypt.compare(password, userData.password);

  if (!comparePassword) {
    return { ok: false, code: 400, message: "Email or Password is incorrect!" };
  }

  const payload = {
    id: userData.id,
    email: userData.email,
  };

  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: "96h" });

  return { ok: true, payload: token };
};

export default { signup, signin };
