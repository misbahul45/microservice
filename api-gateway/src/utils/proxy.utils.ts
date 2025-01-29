import { NextFunction, Request, Response } from "express";
import Logger from "../utils/logger.utils";
import * as http from "http";
import proxy from "express-http-proxy";

const proxyOptions = {
    proxyReqPathResolver: (req: Request) => {
      return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler: (err: Error, res: Response, next:NextFunction) => {
      Logger.error(`Proxy error: ${err.message}`);
      res.status(500).json({
        message: `Internal server error`,
        error: err.message,
      });
    },
  };


  export default function identityProxy(){
    return proxy(process.env.IDENTITY_SERVICE_URL as string,{
            ...proxyOptions,
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                (proxyReqOpts.headers ??={})["Content-Type"] = "application/json";
                return proxyReqOpts;
            },
            userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
                Logger.info(
                  `Response received from Identity service: ${proxyRes.statusCode}`
                );
          
                return proxyResData;
              },
        }
    )
  }