const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  // ffmpeg mp4
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load(); // 사용자가 js가 아닌 코드(소프트웨어) 사용 : 무거울 수 있음 > await.

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); // 가상 컴퓨터에 파일 생성
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); //가상 컴퓨터에 이미 존재하는 recording.webm 파일을 input으로 받음

  const mp4File = ffmpeg.FS("readFile", "output.mp4"); // uint8 array
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL();

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(); //브라우저 메모리에서만 사용 가능한 url을 만들어 줌. 브라우저가 만듦.
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

startBtn.addEventListener("click", handleStart);
