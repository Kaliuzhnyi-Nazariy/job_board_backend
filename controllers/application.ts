import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";
import applicationService from "../sevice/application";

const apply = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;
  const { coveringLetter } = req.body;

if (!userId) {
next(errorHandler(400, "user ID is obvious!"))
}

if (!jobId) {next(errorHandler(400, "jobId is required!"))}

  await applicationService.apply({
    userId,
    coveringLetter,
    jobId,
  });

  return res.status(201).json();
};

const getCandidateAppliedApplications = async (req: Request, res: Response) => {
  const { userId } = req as unknown as CustomRequest;

  const result = await applicationService.getCountOfApliedApplications(userId);

  return res.status(200).json(result);
};

const getCandidateApplications = async (req: Request, res: Response) => {
  const { userId } = req as unknown as CustomRequest;
  const { page } = req.query;

  const result = await applicationService.getCandidatesApplications({
    userId,
    page: Number(page),
  });

  return res.status(200).json(result);
};

const getCandidateApplciationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobApplicationId } = req.params;
  const result = await applicationService.getCandidateApplciationDetails({
    userId,
    jobApplicationId,
  });

  res.status(200).json(result);
};

const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;

  const result = await applicationService.getApplcations(jobId);

  res.status(200).json(result);
};

const getApplicationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { jobId, applicationId } = req.params;

  const result = await applicationService.getApplicationDetails({
    jobId,
    applicationId,
  });

  res.status(200).json(result);
};

const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { jobApplicationId } = req.params;
  const { status } = req.body;

  await applicationService.updateApplicationStatus({
    status,
    jobApplicationId,
  });

  res.status(200).json();
};

const getRecentApplications = async (req: Request, res: Response) => {
  const { userId } = req as unknown as CustomRequest;

  const result = await applicationService.getRecentApplications(userId);

  res.status(200).json(result);
};

export default {
  apply,
  getCandidateAppliedApplications,
  getCandidateApplications,
  getCandidateApplciationDetails,
  getApplications,
  getApplicationDetails,
  updateApplicationStatus,
  getRecentApplications,
};
