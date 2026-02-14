import { NextFunction, Request, Response } from "express";
import {
  ISignUp,
  ISignIn,
  ISingnInResponse,
  ISendEmailResponse,
} from "../sevice/interfaces";

import authService from "../sevice/auth";
import { errorHandler } from "../helper/errorHandler";
import helper from "../helper";

const signup = async (
  req: Request<{}, {}, ISignUp>,
  res: Response,
  next: NextFunction,
) => {
  const { role, fullName, username, email, password, confirmPassword } =
    req.body;

  if (
    !role ||
    !fullName ||
    !username ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return next(errorHandler(400, "Missing required fields"));
  }

  try {
    const result = await authService.signup({
      role,
      fullName,
      username,
      email,
      password,
      confirmPassword,
    });

    res.cookie("token", result.token, helper.cookieSettings);

    res.status(201).json(result.data);
  } catch (error) {
    next(error);
  }
};

// ============================================ //

const signin = async (
  req: Request<{}, {}, ISignIn>,
  res: Response<ISingnInResponse>,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(errorHandler(400, "Missing required field"));

  try {
    const { data, token } = await authService.signin({ email, password });

    res.cookie("token", token, helper.cookieSettings);

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// ======================================== //

const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token", helper.cookieSettings);
  res.sendStatus(204);
};

const sendEmailForResetPassword = async (
  req: Request,
  res: Response<ISendEmailResponse>,
  next: NextFunction,
) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, "Missing required field"));
  }

  try {
    const { token } = await authService.sendEmail(email);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password, confirmPassword, token } = req.body;

  if (!password || !confirmPassword || !token) {
    return next(errorHandler(400, "Missing required fields"));
  }

  if (password !== confirmPassword) {
    return next(errorHandler(400, "Invalid credentials"));
  }

  try {
    await authService.changePassword({
      password,
      confirmPassword,
      token,
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
  logout,
  sendEmailForResetPassword,
  changePassword,
};
