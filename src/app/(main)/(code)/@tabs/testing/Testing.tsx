import * as React from "react";
import TabHeader from "@/app/(main)/(code)/@tabs/components/TabHeader";
import TabContainer from "@/app/(main)/(code)/components/TabContainer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoAddOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { useEffect, useLayoutEffect, useState } from "react";
import useCompileCode from "@/mutations/useCompileCode";
import useProblemTabState from "@/recoil/TabState";
import useCodeState from "@/recoil/CodeState";
import useMainState from "@/recoil/MainState";
import useTestState from "@/recoil/TestState";

export default function Testing() {
    const [problemState] = useProblemTabState();
    const [{ source, lang }, setState] = useCodeState();
    const { mutateAsync: compile, isPending } = useCompileCode(lang.toString());
    const { setTerminalActiveIndex } = useMainState();
    const [test, setTest] = useTestState();

    useEffect(() => {
        setState((pre) => ({ ...pre, loading: isPending }));
    }, [isPending, setState]);

    const handleRunTest = React.useCallback(() => {
        compile({
            source_code: problemState.tab[problemState.activeTab]?.code,
            inputs: test.map((e) => e.input),
            outputs: test.map((e) => e.output),
        })
            .then((res) => {
                if (!res.data.std_err?.[0]) {
                    const newTest = [...test];
                    res.data.std_out.forEach((e, i) => {
                        newTest[i].reality_output = e;
                    });
                    setState((pre) => ({
                        ...pre,
                        output: "Xem ở bảng test...",
                        err: "",
                    }));
                    setTest(newTest);
                } else {
                    setState((pre) => ({
                        ...pre,
                        output: "",
                        err: res.data.std_err?.[0],
                    }));
                    setTerminalActiveIndex(2);
                }
            })
            .catch((e) => {
                alert("Lỗi khi chạy bộ test " + e.toString());
            });
    }, [
        compile,
        problemState.activeTab,
        problemState.tab,
        setState,
        setTerminalActiveIndex,
        setTest,
        test,
    ]);

    return (
        <TabContainer>
            <TabHeader>Thử nghiệm bộ Test</TabHeader>
            <div className="px-5 mt-2 grow">
                <div className="flex flex-col gap-3 h-full overflow-scroll px-2">
                    {test?.map(({ input, output, reality_output }, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <p className="uppercase text-xs">Test {i + 1}</p>
                            <Textarea
                                onChange={(e) => {
                                    setTest((pre) => {
                                        const nnow = structuredClone(pre);
                                        nnow[i].input = e.target.value;
                                        return nnow;
                                    });
                                }}
                                style={{
                                    fontSize: 12,
                                    fontFamily: "JetBrains Mono, monospace",
                                }}
                                className="test"
                                placeholder="Đầu vào"
                                value={input}
                            />
                            <Textarea
                                className="test"
                                style={{
                                    fontSize: 12,
                                    fontFamily: "JetBrains Mono, monospace",
                                }}
                                onChange={(e) => {
                                    setTest((pre) => {
                                        const nnow = structuredClone(pre);
                                        nnow[i].output = e.target.value;
                                        return nnow;
                                    });
                                }}
                                placeholder="Output kì vọng"
                                value={output}
                            />
                            <Textarea
                                disabled
                                style={{
                                    fontSize: 12,
                                    fontFamily: "JetBrains Mono, monospace",
                                    background: !reality_output
                                        ? undefined
                                        : reality_output.trim() == output.trim()
                                          ? "rgba(117,198,74,0.44)"
                                          : "rgba(218,139,139,0.48)",
                                }}
                                value={reality_output}
                                placeholder="Output thực tế"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row justify-between gap-2 shrink-0 grow-0 px-5 mb-5">
                <Button
                    onClick={() => {
                        setTest((pre) => [
                            ...pre,
                            { input: "", output: "", reality_output: "" },
                        ]);
                    }}
                    className="bg-[#10161d] hover:bg-[#10161d] border-white border-1 border"
                    size="sm"
                >
                    <IoAddOutline color="white" size={18} />
                </Button>
                <Button
                    onClick={handleRunTest}
                    className="bg-[#10161d] hover:bg-[#10161d] border-white border-1 border"
                    size="sm"
                >
                    <CiPlay1 color="white" size={18} />
                </Button>
            </div>
        </TabContainer>
    );
}
