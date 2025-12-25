import { NextFunction, Request, Response } from "express";
import {
  IResponse,
  ISignUp,
  AuthResponse,
  ISignIn,
} from "../sevice/interfaces";

import authService from "../sevice/auth";
import { errorHandler } from "../helper/errorHandler";
import helper from "../helper";

const signup = async (
  req: Request<{}, {}, ISignUp>,
  res: Response<IResponse>,
  next: NextFunction
) => {
  const { role, fullName, username, email, password, confirmPassword } =
    req.body;

  const result = await authService.signup({
    role,
    fullName,
    username,
    email,
    password,
    confirmPassword,
  });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.cookie("token", result.payload, helper.cookieSettings);

  res.status(201).json({
    ok: result.ok,
  });
};

const signin = async (
  req: Request<{}, {}, ISignIn>,
  res: Response<IResponse>,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const result = await authService.signin({ email, password });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.cookie("token", result.payload, helper.cookieSettings);

  res.status(200).json({ ok: result.ok });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {};

const sendEmailForResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default {
  signup,
  signin,
  logout,
  sendEmailForResetPassword,
  changePassword,
};
