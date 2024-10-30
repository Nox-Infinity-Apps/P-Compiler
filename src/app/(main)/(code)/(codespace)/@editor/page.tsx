"use client";

import * as React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import useEditorState from "@/recoil/EditorState";
import useCodeState from "@/recoil/CodeState";
import useCodePTITState from "@/recoil/CodePTITState";
import useProblemTabState from "@/recoil/TabState";
import image from "@/assets/VSCode-Thick.png";
import Image from "next/image";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import VsCodeEditor from "@/app/(main)/(code)/(codespace)/@editor/components/VSCodeEditor";
import ProblemInfo from "@/app/(main)/(code)/(codespace)/@editor/components/ProblemInfo";

export default function Page() {
    const monaco = useMonaco();
    const [editorState] = useEditorState();
    const [state, setState] = useCodeState();
    const [codePTITState] = useCodePTITState();
    const [problemState] = useProblemTabState();

    if (problemState.tab.length === 0) {
        return (
            <div className="select-none size-full grid place-items-center">
                <Image width={300} src={image} alt="VSCode" />
            </div>
        );
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <VsCodeEditor index={problemState.activeTab} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
                <ProblemInfo />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
