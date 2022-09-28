const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;

const handleDownload = () => {};

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
    const videoFile = URL.createObjectURL(); //브라우저 메모리에서만 사용 가능한 url을 만들어 줌. 브라우저가 만듦.
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
