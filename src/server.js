import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

// app을 만듦
const app = express();

// 뷰 엔진 사용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//
app.use(morgan("dev"));
// 라우터 선언
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.disable("x-powered-by");

// app 설정함
// get request에 응답하는 방법 등등

//외부 접속을 listen함
const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}!`);

app.listen(4000, handleListening);
