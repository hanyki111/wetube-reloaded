import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

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

// 라우터 선언
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.disable("x-powered-by");

// app 설정함
// get request에 응답하는 방법 등등

export default app;
