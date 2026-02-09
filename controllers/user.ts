import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import userService from "../sevice/user";
import { errorHandler } from "../helper/errorHandler";
import helper from "../helper";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;

if(!userId) {
return next(errorHandler(401, "user not found"))
}


//  const result = await 
//userService.getMe(userId);

//  if (!result.ok) {
//    return next(errorHandler(result.code, result.message));
//  }
//
//  res.status(200).json(result);

try {
const user = await UserService.getMe(userId)

return res.status(200).json(user)

} catch (error) {
next(error}

};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { userId } = req as unknown as CustomRequest;

if(!oldPassword) {
return next(errorHandler(400, "Old password is not found"))
}

if(!newPassword) {
return next(errorHandler(400, "New password is not found"))
}

if(!confirmPassword) {
return next(errorHandler(400, "Confirm Password is not found"))
}

if(!userId) {
return next(errorHandler(401, "user is not found"))
}

try {
  await userService.changePassword(
    oldPassword,
    newPassword,
    confirmPassword,
    userId,
  );

  res.status(204).json();
} catch (error){
next(error)
}
};

const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;

if(!userId) {
return next(errorHandler(401, "user is not found"))
}

try {
  await userService.deleteAccount(userId);

  res.clearCookie("token", helper.cookieSettings);

  res.status(204).json();
} catch (error) {
next(error)
}
};

export default { getMe, changePassword, deleteAccount };
