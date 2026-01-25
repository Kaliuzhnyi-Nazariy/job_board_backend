import { NextFunction, Request, Response } from "express";
import candidateService from "../sevice/candidates";
import { errorHandler } from "../helper/errorHandler";
import { CustomRequest } from "../middlewares/interfaces";

const getCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { search, location } = req.query;
  const result = await candidateService.getCandidates({
    location: location as string,
    // order: order as "DESC" | "ASC",
    search: search as string,
  });

  res.status(200).json(result);
};

const getCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { candidateId } = req.params;
  const result = await candidateService.getCandidate(candidateId);

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const updateCandidatePersonal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { full_name, speciality, experience, education, website } = req.body;

  const result = await candidateService.updatePersonal({
    full_name,
    speciality,
    experience,
    education,
    website,
    id: userId,
  });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const updateCandidateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { biography, date_of_birth, gender, experience, education } = req.body;

  const result = await candidateService.updateProfile({
    biography,
    date_of_birth,
    gender,
    experience,
    education,
    id: userId,
  });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

export default {
  getCandidates,
  getCandidate,
  updateCandidatePersonal,
  updateCandidateProfile,
};
