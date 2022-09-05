import mongoose from "mongoose";

mongoose.connect(proess.env.DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB");

db.on("error", (error) => console.log("DB ERROR", error));
db.once("open", handleOpen);
