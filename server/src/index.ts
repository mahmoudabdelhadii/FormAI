import express, {Application } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from "dirname-filename-esm";
import requestIp from 'request-ip';
import communityRouter from "./routers/community.route";
import usersRouter from "./routers/users.route";
import bodyParser from 'body-parser';
import { useragentMiddleware } from './middleware/userAgent';
import contextAuthRoutes from './routers/context-Data.route';
import { saveLogInfo } from './middleware/logger';
import passport from "passport";
import { search } from "./controllers/search.controller";
const port = process.env.NODE_PORT || 8080

// app
const app: Application = express();



// plugins
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is up and running!" });
  });

// routers
app.get("/search", search)
app.use("/community", communityRouter);
app.use('/auth', contextAuthRoutes);
app.use('/user', usersRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

export default app;
