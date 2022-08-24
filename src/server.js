import express from "express";

const PORT = 4000;

// app을 만듦
const app = express();

// app 설정함
// get request에 응답하는 방법 등등

//외부 접속을 listen함
const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}!`);

app.listen(4000, handleListening);
