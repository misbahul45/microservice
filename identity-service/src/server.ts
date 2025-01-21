import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/error.middleware';
import identityRouter from './routers/identity.route';
import { ErrorConfig } from './types/web.types';
import helmet from 'helmet';
import cors from 'cors'
import setUpCors from './utils/cors';
import Logger from './utils/logger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(helmet())
app.use(setUpCors())
app.use((req:Request, res:Response, next:NextFunction)=>{
  Logger.info(`Received ${req.method} request for ${req.url}`) 
  Logger.info( `Reques body, ${req.body}`)
  next()
})

// Route handler
app.use("/api", identityRouter.getRoutes());

app.use((err: ErrorConfig, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
