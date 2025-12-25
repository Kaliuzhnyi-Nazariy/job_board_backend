const errorMessages: Record<number, string> = {
  400: "Bad request!",
  401: "Unauthorized!",
  403: "Forbidden!",
  404: "Not found!",
  409: "Conflict!",
  500: "Server Error",
};

export interface CustomError extends Error {
  status: number;
}

export const errorHandler = (code: number, message = errorMessages[code]) => {
  //   const error = new Error(message);
  const error = new Error();
  error.message = message;
  (error as CustomError).status = code;
  return error;
};
