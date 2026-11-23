const IDLE_MS = 3000;           // resume after 2 seconds of no typing
let timer = null;
let pausedVideo = null;

const isEditable = el =>
  el && (el.isContentEditable || /^(TEXTAREA|INPUT)$/.test(el.tagName));

// Detect typing in a notes field
document.addEventListener('keydown', e => {
  if (!isEditable(document.activeElement)) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

  chrome.runtime.sendMessage({ type: 'typing' });
  clearTimeout(timer);
  timer = setTimeout(() => chrome.runtime.sendMessage({ type: 'idle' }), IDLE_MS);
}, true);

// Control the video (in whichever tab/frame has one)
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'typing' && !pausedVideo) {
    const v = [...document.querySelectorAll('video')].find(x => !x.paused);
    if (v) { v.pause(); pausedVideo = v; }
  }
  if (msg.type === 'idle' && pausedVideo) {
    pausedVideo.currentTime = Math.max(0, pausedVideo.currentTime); // small rewind
    pausedVideo.play();
    pausedVideo = null;
  }
});