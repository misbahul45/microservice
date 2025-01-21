import { Request, Response } from "express";
import Logger from "../utils/logger";
import { WEBRESPONSE } from "../types/web.types";

interface ErrorConfig{
    status:number;
    message:string
    stack?:string
}

export const errorMiddleware=(err:ErrorConfig, req:Request, res:Response ) : Response<WEBRESPONSE> =>{
    Logger.error(err.stack);
    return res.status(err.status).send({
        status:false,
        message:err.message,
    })
}

export class AppError extends Error {
    status: number;
  
    constructor(message: string, status: number = 500) {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }