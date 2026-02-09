import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import userService from "../sevice/user";
import { errorHandler } from "../helper/errorHandler";
import helper from "../helper";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;

  if (!userId) {
    return next(errorHandler(401, "User not found"));
  }

  try {
    const user = await userService.getMe(userId);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { userId } = req as unknown as CustomRequest;

  if (!userId) {
    return next(errorHandler(401, "User not found"));
  }

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(errorHandler(400, "Missing required fields"));
  }

  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, "Invalid credentials"));
  }

  try {
    await userService.changePassword(oldPassword, newPassword, userId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;

  if (!userId) {
    return next(errorHandler(401, "User not found"));
  }

  try {
    await userService.deleteAccount(userId);

    res.clearCookie("token", helper.cookieSettings);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default { getMe, changePassword, deleteAccount };
