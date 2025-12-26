import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { errorHandler } from "../helper/errorHandler";
import db from "../lib/db";
import { CustomRequest } from "./interfaces";

const { JWT_SECRET } = process.env;

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const token = cookies["token"];

  if (!token) {
    return next(errorHandler(401));
  }

  const secret = new TextEncoder().encode(JWT_SECRET!);
  const check = await jwtVerify(token, secret);

  const tokenData = check.payload;

  const user = await db.query("SELECT * FROM users where id=$1 and email=$2", [
    tokenData.id,
    tokenData.email,
  ]);

  if (user.rows.length === 0) {
    return next(errorHandler(401));
  }

  (req as unknown as CustomRequest).userId = String(tokenData.id);
  //   (req as unknown as CustomRequest).email = String(tokenData.email);
  //   (req as unknown as CustomRequest).fullName = String(user.rows[0].email);

  next();
};

export default isAuthenticated;
