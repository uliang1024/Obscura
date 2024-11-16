let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById("video");
const recordButton = document.getElementById("recordBtn");
const overlay = document.getElementById("overlay");
const clockElement = document.getElementById("clock");
const sectionElement = document.getElementById("home");
const toggleCamera = document.querySelector("input[type='checkbox']"); // 取得切換按鈕
let isRecording = false;
let clockInterval;
let currentStream;

// 創建 Canvas 元件
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// 獲取用戶的攝像頭和麥克風
function startCamera(facingMode = "user") {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode }, audio: true })
    .then((stream) => {
      currentStream = stream;
      videoElement.srcObject = stream;
      videoElement.play();

      // 設置 Canvas 尺寸
      videoElement.addEventListener("loadedmetadata", () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
      });

      // 繪製鏡像視頻到 Canvas
      function draw() {
        ctx.save();
        ctx.scale(-1, 1); // 水平翻轉
        ctx.drawImage(
          videoElement,
          -canvas.width,
          0,
          canvas.width,
          canvas.height
        );
        ctx.restore();
        requestAnimationFrame(draw);
      }
      draw();

      // 從 Canvas 獲取鏡像的視頻流
      const mirroredStream = canvas.captureStream();
      mediaRecorder = new MediaRecorder(mirroredStream);

      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        downloadRecording(url, "recording.mp4");
        URL.revokeObjectURL(url);
      };

      recordButton.disabled = false;
    })
    .catch((err) => {
      console.error("Error accessing media devices.", err);
      recordButton.disabled = true;
    });
}

// 初始化攝像頭
startCamera();

// 切換鏡頭
toggleCamera.addEventListener("change", () => {
  const facingMode = toggleCamera.checked ? "environment" : "user";
  startCamera(facingMode);
});

// 錄製按鈕事件處理
recordButton.addEventListener("click", () => {
  if (mediaRecorder) {
    if (isRecording) {
      stopRecording();
    } else {
      recordedChunks = [];
      mediaRecorder.start();
      sectionElement.style.display = "none"; // 隱藏 section
      overlay.style.display = "flex"; // 顯示遮罩
      startTime(); // 開始時鐘

      // 判斷裝置類型
      if (window.innerWidth < window.innerHeight) {
        // 手機裝置，旋轉時鐘
        clockElement.style.transform = "rotate(90deg)";
      } else {
        // 桌面裝置，不旋轉
        clockElement.style.transform = "rotate(0deg)";
      }
    }
    isRecording = !isRecording;
    updateButtonText(isRecording);
  }
});

// 點擊或觸控遮罩停止錄製
function stopRecording() {
  if (isRecording) {
    mediaRecorder.stop();
    sectionElement.style.display = "flex"; // 顯示 section
    overlay.style.display = "none"; // 隱藏遮罩
    clearInterval(clockInterval); // 停止時鐘
    isRecording = false;
    updateButtonText(isRecording);
    if (document.fullscreenElement) {
      document.exitFullscreen(); // 退出全螢幕
    }
  }
}

overlay.addEventListener("click", stopRecording);
overlay.addEventListener("touchstart", stopRecording); // 新增觸控事件

// 更新按鈕文字和圖標
function updateButtonText(isRecording) {
  if (isRecording) {
    recordButton.querySelector("span").textContent = "Stop Recording";
    recordButton.querySelector("svg").innerHTML =
      '<rect x="6" y="6" width="12" height="12" fill="currentColor" />';
    recordButton.style.backgroundColor = "#e3342f";
    recordButton.style.borderColor = "#cc1f1a";
  } else {
    recordButton.querySelector("span").textContent = "Start Recording";
    recordButton.querySelector("svg").innerHTML =
      '<circle cx="12" cy="12" r="8" />';
    recordButton.style.backgroundColor = "#3490dc";
    recordButton.style.borderColor = "#2779bd";
  }
}

// 下載錄製的視頻
function downloadRecording(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 時鐘功能
function startTime() {
  clockInterval = setInterval(() => {
    const now = new Date();
    const taiwanTime = now.toLocaleTimeString("zh-TW", {
      timeZone: "Asia/Taipei",
      hour12: false,
    });
    document.getElementById("clockText").innerHTML = taiwanTime;
  }, 500);
}

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}
