import * as React from "react";
import { FaPlay } from "react-icons/fa";
import useCodeState from "@/recoil/CodeState";
import { useMutation } from "@tanstack/react-query";
import { compileCode } from "@/app/(main)/(code)/actions/submit-action";
import useMainState from "@/recoil/MainState";
import { useEffect } from "react";

export default function TopBar() {
    const [{ source, lang }, setState] = useCodeState();
    const { setTerminalActiveIndex } = useMainState();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => compileCode(source, lang),
        mutationKey: ["COMPILE"],
        onSuccess: (data) => {
            setState((pre) => ({
                ...pre,
                output: data.data.stdout,
                err: data.data.stderr,
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
        <div className="font-medium h-9 bg-top-pbar flex justify-end w-full items-center px-2 gap-x-4 py-0.5">
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
            <img
                src="https://picsum.photos/200"
                className="h-6 aspect-square rounded-full cursor-pointer border border-gray-600"
                alt="Avatar"
            />
        </div>
    );
}
