import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import employerService from "../sevice/jobEmployer";
import candidateService from "../sevice/jobCandidate";

import { errorHandler } from "../helper/errorHandler";

const postJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const {
    title,
    position,
    location,
    salary,
    responsobilities,
    education,
    experience,
    workTime,
    description,
  } = req.body;

  const response = await employerService.postJob({
    title,
    position,
    location,
    salary,
    workTime,
    description,
    owner: userId,
    responsobilities,
    education,
    experience,
  });

  if (!response.ok) {
    return next(errorHandler(response.code, response.message));
  }

  if (response && !response.job) {
    return next(errorHandler(500));
  }

  res.status(201).json(response);
};

const getMyJobs = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const result = await employerService.getMyJobs({ ownerId: userId });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const getMyJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;
  const result = await employerService.getMyJob({ ownerId: userId, jobId });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
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
    responsobilities,
  } = req.body;

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
    responsobilities,
  });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  const result = await employerService.deleteJob({ jobId });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const getJob = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, order } = req.query;

  const result = await candidateService.getJobs({
    page: Number(page),
    limit: Number(limit) as 12 | 16,
    order: order as "newest" | "oldest",
  });

  if (!result.ok) {
    return next(errorHandler(result.code));
  }

  res.status(200).json(result.data);
};

export default { postJob, getMyJobs, getMyJob, updateJob, deleteJob, getJob };
