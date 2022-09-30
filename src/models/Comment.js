import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //object ID는 mongoose에서만 사용 가능
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" }, //object ID는 mongoose에서만 사용 가능
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
