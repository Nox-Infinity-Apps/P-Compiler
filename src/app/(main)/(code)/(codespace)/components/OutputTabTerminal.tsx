import * as React from "react";
import useCodeState from "@/recoil/CodeState";
import Loading from "@/components/app/Loading";

export default function OutputTabTerminal() {
    const [state] = useCodeState();
    console.log(state);
    return (
        <div
            style={{
                fontFamily: "JetBrains Mono, monospace",
            }}
            className="w-full h-full relative text-[0.85rem] overflow-scroll"
        >
            {state.loading && <Loading />}
            <pre className="select-text text-gray-300">{state.output}</pre>
            <pre className="text-red-500 select-text">{state.err}</pre>
        </div>
    );
}
