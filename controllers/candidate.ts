import { NextFunction, Request, Response } from "express";
import candidateService from "../sevice/candidates";
import { errorHandler } from "../helper/errorHandler";
import { CustomRequest } from "../middlewares/interfaces";

const getCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { search, location, order, limit } = req.query;

  if (!order || !limit) {
    return next(errorHandler(400, "Missing required fields"));
  }

  try {
    const result = await candidateService.getCandidates({
      location: location as string,
      order: order as "DESC" | "ASC",
      search: search as string,
      limit: Number(limit) as number,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { candidateId } = req.params;

  if (!candidateId) {
    return next(errorHandler(400, "Candidate id is required"));
  }

  try {
    const result = await candidateService.getCandidate(candidateId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCandidatePersonal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { full_name, speciality, experience, education, website } = req.body;

  if (
    full_name == null ||
    !full_name ||
    speciality == null ||
    experience == null ||
    education == null ||
    website == null
  ) {
    return next(errorHandler(400, "Missing required fields"));
  }

  try {
    const result = await candidateService.updatePersonal({
      full_name,
      speciality,
      experience,
      education,
      website,
      id: userId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCandidateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { biography, date_of_birth, gender, experience, education } = req.body;

  if (
    biography !== null ||
    date_of_birth !== null ||
    gender !== null ||
    !gender ||
    experience !== null ||
    education !== null
  ) {
    return next(errorHandler(400, "Missing required fields"));
  }

  try {
    const result = await candidateService.updateProfile({
      biography,
      date_of_birth,
      gender,
      experience,
      education,
      id: userId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { location, email, phone } = req.body;
  const { userId } = req as unknown as CustomRequest;

  if (location !== null || email !== null || !email || phone !== null)
    return next(errorHandler(400, "Not all fields were sent"));

  try {
    await candidateService.updateContact({
      id: userId,
      location,
      email,
      phone,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default {
  getCandidates,
  getCandidate,
  updateCandidatePersonal,
  updateCandidateProfile,
  updateContact,
};
