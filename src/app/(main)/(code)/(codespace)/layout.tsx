"use client";

import * as React from "react";
import TopBar from "@/app/(main)/(code)/(codespace)/components/TopBar";
import Terminal from "@/app/(main)/(code)/(codespace)/components/Terminal";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import useMainState from "@/recoil/MainState";
import { useLocalStorage } from "@uidotdev/usehooks";

type Props = {
    editor: React.ReactNode;
};

export default function Layout({
    children,
    editor,
}: React.PropsWithChildren<Props>) {
    const {
        state: [{ isOpenTerminal }],
    } = useMainState();
    const [sizeBar, saveSizeBar] = useLocalStorage("terminal_window", 30);

    return (
        <div className="size-full flex flex-col">
            <TopBar />
            <ResizablePanelGroup className="grow" direction="vertical">
                <ResizablePanel>{editor}</ResizablePanel>
                <ResizableHandle />
                {isOpenTerminal && (
                    <ResizablePanel
                        onResize={(n) => saveSizeBar(n)}
                        defaultSize={sizeBar}
                    >
                        <Terminal />
                    </ResizablePanel>
                )}
            </ResizablePanelGroup>
        </div>
    );
}
