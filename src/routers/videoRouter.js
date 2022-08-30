import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/upload", getUpload);
videoRouter.post("/upload", postUpload);
videoRouter.get("/:id", watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);

export default videoRouter;
