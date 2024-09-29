"use client";

import * as React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useMonacoEx } from "monaco-editor-ex";
import useEditorState from "@/recoil/EditorState";

export default function Page() {
    const monaco = useMonaco();
    const [editorState] = useEditorState();

    useEffect(() => {
        if (monaco) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useMonacoEx(monaco);
            monaco.editor.defineTheme("vscode-ptit", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "comment", foreground: "888888" },
                    { token: "keyword", foreground: "#c169d8" },
                    // { token: "string", foreground: "00ff00" },
                ],
                colors: {
                    "editor.background": "#171f2b",
                },
            });

            monaco.editor.setTheme("vscode-ptit");
        }
    }, [monaco]);

    return (
        <Editor
            theme="vscode-ptit"
            height="100%"
            defaultLanguage="python"
            defaultValue="# CODE"
            options={{
                fontSize: editorState.fontSize,
                fontFamily: editorState.fontFamily,
                fontWeight: editorState.fontWeight,
            }}
        />
    );
}
