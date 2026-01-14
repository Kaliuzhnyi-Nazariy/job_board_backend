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

export default { apply };
