import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

// app을 만듦
const app = express();

// middleware

// 뷰 엔진 사용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// logger
app.use(morgan("dev"));

//express.urlencoded 사용
app.use(express.urlencoded({ extended: true }));

//express-session 사용
app.use(
  session({
    secret: process.env.COOCKE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);

// 라우터 선언
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.disable("x-powered-by");

// app 설정함
// get request에 응답하는 방법 등등

export default app;
