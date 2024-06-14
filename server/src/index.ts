import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import requestIp from 'request-ip';
import bodyParser from 'body-parser';
import { useragentMiddleware } from './middleware/userAgent';
import contextAuthRoutes from './routers/context-Data.route';
import { saveLogInfo } from './middleware/logger';
import passport from "./config/Passport";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import compression from "compression";
import communityRouter from "./routers/community.route";
import usersRouter from "./routers/users.route";
import { search } from "./controllers/search.controller";
import awsRouter from "./routers/auth.route";
import postsRouter from "./routers/posts.route";
import leaderboardRouter from "./routers/leaderboard.route";

const port = process.env.NODE_PORT || 8080;
const swaggerDocument = YAML.load('swagger.yml');

// app
const app: Application = express();

// plugins
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(compression());
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));
app.use(cookieParser());
app.use(passport.initialize());
// app.use(cors()); // Add CORS middleware if needed

// routers
app.get("/search", search);
app.use("/community", communityRouter);
app.use('/auth', contextAuthRoutes);
app.use('/user', usersRouter);
app.use('/post', postsRouter);
app.use("/aws", awsRouter);
app.use('/leaderboard', leaderboardRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

// error handling for large file sizes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large' });
  }
  next(err);
});

// default error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

export default app;
