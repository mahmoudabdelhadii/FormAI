import express, {Application } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from "dirname-filename-esm";
import requestIp from 'request-ip';
import usersRouter from "./routers/users";

const port = process.env.NODE_PORT || 3000

// app
const app: Application = express();



// plugins
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(requestIp.mw());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// routers
app.use("/users", usersRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

export default app;
