import { NextFunction, Request, Response } from "express";
import candidateService from "../sevice/candidates";
import { errorHandler } from "../helper/errorHandler";

const getCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await candidateService.getCandidates();

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result.data);
};

const getCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { candidateId } = req.params;
  const result = await candidateService.getCandidate(candidateId);

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

export default { getCandidates, getCandidate };
