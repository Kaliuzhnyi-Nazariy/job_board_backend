import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import employerService from "../sevice/jobEmployer";
import candidateService from "../sevice/jobCandidate";

import { errorHandler } from "../helper/errorHandler";

// employer

const postJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const {
    title,
    position,
    location,
    salary,
    responsibilities,
    education,
    experience,
    workTime,
    description,
  } = req.body;

  try {
    const response = await employerService.postJob({
      title,
      position,
      location,
      salary,
      workTime,
      description,
      owner: userId,
      responsibilities,
      education,
      experience,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getMyJobs = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { page } = req.query;

  if (!userId) {
    return next(errorHandler(400, "userid is required"));
  }

  if (!page) {
    return next(errorHandler(400, "Page is required"));
  }

  try {
    const result = await employerService.getMyJobs({
      ownerId: userId,
      page: Number(page) as number,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMyJobById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;

  if (!jobId) {
    return next(errorHandler(400, "Job id is required"));
  }

  try {
    const result = await employerService.getMyJobById({
      ownerId: userId,
      jobId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  const {
    title,
    position,
    location,
    salary,
    workTime,
    description,
    education,
    experience,
    responsibilities,
  } = req.body;

  if (!jobId) {
    return next(errorHandler(400, "Job id is required"));
  }

  try {
    const result = await employerService.updateJob({
      title,
      position,
      location,
      salary,
      workTime,
      description,
      jobId,
      education,
      experience,
      responsibilities,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;

  if (!jobId) {
    return next(errorHandler(400, "Job id is required"));
  }

  try {
    const result = await employerService.deleteJob({ jobId, userId });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getFiveRecentJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;

  try {
    const result = await employerService.getFiveRecentJobs(userId);

    res.status(200).json(result.data);
  } catch (error) {
    next(error);
  }
};

// candidate

const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params);
  const { page, limit, order, location, title } = req.query;

  if (!page || !limit) {
    return next(errorHandler(400, "page and limit are required"));
  }

  try {
    const result = await candidateService.getJobs({
      page: Number(page),
      limit: Number(limit) as 12 | 16,
      order: order as "newest" | "oldest",
      location: location as string | null,
      title: title as string | null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;

  if (!jobId) {
    return next(errorHandler(400, "Job id is required"));
  }

  try {
    const result = await candidateService.getJobById(jobId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  postJob,
  getMyJobs,
  getMyJobById,
  updateJob,
  deleteJob,
  getFiveRecentJobs,
  getJobs,
  getJobById,
};
