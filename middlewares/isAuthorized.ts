import { NextFunction, Response, Request } from "express";
import { errorHandler } from "../helper/errorHandler";
import { CustomRequest } from "./interfaces";

export type Roles = "candidate" | "employer";

export const isAuthorized =
  (allowedRoles: Roles[]) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.role) {
      return next(errorHandler(401));
    }

    if (!allowedRoles.includes(req.role)) {
      return next(errorHandler(403));
    }

    next();
  };
