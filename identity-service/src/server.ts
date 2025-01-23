import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/error.middleware';
import identityRouter from './routers/identity.route';
import { ErrorConfig } from './types/web.types';
import helmet from 'helmet';
import setUpCors from './utils/cors';
import Logger from './utils/logger';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { rateLimit } from 'express-rate-limit'
import RedisStore from 'rate-limit-redis';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const redisClient=new Redis(process.env.REDIS_URL as string)

//ddos protection
const RateLimiter=new RateLimiterRedis({
  storeClient:redisClient,
  keyPrefix:"middleware",
  points:10,
  duration:1
})

//api base rate limitter
const sensitiveEndpointRouter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders:true,
  legacyHeaders:false,
  handler:(req, res)=>{
    Logger.warn(`Rate limit exceeded for IP ${req.ip}`)
    return res.status(429).send({
      status:false,
      message:"Rate limit exceeded"
    })
  },
  store: new RedisStore({
    sendCommand: async (...args: [string, ...string[]]): Promise<any> => {
      const result = await redisClient.call(...args);
      return result;
    },
  }),
});

// Middleware
app.use(express.json());
app.use(helmet())
app.use(setUpCors())
app.use((req:Request, res:Response, next:NextFunction)=>{
  Logger.info(`Received ${req.method} request for ${req.url}`) 
  Logger.info( `Reques body, ${req.body}`)
  next()
})
app.use((req:Request, res:Response, next:NextFunction)=>{
  RateLimiter.consume(req.ip!)
  .then(()=>next())
  .catch(()=>{
    Logger.warn(`Rate limit exceeded for IP ${req.ip}`)
    return res.status(429).send({
      status:false,
      message:"Rate limit exceeded"
    })
  })
})

//sensitive endpoint
app.use('/api/auth/register',sensitiveEndpointRouter)

// Route handler
app.use("/api/auth",identityRouter.getRoutes());
app.use((err: ErrorConfig, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});


//unhandle promise ejector
process.on('unhandledRejection', (err:any) => {
  Logger.error(err.stack || "No stack available");
})

//running
app.listen(port, () => {
  Logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});

