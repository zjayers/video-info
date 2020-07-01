/* Import Modules */
const electron = require("electron");

const path = require("path");

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});
const ffmpeg = require("fluent-ffmpeg");
/* Destructure off the 'app' process from electron */
const { app, BrowserWindow, screen, ipcMain } = electron;

let mainWindow;

/* Wait for app to be ready before starting work */
// app.on("ready", () => {});
app.whenReady().then(async () => {
  let display = screen.getAllDisplays()[2];

  if (display) {
    mainWindow = new BrowserWindow({
      x: display.bounds.x + 50,
      y: display.bounds.y + 50,
      webPreferences: {
        nodeIntegration: true,
      },
    });
  }
  await mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (e, videoPath) => {
  ffmpeg.ffprobe(videoPath, (error, metadata) => {
    mainWindow.webContents.send("video:metadata", metadata.format.duration);
  });
});
