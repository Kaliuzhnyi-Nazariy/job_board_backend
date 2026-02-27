import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../helper/errorHandler";
import cvService from "../sevice/cv";
import { CustomRequest } from "../middlewares/interfaces";

const uploadCV = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;

  if (!req.file) {
    return next(errorHandler(400, "File is required"));
  }

  const resume = req.file;

  if (!resume.mimetype.includes("pdf")) {
    return next(errorHandler(400, "File must be pdf format"));
  }

  if (resume.size > 5 * 1024 * 1024) {
    return next(errorHandler(400, "File size must be lower than 5MB"));
  }

  const { filename } = req.body;

  try {
    const result = await cvService.uploadCV(userId, resume, filename);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteCV = async (req: Request, res: Response, next: NextFunction) => {
  const { filename, cvId } = req.body;

  if (!filename) {
    return next(errorHandler(400, "Filename is required"));
  }

  if (!cvId) {
    return next(errorHandler(400, "CV id is required"));
  }

  const { userId } = req as unknown as CustomRequest;

  try {
    await cvService.deleteCV(userId, cvId, filename + ".pdf");

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateCVFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return next(errorHandler(400, "File is required"));
  }

  const { filename, newFilename } = req.body;

  if (!filename) {
    return next(errorHandler(400, "Filename is required"));
  }

  const { cvId } = req.params;

  if (!cvId) {
    return next(errorHandler(400, "CV id is required"));
  }

  const { userId } = req as unknown as CustomRequest;

  try {
    const result = await cvService.updateCV(
      userId,
      cvId,
      req.file,
      filename + ".pdf",
      newFilename,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPresigndURL = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cvId } = req.params;

  if (!cvId) {
    return next(errorHandler(400, "CV id is required"));
  }

  const { userId } = req as unknown as CustomRequest;

  try {
    const link = await cvService.getPresignedURL(cvId, userId);

    res.status(200).json(link);
  } catch (error) {
    next(error);
  }
};

const getMyCVs = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as unknown as CustomRequest;

  try {
    const result = await cvService.getCVs(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { uploadCV, deleteCV, updateCVFile, getPresigndURL, getMyCVs };
