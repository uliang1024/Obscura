let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById('video');
const recordButton = document.getElementById('recordBtn'); // 確保這裡的 ID 是 'recordBtn'
let isRecording = false;

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
      downloadRecording(url, 'recording.webm');
      URL.revokeObjectURL(url); // 釋放記憶體
    };

    recordButton.disabled = false; // 啟用錄製按鈕
  })
  .catch((err) => {
    console.error('Error accessing media devices.', err);
    recordButton.disabled = true; // 禁用錄製按鈕
  });

// 錄製按鈕事件處理
recordButton.addEventListener('click', () => {
  if (mediaRecorder) {
    if (isRecording) {
      mediaRecorder.stop();
    } else {
      recordedChunks = []; // 重置錄製的數據
      mediaRecorder.start();
    }
    isRecording = !isRecording;
    updateButtonText(isRecording); // 更新按鈕文字
  }
});

// 更新按鈕文字和圖標
function updateButtonText(isRecording) {
  if (isRecording) {
    recordButton.querySelector('span').textContent = 'Stop Recording';
    recordButton.querySelector('svg').innerHTML = '<rect x="6" y="6" width="12" height="12" fill="currentColor" />';
    recordButton.style.backgroundColor = '#e3342f'; // 紅色
    recordButton.style.borderColor = '#cc1f1a'; // 深紅色
  } else {
    recordButton.querySelector('span').textContent = 'Start Recording';
    recordButton.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="8" />';
    recordButton.style.backgroundColor = '#3490dc'; // 藍色
    recordButton.style.borderColor = '#2779bd'; // 深藍色
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