import { NextFunction, Request, Response } from "express";
import { IResponse, ISignUp, ISignIn } from "../sevice/interfaces";

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

const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token", helper.cookieSettings);
  res.status(200).json({ ok: true });
};

const sendEmailForResetPassword = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction
) => {
  const { email } = req.body;

  const result = await authService.sendEmail(email);

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  if (result && !result.payload) {
    return next(errorHandler(500));
  }

  res.status(200).json({ ok: true, payload: result.payload });
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, confirmPassword, token } = req.body;

  const result = await authService.changePassword({
    password,
    confirmPassword,
    token,
  });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json({ ok: true });
};

export default {
  signup,
  signin,
  logout,
  sendEmailForResetPassword,
  changePassword,
};
