const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  // 녹화버튼 비활성화
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  // ffmpeg mp4
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load(); // 사용자가 js가 아닌 코드(소프트웨어) 사용 : 무거울 수 있음 > await.

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile)); // 가상 컴퓨터에 파일 생성
  await ffmpeg.run("-i", files.input, "-r", "60", files.output); //가상 컴퓨터에 이미 존재하는 recording.webm 파일을 input으로 받음
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  ); // -ss > 특정 시간대 > 1초, -frames:v : 스크린샷
  const mp4File = ffmpeg.FS("readFile", files.output); // uint8 array
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input); //파일 삭제
  ffmpeg.FS("unlink", files.output); // 파일 링크 해제 > 들고있지 않음
  ffmpeg.FS("unlink", files.thumb);

  //url 삭제
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);

  // 녹화버튼 활성화
  actionBtn.addEventListener("click", handleDownload);
  actionBtn.innerText = "Recording";
  actionBtn.disabled = false;
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};
const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); //브라우저 메모리에서만 사용 가능한 url을 만들어 줌. 브라우저가 만듦.
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 10000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 320, height: 240 },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
