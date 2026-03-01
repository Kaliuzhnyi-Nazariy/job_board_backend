import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";
import applicationService from "../sevice/application";
import { errorHandler } from "../helper/errorHandler";

// candidate

const applyToJob = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;
  const { coveringLetter, cvId } = req.body;

  if (!userId) {
    return next(errorHandler(400, "user ID is required"));
  }

  if (!jobId) {
    return next(errorHandler(400, "job id is required"));
  }

  try {
    await applicationService.applyToJob({
      userId,
      coveringLetter,
      jobId,
      cvId,
    });

    return res.status(201).json();
  } catch (error) {
    next(error);
  }
};

const getMyApplicationsCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;

  if (!userId) {
    return next(errorHandler(401));
  }

  try {
    const result = await applicationService.getMyApplicationsCount(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { page } = req.query;

  if (!userId) {
    return next(errorHandler(401));
  }

  if (!page) {
    return next(errorHandler(400, "Page is required"));
  }

  try {
    const result = await applicationService.getMyApplications({
      userId,
      page: Number(page),
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMyApplicationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobApplicationId } = req.params;

  if (!userId) {
    return next(errorHandler(401));
  }

  if (!jobApplicationId) {
    return next(errorHandler(400, "Job application is required"));
  }

  try {
    const result = await applicationService.getMyApplicationById({
      userId,
      jobApplicationId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// employer

const getApplicationsByJobId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { jobId } = req.params;

  if (!jobId) {
    return next(errorHandler(400, "Job id is required"));
  }

  try {
    const result = await applicationService.getApplcationsByJobId(jobId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getApplicationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { jobId, applicationId } = req.params;

  if (!jobId) {
    return next(errorHandler(400, "Job Id is required"));
  }

  if (!applicationId) {
    return next(errorHandler(400, "Application id is required"));
  }

  try {
    const result = await applicationService.getApplicationDetails({
      jobId,
      applicationId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { jobApplicationId } = req.params;
  const { status } = req.body;

  if (!jobApplicationId) {
    return next(errorHandler(400, "Job application id is required"));
  }

  if (!status) {
    return next(errorHandler(400, "Status is required"));
  }

  try {
    await applicationService.updateApplicationStatus({
      status,
      jobApplicationId,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

const getMyRecentApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;

  if (!userId) {
    return next(errorHandler(401));
  }

  try {
    const result = await applicationService.getMyRecentApplications(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  applyToJob,
  getMyApplicationsCount,
  getMyApplications,
  getMyApplicationById,
  getApplicationsByJobId,
  getApplicationDetails,
  updateApplicationStatus,
  getMyRecentApplications,
};
