"use client";
import * as React from "react";
import SideBar from "@/app/(main)/(code)/components/SideBar";
import BottomBar from "@/app/(main)/(code)/components/BottomBar";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import useMainState from "@/recoil/MainState";
import { cn } from "@/lib/utils";
import SideBarContent from "@/app/(main)/(code)/components/SideBarContent";
import useIsElectron from "@/shared/hooks/useIsElectron";
import TopBar from "@/app/(main)/(code)/components/TopBar";
import useIsMac from "@/shared/hooks/useIsMac";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode;
    tabs: string[];
};

const queryClient = new QueryClient();

export default function Layout({ children }: Props) {
    const [sizeBar, saveSizeBar] = useLocalStorage("sidebar", 17);
    const {
        state: [{ sideBarActiveIndex }],
    } = useMainState();
    const isElectron = useIsElectron();
    const isMac = useIsMac();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="select-none w-screen h-screen flex flex-col bg-ide_bg fixed inset-0">
                {isElectron && isMac && <TopBar />}
                <div className="grow flex flex-row">
                    <SideBar
                        className={cn(
                            "w-[4rem] h-screen md:h-full border-r-[0.5px]",
                            isElectron && "w-[3.5rem]",
                        )}
                    />
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel
                            className={cn(
                                sideBarActiveIndex === -1 && "hidden",
                            )}
                            onResize={(num) => saveSizeBar(num)}
                            defaultSize={sizeBar || 17}
                            maxSize={30}
                            minSize={5}
                        >
                            <SideBarContent />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel>
                            <div className="size-full">{children}</div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <BottomBar />
            </div>
        </QueryClientProvider>
    );
}
