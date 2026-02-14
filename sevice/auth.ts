import db from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ISignIn,
  ISignUp,
  // AuthResponse,
  IChangePassword,
  // AuthSigninResponse,
  IServiceSigninResponse,
  ISendEmailResponse,
  SignupResponse,
} from "./interfaces";
import helper from "../helper";
import { v4 as uuidv4 } from "uuid";
import jose from "jose";
import { errorHandler } from "../helper/errorHandler";

const { JWT_SECRET, JWT_RESET_PASSWORD_SECRET } = process.env;

/*
  1. Checking email as it unique value in DB.
  2. Returning user-friendly error messages.
  3. Return token to controller to set it in cookies
  3.1. Not return user, because we will get it from /user/me.

  4. if new user role is candidate create candidate profile automaticaly
  */

const signup = async ({
  role,
  fullName,
  username,
  email,
  password,
  confirmPassword,
}: ISignUp): Promise<SignupResponse> => {
  const user = await db.query(`select * from users where email=$1`, [email]);

  if (user.rows.length > 0) {
    throw errorHandler(409, "User is already exist");
  }

  if (password !== confirmPassword) {
    throw errorHandler(400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.query(
    "INSERT INTO users (role, full_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING email, id, role, username, full_name",
    [role, fullName, username, email, hashedPassword],
  );

  if (!newUser.rows[0]) {
    throw errorHandler(500, "Something went wrong");
  }

  const payload = {
    id: newUser.rows[0].id,
    email: newUser.rows[0].email,
  };

  const token = jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "96h",
  });

  if (role === "candidate") {
    await db.query("INSERT INTO candidate_profiles (user_id) VALUES ($1)", [
      newUser.rows[0].id,
    ]);
  }

  return { token: token, data: newUser.rows[0] };
};

/*
Checking whether user exist in DB
Checking passwords
generating new token  
*/

const signin = async ({
  email,
  password,
}: ISignIn): Promise<IServiceSigninResponse> => {
  const user = await db.query(
    "SELECT id, role, username, full_name, email, password FROM users WHERE email=$1",
    [email],
  );

  if (!user.rows[0]) {
    throw errorHandler(400, "Invalid credentials");
  }

  const userData = user.rows[0];

  const comparePassword = await bcrypt.compare(password, userData.password);

  if (!comparePassword) {
    throw errorHandler(400, "Invalid credentials");
  }

  const payload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: "96h" });

  return {
    data: {
      id: userData.id,
      role: userData.role,
      username: userData.username,
      full_name: userData.full_name,
      email: userData.email,
    },
    token: token,
    // role: userData.role,
  };
};

/* 
check if the email is in DB
send a link through the mail for reseting password
create a token for verification whether user is changing his password
store hashed one on password_reset_tokens db and raw is sent to frontend to add to URL.
*/

const sendEmail = async (email: string): Promise<ISendEmailResponse> => {
  const user = await db.query(
    "SELECT id, full_name FROM users WHERE email=$1",
    [email],
  );

  if (user.rows.length === 0) {
    throw errorHandler(400, "If the email exists, we sent a reset link.");
  }

  const userFullName = user.rows[0].full_name;
  const userId = user.rows[0].id;

  const payload = { userId };

  const token = jwt.sign(payload, JWT_RESET_PASSWORD_SECRET!, {
    expiresIn: "24h",
  });

  // const isMailSent = await helper.sendEmail({
  //   email,
  //   fullName: userFullName,
  //   tokenId: token,
  // });

  // if (!isMailSent.ok) {
  // throw errorHandler(400, "Mail error!");
  // }

  const hashedToken = await bcrypt.hash(token, 10);

  const tokenUUID = uuidv4();

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await db.query(
      "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [tokenUUID, userId, hashedToken, expiresAt],
    );
  } catch (error: unknown) {
    if ((error as { code: string }).code === "23505") {
      throw errorHandler(409, "Token have already been sent to your email!");
    }
  }

  return { token };
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
}: IChangePassword) => {
  if (password !== confirmPassword) {
    throw errorHandler(400, "Invalid credentials");
  }

  const secret = new TextEncoder().encode(JWT_RESET_PASSWORD_SECRET!);

  let userId;

  try {
    const isTokenValid = await jose.jwtVerify(token, secret);
    userId = isTokenValid.payload.userId;
  } catch (error) {
    throw errorHandler(400, "Invalid or expired token");
  }

  const isToken = await db.query(
    "SELECT * FROM password_reset_tokens WHERE user_id=$1",
    [userId],
  );

  if (isToken.rows.length == 0) {
    throw errorHandler(403, "You don't have permission to change password");
  }

  const res = isToken.rows[0];

  const isTokensSame = await bcrypt.compare(token, res.token_hash);

  if (!isTokensSame) {
    throw errorHandler(
      403,
      "You cannot change password to another person account",
    );
  }

  const newPassword = await bcrypt.hash(password, 10);

  await db.query("UPDATE users SET password=$1 WHERE id=$2;", [
    newPassword,
    userId,
  ]);

  await db.query("DELETE FROM password_reset_tokens WHERE user_id=$1", [
    userId,
  ]);
};

export default { signup, signin, sendEmail, changePassword };
