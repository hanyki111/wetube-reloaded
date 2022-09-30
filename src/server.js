import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

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

// text를 보내면 req.body에 넣어줌
// app.use(express.text());

// text를 보내 json 형식으로 이해 -> headers : { "Content-Type": "application/json",} 일 때.  --> Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

//express-session 사용
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());

app.use(localsMiddleware);

// 라우터 선언
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

app.disable("x-powered-by");

// app 설정함
// get request에 응답하는 방법 등등

export default app;
