import { ipcRenderer } from "electron";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ELECTRON: string;
        }
    }

    interface Window {
        electron: {
            ipcRenderer: {
                on: (channel: string, data: any) => any;
                send: (channel: string, listener: any) => void;
                removeListener: (
                    channel: string,
                    listener?: (event: any, ...args: any[]) => void,
                ) => void;
                removeAllListeners: (channel: string) => void;
            };
            platform: {
                isMac: () => boolean;
                isLinux: () => boolean;
                isWindows: () => boolean;
            };
            terminal: {
                startTerminal: (command: string) => void;
                onTerminalOutput: (callback: any) => void;
                onTerminalError: (callback: any) => void;
            };
        };
    }
}

export {};
