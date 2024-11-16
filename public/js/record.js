let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById('video');
const recordButton = document.getElementById('recordBtn');
const overlay = document.getElementById('overlay'); // 新增遮罩元素
const clockElement = document.getElementById('clock'); // 時鐘元素
let isRecording = false;
let clockInterval;

// 獲取用戶的攝像頭和麥克風
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      downloadRecording(url, 'recording.mp4');
      URL.revokeObjectURL(url);
    };

    recordButton.disabled = false;
  })
  .catch((err) => {
    console.error('Error accessing media devices.', err);
    recordButton.disabled = true;
  });

// 錄製按鈕事件處理
recordButton.addEventListener('click', () => {
  if (mediaRecorder) {
    if (isRecording) {
      mediaRecorder.stop();
      overlay.style.display = 'none'; // 隱藏遮罩
      clearInterval(clockInterval); // 停止時鐘
      if (document.fullscreenElement) {
        document.exitFullscreen(); // 退出全螢幕
      }
    } else {
      recordedChunks = [];
      mediaRecorder.start();
      overlay.style.display = 'flex'; // 顯示遮罩
      startTime(); // 開始時鐘

      // 判斷裝置類型
      if (window.innerWidth < window.innerHeight) {
        // 手機裝置，旋轉時鐘
        clockElement.style.transform = 'rotate(90deg)';
      } else {
        // 桌面裝置，不旋轉
        clockElement.style.transform = 'rotate(0deg)';
      }

      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      }); // 進入全螢幕
    }
    isRecording = !isRecording;
    updateButtonText(isRecording);
  }
});

// 點擊遮罩停止錄製
overlay.addEventListener('click', () => {
  if (isRecording) {
    mediaRecorder.stop();
    overlay.style.display = 'none'; // 隱藏遮罩
    clearInterval(clockInterval); // 停止時鐘
    isRecording = false;
    updateButtonText(isRecording);
    if (document.fullscreenElement) {
      document.exitFullscreen(); // 退出全螢幕
    }
  }
});

// 更新按鈕文字和圖標
function updateButtonText(isRecording) {
  if (isRecording) {
    recordButton.querySelector('span').textContent = 'Stop Recording';
    recordButton.querySelector('svg').innerHTML = '<rect x="6" y="6" width="12" height="12" fill="currentColor" />';
    recordButton.style.backgroundColor = '#e3342f';
    recordButton.style.borderColor = '#cc1f1a';
  } else {
    recordButton.querySelector('span').textContent = 'Start Recording';
    recordButton.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="8" />';
    recordButton.style.backgroundColor = '#3490dc';
    recordButton.style.borderColor = '#2779bd';
  }
}

// 下載錄製的視頻
function downloadRecording(url, filename) {
  const a = document.createElement('a');
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
    const taiwanTime = now.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
    document.getElementById('clock').innerHTML = `<div>${taiwanTime}</div>`;
  }, 500);
}

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}