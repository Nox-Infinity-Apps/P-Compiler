import * as React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useMonacoEx } from "monaco-editor-ex";
import languageCodes from "@/app/(main)/(code)/constants/Languages";
import useCodeState from "@/recoil/CodeState";
import useEditorState from "@/recoil/EditorState";
import useProblemTabState from "@/recoil/TabState";

type Props = {
    index: number;
};
export default function VsCodeEditor({ index }: Props) {
    const monaco = useMonaco();
    const [state, setState] = useCodeState();
    const [editorState] = useEditorState();
    const [problemState, setProblemState] = useProblemTabState();

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
    }, [monaco, index]);

    const lang = React.useMemo(() => {
        const keys = Object.keys(languageCodes);
        const inx = keys.findIndex(
            (i) => (languageCodes as any)[i].code == state.lang,
        );
        return keys[inx];
    }, [state.lang]);

    return (
        <Editor
            onChange={(e) => {
                setProblemState((pre) => {
                    const tab = structuredClone(pre.tab[index]);
                    tab.code = e || "";
                    return { ...pre, tab: [...pre.tab] };
                });
            }}
            value={problemState.tab[problemState.activeTab].code}
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
