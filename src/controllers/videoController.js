let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];

export const trending = (req, res) => {
  res.render("home.pug", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  console.log(id);

  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // database 이후 수정. 중요하지 않음

  videos[id - 1].title = title;

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // 비디오를 videos array에 추가
  const newVideo = {
    title: req.body.title,
    rating: 0,
    comments: 0,
    createAt: "just now",
    views: 1,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
