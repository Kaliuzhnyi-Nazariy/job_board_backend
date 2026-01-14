import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/interfaces";
import applicationService from "../sevice/application";

const apply = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;
  const { jobId } = req.params;
  const { coveringLetter } = req.body;

  await applicationService.apply({
    userId,
    coveringLetter,
    jobId,
  });

  return res.status(201).json();
};

const getCandidateApplies = async (req: Request, res: Response) => {
  const { userId } = req as unknown as CustomRequest;

  const result = await applicationService.getCandidatesApplies(userId);

  return res.status(200).json(result);
};

export default { apply, getCandidateApplies };
