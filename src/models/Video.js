import mongoose from "mongoose";

// 스키마 작성 : 데이터 형식 지정
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //object ID는 mongoose에서만 사용 가능
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

// videoSchema.pre("save", async function () {
//   // this : 저장하고자 하는 document
//   // console.log(`We are about to save : `, this);
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.static("changePathBackslash", function (urlPath) {
  return urlPath.replace(/[\\]/g, "/");
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
