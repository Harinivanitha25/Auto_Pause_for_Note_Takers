async function isOn() {
  const { enabled = true } = await chrome.storage.local.get('enabled');
  return enabled;
}

async function showBadge() {
  const on = await isOn();
  chrome.action.setBadgeText({ text: on ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: on ? '#2e7d32' : '#9e9e9e' });
}

async function broadcast(type) {
  const tabs = await chrome.tabs.query({});
  for (const t of tabs) chrome.tabs.sendMessage(t.id, { type }).catch(() => {});
}

chrome.runtime.onInstalled.addListener(showBadge);
chrome.runtime.onStartup.addListener(showBadge);

// Shortcut OR toolbar icon click
chrome.action.onClicked.addListener(async () => {
  const on = await isOn();
  await chrome.storage.local.set({ enabled: !on });
  if (on) broadcast('idle');   // turning OFF: resume anything we paused
  showBadge();
});

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'typing' && !(await isOn())) return;
  broadcast(msg.type);
});