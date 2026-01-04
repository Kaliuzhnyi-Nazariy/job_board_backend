import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";

import employerService from "../sevice/jobEmployer";
import { errorHandler } from "../helper/errorHandler";

const postJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { title, position, location, salary, workTime, description } = req.body;

  const response = await employerService.postJob({
    title,
    position,
    location,
    salary,
    workTime,
    description,
    owner: userId,
  });

  if (!response.ok) {
    return next(errorHandler(response.code, response.message));
  }

  if (response && !response.job) {
    return next(errorHandler(500));
  }

  res.status(201).json(response);
};

const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const result = await employerService.getJobs({ ownerId: userId });

  if (!result.ok) {
    return next(errorHandler(result.code, result.message));
  }

  res.status(200).json(result);
};

const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  const { title, position, location, salary, workTime, description } = req.body;

  const result = await employerService.updateJob({
    title,
    position,
    location,
    salary,
    workTime,
    description,
    jobId,
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

export default { postJob, getJobs, updateJob, deleteJob };
