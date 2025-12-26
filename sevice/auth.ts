import db from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ISignIn, ISignUp, AuthResponse, IChangePassword } from "./interfaces";
import helper from "../helper";
import { v4 as uuidv4 } from "uuid";
import jose from "jose";

const { JWT_SECRET, JWT_RESET_PASSWORD_SECRET } = process.env;

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

/* 
check if the email is in DB
send a link through the mail for reseting password
create a token for verification whether user is changing his password
store hashed one on password_reset_tokens db and raw is sent to frontend to add to URL.
*/

const sendEmail = async (email: string): Promise<AuthResponse> => {
  const user = await db.query("SELECT id, fullName FROM users WHERE email=$1", [
    email,
  ]);

  if (user.rows.length === 0) {
    return {
      ok: false,
      code: 404,
      message: "If the email exists, we sent a reset link.",
    };
  }

  const userFullName = user.rows[0].fullname;
  const userId = user.rows[0].id;

  const payload = { userId };

  const token = jwt.sign(payload, JWT_RESET_PASSWORD_SECRET!, {
    expiresIn: "24h",
  });

  const isMailSent = await helper.sendEmail({
    email,
    fullName: userFullName,
    tokenId: token,
  });

  if (!isMailSent.ok) {
    return { ok: false, code: 400, message: "Mail error!" };
  }

  const hashedToken = await bcrypt.hash(token, 10);

  const tokenUUID = uuidv4();

  // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // await db.query(
  //   "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
  //   [tokenUUID, userId, hashedToken, expiresAt]
  // );

  await db.query(
    "INSERT INTO password_reset_tokens (id, user_id, token_hash) VALUES ($1, $2, $3)",
    [tokenUUID, userId, hashedToken]
  );

  return { ok: true, payload: token };
};

/*
verify is token valid
change password, previously hashed
After successful password changing - delete token
*/

const changePassword = async ({
  password,
  confirmPassword,
  token,
}: IChangePassword): Promise<AuthResponse> => {
  if (password !== confirmPassword) {
    return { ok: false, code: 400, message: "Passwords do not match!" };
  }

  const secret = new TextEncoder().encode(JWT_RESET_PASSWORD_SECRET!);

  const isTokenValid = await jose.jwtVerify(token, secret);

  const userId = isTokenValid.payload.userId;

  const isToken = await db.query(
    "SELECT * FROM password_reset_tokens WHERE user_id=$1",
    [userId]
  );

  if (isToken.rows.length == 0) {
    return {
      ok: false,
      code: 403,
      message: "You don't have permission to change password!",
    };
  }

  const res = isToken.rows[0];

  // if (res.expires_at < new Date()) {
  //   return { ok: false, code: 410, message: "Token expired!" };
  // }

  const isTokensSame = await bcrypt.compare(token, res.token_hash);

  if (!isTokensSame) {
    return {
      ok: false,
      code: 403,
      message: "You cannot change password to another person account!",
    };
  }

  const newPassword = await bcrypt.hash(password, 10);

  await db.query("UPDATE users SET password=$1 WHERE id=$2;", [
    newPassword,
    userId,
  ]);

  await db.query("DELETE FROM password_reset_tokens WHERE user_id=$1", [
    userId,
  ]);

  return { ok: true, payload: "" };
};

export default { signup, signin, sendEmail, changePassword };
