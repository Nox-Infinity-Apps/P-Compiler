import * as React from "react";
import { FaPlay } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { compileCode } from "@/app/(main)/(code)/actions/submit-action";
import useCodeState from "@/recoil/CodeState";
import useMainState from "@/recoil/MainState";
import { useEffect } from "react";
import useProblemTabState from "@/recoil/TabState";
import useCompileCode from "@/mutations/useCompileCode";

export default function CompileButton() {
    const [{ source, lang }, setState] = useCodeState();
    const { setTerminalActiveIndex } = useMainState();
    const [problemState] = useProblemTabState();

    const { mutateAsync: compile, isPending } = useCompileCode(lang.toString());

    const runCode = React.useCallback(() => {
        compile({
            source_code: problemState.tab[problemState.activeTab]?.code,
            inputs: ["a"],
            outputs: ["a"],
        }).then((data) => {
            setState((pre) => ({
                ...pre,
                output: data.data.std_out[0],
                err: data.data.std_err[0],
            }));
            setTerminalActiveIndex(2);
        });
    }, [
        compile,
        problemState.activeTab,
        problemState.tab,
        setState,
        setTerminalActiveIndex,
    ]);

    useEffect(() => {
        setState((pre) => ({
            ...pre,
            loading: isPending,
        }));
    }, [isPending, setState]);

    return (
        <button
            onClick={() => {
                runCode();
            }}
            className="flex gap-x-1 text-xs items-center px-2 text-green-500 hover:text-green-700 py-1 border hover:border-green-800 border-green-700 rounded-md"
        >
            <FaPlay className="text-xs text-green-600 hover:text-green-800" />
        </button>
    );
}
