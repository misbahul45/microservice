import express,{ Express } from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import helmet from 'helmet';
import { ratelimitOption } from './utils/rate.limitting.utils';
import Logger from './utils/logger.utils';
import identityProxy from './utils/proxy.utils';

dotenv.config();

const app : Express = express();
const port = process.env.PORT


app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(ratelimitOption)
app.use((req, res, next) => {
  Logger.info(`Received ${req.method} request to ${req.url}`);
  Logger.info(`Request body, ${req.body}`);
  next();
});


// Route handler proxy for identity service

app.use('/v1/auth/',identityProxy())

app.listen(port, () => {
  console.log(`⚡️[server]: api-gateway is running at http://localhost:${port}`);
});
