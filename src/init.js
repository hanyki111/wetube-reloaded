import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

//외부 접속을 listen함
const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}!`);

app.listen(PORT, handleListening);
