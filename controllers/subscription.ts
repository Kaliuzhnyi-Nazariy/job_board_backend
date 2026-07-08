import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../helper/contrlWrapper";
import subscriptionService from "../sevice/subscription";
import { getUser } from "../helper/getUser";
import { errorHandler } from "../helper/errorHandler";

const getMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUser(req);

  const mySubscription = await subscriptionService.getMySubscription({
    userId,
  });

  res.status(200).json(mySubscription);
};

const getSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await subscriptionService.getAllSubscriptions();

  res.status(200).json(result);
};

const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUser(req);

  const { url } = await subscriptionService.subscribe({
    userId,
    subscriptionId: req.body.subscriptionId,
  });

  res.status(201).json({ url });
};

const subscribeHook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || signature === undefined) {
    return res.status(500).json({ message: "no signature" });
  }

  const sign = Array.isArray(signature) ? signature[0] : signature;
  await subscriptionService.subscribeHook(req.body, sign);

  res.sendStatus(201);
};

const cancel = async (req: Request, res: Response, next: NextFunction) => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    throw errorHandler(400, "No subscription sent");
  }

  const id = Array.isArray(subscriptionId) ? subscriptionId[0] : subscriptionId;

  const canceledPlan = await subscriptionService.cancelSubscribe(id as string);

  res.status(200).json(canceledPlan);
};

const getSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    throw errorHandler(400, "No subscription sent");
  }

  const id = Array.isArray(subscriptionId) ? subscriptionId[0] : subscriptionId;

  const data = await subscriptionService.getSubscription(id);

  res.status(200).json(data);
};

const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUser(req);

  const result = await subscriptionService.getInvoices({ userId });

  res.status(200).json(result);
};

export default {
  getMy: contrlWrapper(getMy),
  getSubscriptions: contrlWrapper(getSubscriptions),
  subscribe: contrlWrapper(subscribe),
  subscribeHook: contrlWrapper(subscribeHook),
  cancel: contrlWrapper(cancel),
  getSubscriptionById: contrlWrapper(getSubscriptionById),
  getInvoices: contrlWrapper(getInvoices),
};
