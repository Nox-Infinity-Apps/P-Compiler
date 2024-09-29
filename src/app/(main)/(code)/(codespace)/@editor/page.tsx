"use client";

import * as React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useMonacoEx } from "monaco-editor-ex";
import useEditorState from "@/recoil/EditorState";
import useCodeState from "@/recoil/CodeState";
import languageCodes from "@/app/(main)/(code)/constants/Languages";

export default function Page() {
    const monaco = useMonaco();
    const [editorState] = useEditorState();
    const [state, setState] = useCodeState();

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

    const lang = React.useMemo(() => {
        const keys = Object.keys(languageCodes);
        const inx = keys.findIndex(
            (i) => (languageCodes as any)[i].code == state.lang,
        );
        return keys[inx];
    }, [state.lang]);

    console.log("ad", lang);

    return (
        <Editor
            onChange={(e) => {
                setState((pre) => ({ ...pre, source: e || "" }));
            }}
            value={state.source}
            theme="vscode-ptit"
            key={lang}
            height="100%"
            defaultLanguage={lang}
            defaultValue=""
            options={{
                fontSize: editorState.fontSize,
                fontFamily: editorState.fontFamily,
                fontWeight: editorState.fontWeight,
            }}
        />
    );
}
