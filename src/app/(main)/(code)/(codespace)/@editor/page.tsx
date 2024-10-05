"use client";

import * as React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useMonacoEx } from "monaco-editor-ex";
import useEditorState from "@/recoil/EditorState";
import useCodeState from "@/recoil/CodeState";
import languageCodes from "@/app/(main)/(code)/constants/Languages";
import useCodePTITState from "@/recoil/CodePTITState";
import useProblemTabState from "@/recoil/TabState";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import SideBarContent from "@/app/(main)/(code)/components/SideBarContent";
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
            <div className="size-full grid place-items-center">
                <p>No tab</p>
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
