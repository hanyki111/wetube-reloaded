const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `  ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);

  videoComments.prepend(newComment);
  // prepend : 맨앞, appendChild : 맨뒤
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const videoId = videoContainer.dataset.videoid;
  const text = textarea.value;
  // 아무것도 입력하지 않으면 보내지 않음
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    // 이걸 알아먹게 하기 위해 단순 텍스트라면 express.text() 미들웨어 사용.
    // JS Object를 받아서 string으로 바꿔주어야 함 -> JSON.stringfy 사용. 단순히 string화 됨 : 프론트에서
    // 이걸 알아먹으려면 string으로 받아서 json object로 되돌려주는 JSON.parse 사용 : 백엔드에서
  }); // req.body를 fetch를 사용해서 만듦. fetch는 URL 변경 없이 없이 JS를 이용해 request를 보낼 수 있음

  if (response.status == 201) {
    // console.log("create fake comment")
    const json = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
