import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import { join } from "path";
import { spawn } from "node:child_process";

const isMac = process.platform === "darwin";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            devTools: true,
            nodeIntegration: false,
            contextIsolation: true,
        },
        minWidth: 600,
        minHeight: 600,
        titleBarStyle: "hiddenInset",
    });

    const template = [
        ...(isMac
            ? [
                  {
                      label: "P-Compiler",
                      submenu: [
                          { role: "about" },
                          { type: "separator" },
                          { role: "services" },
                          { type: "separator" },
                          { role: "hide" },
                          { role: "hideOthers" },
                          { role: "unhide" },
                          { type: "separator" },
                          { role: "quit" },
                      ],
                  },
              ]
            : []),
        {
            label: "File",
            submenu: [isMac ? { role: "close" } : { role: "quit" }],
        },
        {
            label: "Edit",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                ...(isMac
                    ? [
                          { role: "pasteAndMatchStyle" },
                          { role: "delete" },
                          { role: "selectAll" },
                          { type: "separator" },
                          {
                              label: "Speech",
                              submenu: [
                                  { role: "startSpeaking" },
                                  { role: "stopSpeaking" },
                              ],
                          },
                      ]
                    : [
                          { role: "delete" },
                          { type: "separator" },
                          { role: "selectAll" },
                      ]),
            ],
        },
        {
            label: "View",
            submenu: [
                { type: "separator" },
                { role: "resetZoom" },
                { role: "zoomIn" },
                { role: "zoomOut" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
        {
            label: "Terminal",
            submenu: [
                {
                    label: "Open terminal",
                    click: () => {
                        mainWindow.webContents.send(
                            "open-terminal",
                            "Hello from Menu!",
                        );
                    },
                },
            ],
        },
        {
            label: "Window",
            submenu: [
                { role: "minimize" },
                { role: "zoom" },
                ...(isMac
                    ? [
                          { type: "separator" },
                          { role: "front" },
                          { type: "separator" },
                          { role: "window" },
                      ]
                    : [{ role: "close" }]),
            ],
        },
        {
            role: "help",
            submenu: [
                {
                    label: "Learn More",
                    click: async () => {
                        await shell.openExternal("https://electronjs.org");
                    },
                },
            ],
        },
    ];

    // const menu = Menu.buildFromTemplate(template as any);
    // Menu.setApplicationMenu(menu);

    mainWindow.on("ready-to-show", () => mainWindow.show());

    const loadURL = async () => {
        if (is.dev) {
            mainWindow.loadURL("http://116.118.51.244:3000");
        } else {
            try {
                const port = await startNextJSServer();
                console.log("Next.js server started on port:", port);
                mainWindow.loadURL(`http://localhost:${port}`);
            } catch (error) {
                console.error("Error starting Next.js server:", error);
            }
        }
    };

    mainWindow.maximize();
    loadURL();
    return mainWindow;
};

const startNextJSServer = async () => {
    try {
        const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
        const webDir = join(app.getAppPath(), "app");

        await startServer({
            dir: webDir,
            isDev: false,
            hostname: "localhost",
            port: nextJSPort,
            customServer: true,
            allowRetry: false,
            keepAliveTimeout: 5000,
            minimalMode: true,
        });

        return nextJSPort;
    } catch (error) {
        console.error("Error starting Next.js server:", error);
        throw error;
    }
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.on("ping", () => console.log("pong"));
    ipcMain.on("start-terminal", (event, command) => {
        let terminal;
        if (process.platform === "win32") {
            terminal = spawn("cmd.exe");
        } else {
            terminal = spawn("zsh");
        }

        terminal.stdout.on("data", (data) => {
            event.sender.send("terminal-output", data.toString());
        });

        terminal.stderr.on("data", (data) => {
            event.sender.send("terminal-error", data.toString());
        });

        terminal.stdin.write(command + "\n");
    });
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
