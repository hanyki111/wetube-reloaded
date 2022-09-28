import { Schema } from "mongoose";
import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  // console.log(videos);
  return res.render("home.pug", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  // const uploader = await User.findById(video.owner);
  // mongoose 의 ref에서 언급하고 있기 때문에 변경.
  const video = await Video.findById(id).populate("owner");

  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  }
  return res.render("404", { pageTitle: "Video not found." });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    // video 가 null일 경우
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    //영상 소유주 외의 사람이 edit 접근 시
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.exists({ _id: id });
  if (!video) {
    // video 가 null일 경우
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // video가 null 이 아닐 경우
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  if (String(video.owner) !== String(req.session.user._id)) {
    //영상 소유주 외의 사람이 edit 접근 시
    return res.status(403).redirect("/");
  }

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const sessionuser = req.session.user;
  const file = req.file;
  const { title, description, hashtags } = req.body;

  try {
    const newVideo = await Video.create({
      title: title,
      description: description,
      fileUrl: file.path,
      owner: sessionuser._id,
      createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
    }); // model.save() 는 promise를 리턴함. document가 리턴됨
    const user = await User.findById(sessionuser._id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    // video 가 null일 경우 : video를 찾지 못한 경우
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    //영상 소유주 외의 사람이 edit 접근 시
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    // 키워드가 존재한다 -> search
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    // video를 찾지 못하면
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
