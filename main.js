// eslint-disable-next-line import-x/no-extraneous-dependencies
import { app, BrowserWindow, Menu, dialog, ipcMain, shell } from "electron";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import * as path from "path";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const resourcesPath = app.isPackaged
  ? process.resourcesPath
  : path.join(__dirname);
console.log(resourcesPath);

const packageInfo = JSON.parse(
  await fs.readFile(path.join(resourcesPath, "package.json"), "utf8"),
);

let currentZoom = 1.0;
const zoomFactor = 0.1; // 10% zoom in/out

let mainWindow;

// development vs. production has different process.argv
// https://github.com/electron/electron/issues/4690
if (app.isPackaged) {
  process.argv.unshift(null);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.key.toLowerCase() === "i") {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });
}

function createAppMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          accelerator: "CmdOrCtrl+O",
          click: () => handleFileOpen(),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Zoom In",
          accelerator: "CommandOrControl+=",
          click: () => {
            currentZoom += zoomFactor;
            mainWindow.webContents.setZoomFactor(currentZoom);
          },
        },
        {
          label: "Zoom Out",
          accelerator: "CommandOrControl+-",
          click: () => {
            currentZoom = Math.max(0.2, currentZoom - zoomFactor);
            mainWindow.webContents.setZoomFactor(currentZoom);
          },
        },
        {
          label: "Reset Zoom",
          accelerator: "CommandOrControl+0",
          click: () => {
            currentZoom = 1.0;
            mainWindow.webContents.setZoomFactor(currentZoom);
          },
        },
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://openscd.org");
          },
        },
        {
          label: "Documentation",
          click: async () => {
            await shell.openExternal(
              "https://github.com/OMICRONEnergyOSS/oscd-ce",
            );
          },
        },
        {
          label: "Dev Tools",
          accelerator: "CommandOrControl+Shift+I",
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: "About",
          click: () => {
            dialog.showMessageBoxSync({
              title: "About",
              message: `${packageInfo.build?.productName ?? "Unknown"} v${
                packageInfo.version ?? "Unknown"
              }`,
              detail: `${
                packageInfo.description ?? "Unknown"
              }\n\nCopyright © ${new Date().getFullYear()} ${
                packageInfo.author ?? "Unknown"
              }`,
              buttons: ["OK"],
              icon: "./build/icons/png/512x512.png",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      {
        name: "SCL Files",
        extensions: ["scd", "icd", "iid", "ssd", "cid", "sed"],
      },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!canceled) {
    mainWindow.webContents.send(
      "file-opened",
      path.basename(filePaths[0]),
      filePaths[0],
    );
  }
}

ipcMain.handle("read-file", async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
});

ipcMain.handle("dialog:openFile", handleFileOpen);

ipcMain.handle("zoom", (_event, direction) => {
  if (direction === "in") {
    currentZoom += zoomFactor;
  } else if (direction === "out") {
    currentZoom = Math.max(0.2, currentZoom - zoomFactor);
  }
  if (mainWindow) {
    mainWindow.webContents.setZoomFactor(currentZoom);
  }
  return currentZoom;
});

app.whenReady().then(() => {
  createWindow();
  createAppMenu();

  const inputFilePath = process.argv[2];
  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    if (inputFilePath) {
      mainWindow.webContents.send(
        "file-opened",
        path.basename(inputFilePath),
        inputFilePath,
      );
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
