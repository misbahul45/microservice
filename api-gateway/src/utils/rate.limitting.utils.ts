import {rateLimit} from 'express-rate-limit';
import Logger from './logger.utils';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

const redisClient=new Redis(process.env.REDIS_URL as string)

export const ratelimitOption=rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler:(req,res)=>{
        Logger.warn(`Rate limit exceeded for IP ${req.ip}`)
        res.status(429).send({
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
})