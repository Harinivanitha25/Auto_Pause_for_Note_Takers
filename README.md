# Auto_Pause_for_Note_Takers
A Chrome and Edge extension that pauses a video while you type notes and plays it again when you stop. It works on any site that uses an HTML5 video. The notes can be in a different tab or window from the video, so it fits a split-screen setup with your notes on one side and the course on the other.

## How it works
The extension has three parts. A content script runs on every page. When you type in a text field, it tells the background script that you are typing. The background script forwards the message to all open tabs, and the tab with a playing video pauses it. When you stop typing for 2 seconds, the same path sends an idle message, and the video rewinds 2 seconds and plays.
The extension only resumes a video that it paused itself. If you pause a video by hand, typing will not start it again.

## Install
The extension is not on the Chrome Web Store, so you load it as an unpacked extension.
1. Clone this repository or download it as a ZIP and unzip it.
2. Open `chrome://extensions` in Chrome, or `edge://extensions` in Edge.
3. Turn on Developer mode.
4. Click Load unpacked and select the project folder, the one that contains `manifest.json`.

## Usage
1. Open your notes page in one tab or window and the video course in another. Placing them side by side works well.
2. Reload both pages. Chrome only injects the content script into pages opened after the extension was installed or reloaded, so this step is required the first time and after every code change.
3. Check that the toolbar icon shows ON.
4. Play the video and start typing in your notes. The video pauses, and it plays again after you stop.
To switch the feature off, click the toolbar icon or press Alt+Shift+P. You can change the shortcut at `chrome://extensions/shortcuts`.

## Configuration
Both settings are in `content.js`.
- `IDLE_MS` is the wait in milliseconds after your last keystroke before the video resumes. The default is `2000`. A value between 3000 and 4000 suits slower note-taking.
- The rewind on resume is the `- 2` in `pausedVideo.currentTime - 2`. Set it to `0` to turn the rewind off.

## Project files
```
manifest.json   Extension settings: permissions, toolbar icon, shortcut, and where the content script runs
background.js   Handles the ON/OFF toggle and the badge, and forwards typing and idle messages to all tabs
content.js      Detects typing on the notes page and pauses or resumes the video on the video page
```

## Troubleshooting
Nothing happens when I type: reload the extension at `chrome://extensions`, then refresh both the notes tab and the video tab. Confirm the badge says ON.
It works in a normal window but not in Incognito: open the extension's details page and enable Allow in Incognito.
To see what the extension is doing, open the browser console (F12) on each tab. The notes tab logs `[type-pause] typing` while you type, and the video tab logs `[type-pause] pausing video` and `[type-pause] resuming video`. For background errors, click the service worker link on the extension's card at `chrome://extensions`.

## Limitations
- The notes must be in the browser. A browser extension cannot see keystrokes in desktop apps such as Notepad or OneNote desktop.
- Typing in any text field on any open tab pauses the video, including a search box on the video page itself.
- It works in Chromium-based browsers that support Manifest V3, such as Chrome and Edge.

## Privacy
The extension does not collect, store, or send any data about the pages you visit or what you type. The only thing it saves is the ON/OFF setting, which stays in your browser through `chrome.storage`.
