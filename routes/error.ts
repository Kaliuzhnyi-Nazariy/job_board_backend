import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/errorHandler";

const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ message: "Request not found!" });
};

const errorRoute = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status = 500, message = "Server error!" } = err;
  res.status(status).json({ message });
};

export default { notFoundError, errorRoute };
