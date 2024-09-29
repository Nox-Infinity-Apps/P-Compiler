import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        send: (channel: string, data: any) => ipcRenderer.send(channel, data),
        on: (channel: string, listener: (event: any, ...args: any[]) => void) =>
            ipcRenderer.on(channel, listener),
        removeListener: (
            channel: string,
            listener: (event: any, ...args: any[]) => void,
        ) => ipcRenderer.removeListener(channel, listener),
        removeAllListeners: (channel: string) =>
            ipcRenderer.removeAllListeners(channel),
    },
    platform: {
        isMac: () => process.platform === "darwin",
        isLinux: () => process.platform === "linux",
        isWindows: () => process.platform === "win32",
    },
    terminal: {
        startTerminal: (command: string) =>
            ipcRenderer.send("start-terminal", command),
        onTerminalOutput: (callback: any) =>
            ipcRenderer.on("terminal-output", callback),
        onTerminalError: (callback: any) =>
            ipcRenderer.on("terminal-error", callback),
    },
});
