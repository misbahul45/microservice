import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";
import { ErrorConfig } from "../types/web.types";



export const errorMiddleware = (
  err: ErrorConfig,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err.stack || "No stack available");
  return res.status(err.status || 500).send({
    status: false,
    message: err.message || "Internal Server Error",
  });
};

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
