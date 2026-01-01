import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import userService from "../sevice/user";
import { errorHandler } from "../helper/errorHandler";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const result = await userService.getMe(userId);

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

export default { getMe };
