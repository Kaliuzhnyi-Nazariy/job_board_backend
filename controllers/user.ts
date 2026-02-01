import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import userService from "../sevice/user";
import { errorHandler } from "../helper/errorHandler";
import helper from "../helper";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const result = await userService.getMe(userId);

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { userId } = req as unknown as CustomRequest;

  await userService.changePassword(
    oldPassword,
    newPassword,
    confirmPassword,
    userId,
  );

  res.status(200).json();
};

const deleteAccount = async (req: Request, res: Response) => {
  const { userId } = req as unknown as CustomRequest;

  await userService.deleteAccount(userId);

  res.clearCookie("token", helper.cookieSettings);

  res.status(204).json();
};

export default { getMe, changePassword, deleteAccount };
