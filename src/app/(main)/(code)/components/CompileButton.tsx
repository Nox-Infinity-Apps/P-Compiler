import * as React from "react";
import { FaPlay } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { compileCode } from "@/app/(main)/(code)/actions/submit-action";
import useCodeState from "@/recoil/CodeState";
import useMainState from "@/recoil/MainState";
import { useEffect } from "react";

export default function CompileButton() {
    const [{ source, lang }, setState] = useCodeState();
    const { setTerminalActiveIndex } = useMainState();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => compileCode(source, lang),
        mutationKey: ["COMPILE"],
        onSuccess: (data) => {
            setState((pre) => ({
                ...pre,
                output: data.data.stdout,
                err: data.data.stderr || data.data.compile_output,
            }));
            setTerminalActiveIndex(2);
        },
    });

    useEffect(() => {
        setState((pre) => ({
            ...pre,
            loading: isPending,
        }));
    }, [isPending, setState]);

    return (
        <button
            onClick={() => {
                mutate();
                console.log("ok");
            }}
            className="flex gap-x-1 text-xs items-center px-2 text-green-500 hover:text-green-700 py-1 border hover:border-green-800 border-green-700 rounded-md"
        >
            <FaPlay className="text-xs text-green-600 hover:text-green-800" />
            Run
        </button>
    );
}
