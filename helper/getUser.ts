import { CustomRequest } from "../middlewares/interfaces";
import { errorHandler } from "./errorHandler";

export const getUser = (req: CustomRequest) => {
  const userId = req.userId;

  if (!userId) {
    throw errorHandler(401);
  }

  return userId;
};
