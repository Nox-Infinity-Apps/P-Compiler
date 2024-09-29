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
            className="w-full h-full relative "
        >
            {state.loading && <Loading />}
            <pre className="text-xs select-text">{state.output}</pre>
            <pre className="text-xs text-red-500 select-text">{state.err}</pre>
        </div>
    );
}
