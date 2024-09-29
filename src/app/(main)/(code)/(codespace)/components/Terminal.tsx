"use client";
import * as React from "react";
import { IoMdClose } from "react-icons/io";
import useMainState from "@/recoil/MainState";
import { useEffect, useLayoutEffect } from "react";
import useIsElectron from "@/shared/hooks/useIsElectron";
import { XTerm } from "xterm-for-react";
import { TERMINAL_TABS } from "@/app/(main)/(code)/constants/TerminalMenu";

const Terminal = React.memo(() => {
    const {
        state,
        handleCloseTerminal,
        handleOpenTerminal,
        setTerminalActiveIndex,
    } = useMainState();
    const isElectron = useIsElectron();
    const xtermRef = React.useRef<XTerm>(null);
    const [input, setInput] = React.useState("");

    const getTerminalContent = () => {
        const terminal = xtermRef.current?.terminal;
        if (!terminal) return "";

        const buffer = terminal.buffer.active;
        let content = "";

        for (let i = 0; i < buffer.length; i++) {
            const line = buffer.getLine(i);
            if (line) {
                content += line.translateToString() + "\n";
            }
        }

        return content;
    };

    useLayoutEffect(() => {
        if (isElectron)
            window.electron.terminal.onTerminalOutput(
                (event: any, data: any) => {
                    xtermRef.current?.terminal.write(data);
                },
            );
    }, []);

    React.useEffect(() => {
        xtermRef.current?.terminal.focus();
    }, [state[0]?.isOpenTerminal]);

    useEffect(() => {
        if (isElectron) {
            window.electron.ipcRenderer.on("open-terminal", () => {
                handleOpenTerminal();
            });

            window.electron.ipcRenderer.on("close-terminal", () => {
                handleCloseTerminal();
            });

            return () => {};
        }
    }, [handleCloseTerminal, handleOpenTerminal, isElectron]);

    return (
        <div className="bg-top-bar h-full border-t-[0.5px] border-t-gray-600 flex flex-col">
            <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex flex-row gap-x-6 items-center [&>button]:uppercase [&>button:hover]:text-gray-100 text-xs">
                    {TERMINAL_TABS.map((e, index) => (
                        <button
                            className={
                                index === state[0].terminalActiveIndex
                                    ? "text-white"
                                    : "text-gray-400"
                            }
                            onClick={() => setTerminalActiveIndex(index)}
                            key={e.title}
                        >
                            {e.title}
                        </button>
                    ))}
                </div>
                <div className="flex flex-row items-center [&>button]:uppercase [&>button]:text-gray-400 [&>button:hover]:text-gray-100 text-xs">
                    <button onClick={handleCloseTerminal}>
                        <IoMdClose className="text-[1rem]" />
                    </button>
                </div>
            </div>
            <div className="grow px-6">
                {TERMINAL_TABS[state[0].terminalActiveIndex]?.component !=
                null ? (
                    TERMINAL_TABS[state[0].terminalActiveIndex].component
                ) : (
                    <XTerm
                        options={{
                            fontSize: 14,
                            allowTransparency: true,
                            theme: {
                                background: "transparent",
                            },
                            windowOptions: {},
                        }}
                        onData={(data) => {
                            const code = data.charCodeAt(0);
                            if (code === 13 && input.length > 0) {
                                xtermRef.current?.terminal.write(
                                    "\r\nYou typed: '" + input + "'\r\n",
                                );
                                xtermRef.current?.terminal.write("echo> ");
                                setInput("");
                                console.log("enter", input);
                            } else if (code < 32 || code === 127) {
                                setInput((pre) =>
                                    pre.substring(0, pre.length - 1),
                                );
                            } else {
                                xtermRef.current?.terminal.write(data);
                                setInput(input + data);
                            }
                        }}
                        ref={xtermRef}
                    />
                )}
            </div>
        </div>
    );
});

export default Terminal;
