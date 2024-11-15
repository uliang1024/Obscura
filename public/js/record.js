let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById('video');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');

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
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      // 創建一個隱藏的<a>元素來觸發下載
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a); // 必須將<a>元素添加到DOM中
      a.click(); // 觸發下載
      document.body.removeChild(a); // 下載後移除<a>元素

      // 釋放記憶體
      URL.revokeObjectURL(url);
    };

    // 啟用開始按鈕
    startButton.disabled = false;
  })
  .catch((err) => {
    console.error('Error accessing media devices.', err);

    // 禁用開始按鈕
    startButton.disabled = true;
  });

// 開始錄影
startButton.addEventListener('click', () => {
  if (mediaRecorder) {
    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
  }
});

// 停止錄影
stopButton.addEventListener('click', () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
  }
});
