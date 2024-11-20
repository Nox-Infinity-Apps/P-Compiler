import * as React from "react";
import TabHeader from "@/app/(main)/(code)/@tabs/components/TabHeader";
import TabContainer from "@/app/(main)/(code)/components/TabContainer";
import { Textarea } from "@/components/ui/textarea";
import useProblemTabState from "@/recoil/TabState";
import useAskGemini from "@/mutations/useAskGemini";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import useProblemInfo from "@/queries/useProblemInfo";
import languageCodes from "@/app/(main)/(code)/constants/Languages";
import useCodeState from "@/recoil/CodeState";

const GeminiTab = React.memo(() => {
    const inputRef = useRef<React.ComponentRef<typeof Textarea>>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [problemState, setProblemState] = useProblemTabState();
    const [state, setState] = useCodeState();

    const lang = React.useMemo(() => {
        const keys = Object.keys(languageCodes);
        const inx = keys.findIndex(
            (i) => (languageCodes as any)[i].code == state.lang,
        );
        return keys[inx];
    }, [state.lang]);

    const { data: problemData } = useProblemInfo(
        problemState.tab[problemState.activeTab]?.problemId,
        problemState.tab[problemState.activeTab]?.courseId,
    );
    const { mutateAsync, isPending } = useAskGemini();

    const messages = React.useMemo(() => {
        return problemState.tab[problemState.activeTab]?.gemini?.history || [];
    }, [problemState.activeTab, problemState.tab]);

    const sendMessage = React.useCallback(async () => {
        messageContainerRef.current?.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
        const tabs = problemState.tab.map((tab, index) => {
            if (index === problemState.activeTab) {
                return {
                    ...tab,
                    gemini: {
                        ...tab.gemini,
                        input: "",
                        history: [
                            ...(tab.gemini?.history || []),
                            {
                                role: "user",
                                message: tab.gemini.input,
                            },
                        ],
                    },
                };
            }
            return tab;
        });

        setProblemState((prev) => {
            return {
                ...prev,
                tab: tabs as any,
            };
        });

        mutateAsync({
            source_code: problemState.tab[problemState.activeTab].code,
            msg: problemState.tab[problemState.activeTab].gemini.input,
            chatHistory: [
                {
                    role: "user",
                    parts: [
                        `Đây là cuộc hội thoại để trao đổi, nhờ bạn giúp về một vấn đề giải bài tập lập trình bằng ngôn ngữ ${lang}. Đề bài như sau ${String(problemData?.data?.hmtl)} và hiện tại code của tôi là ${problemState.tab[problemState.activeTab].code}. Dưới đây sẽ là cuộc hội thoại hỏi đáp về bài toán và đoạn code của người dùng. Nếu đoạn code trống hoặc vô nghĩa, bạn không cần để tâm mà chỉ tập chung giải đáp và đưa ra giải pháp để người dùng hoàn thành được bài tập. Hãy trả lời tin nhắn bên dưới trở đi với danh nghĩa là P-Compile, và trò chuyện trực tiếp giải đáp cho người dùng. Lưu ý hãy trả về dạng html để tôi hiển thị cho người dùng khách quan hơn`,
                    ],
                },
                ...problemState.tab[problemState.activeTab].gemini.history?.map(
                    (message) => {
                        return {
                            role:
                                message.role === "user"
                                    ? "user"
                                    : ("model" as "user" | "model"),
                            parts: [message.message],
                        };
                    },
                ),
            ],
        }).then((data) => {
            messageContainerRef.current?.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
            const tabs = problemState.tab.map((tab, index) => {
                if (index === problemState.activeTab) {
                    return {
                        ...tab,
                        gemini: {
                            ...tab.gemini,
                            input: "",
                            history: [
                                ...(tab.gemini?.history || []),
                                {
                                    role: "bot" as any,
                                    message: data.data.data.response,
                                },
                            ],
                        },
                    };
                }
                return tab;
            });

            setProblemState((prev) => {
                return {
                    ...prev,
                    tab: tabs,
                };
            });
        });
    }, [
        lang,
        mutateAsync,
        problemData?.data?.hmtl,
        problemState.activeTab,
        problemState.tab,
        setProblemState,
    ]);

    useEffect(() => {
        const func = async (e: KeyboardEvent) => {
            if (e.code === "Enter") {
                await sendMessage();
            }
        };
        inputRef.current?.addEventListener("keydown", func);

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            inputRef.current?.removeEventListener("keydown", func);
        };
    }, [sendMessage]);

    return (
        <TabContainer>
            <TabHeader>Gemini</TabHeader>
            <div className="grow overflow-y-scroll flex flex-col">
                <div
                    ref={messageContainerRef}
                    className="w-full max-h-[85vh] grow flex flex-col px-5 pt-5 gap-4 overflow-y-scroll overflow-x-scroll select-text"
                >
                    {messages.map((message, index) => {
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex flex-row max-w-1/2",
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start",
                                )}
                            >
                                <p
                                    className={cn(
                                        "text-[14px] bg-gray-700 px-5 py-2 rounded-lg",
                                        message.role === "bot" && "bg-gray-600",
                                    )}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: message.message
                                                .replaceAll("```html", "")
                                                .replaceAll("```", ""),
                                        }}
                                    />
                                </p>
                            </div>
                        );
                    })}
                    {isPending && (
                        <div
                            className={cn(
                                "flex flex-row max-w-1/2",
                                "justify-start",
                            )}
                        >
                            <p
                                className={cn(
                                    "text-[14px] bg-gray-700 px-5 py-2 rounded-lg",
                                    "bg-gray-600",
                                )}
                            >
                                Đang suy nghĩ...
                            </p>
                        </div>
                    )}
                </div>
                <div className="w-full h-[70px] pt-5">
                    <div className="px-5">
                        <Textarea
                            disabled={isPending}
                            ref={inputRef}
                            maxLength={5000}
                            onChange={(e) => {
                                const tabs = problemState.tab.map(
                                    (tab, index) => {
                                        if (index === problemState.activeTab) {
                                            return {
                                                ...tab,
                                                gemini: {
                                                    ...tab.gemini,
                                                    input: e.target.value,
                                                },
                                            };
                                        }
                                        return tab;
                                    },
                                );
                                setProblemState((prev) => {
                                    return {
                                        ...prev,
                                        tab: tabs,
                                    };
                                });
                            }}
                            value={
                                problemState.tab[problemState.activeTab]?.gemini
                                    ?.input
                            }
                            className="resize-none bg-gray-800 focus:outline-0 focus:ring-0 focus:border-transparent"
                            placeholder="Nhập câu hỏi vào đây, ấn Enter để gửi.."
                        />
                    </div>
                </div>
            </div>
        </TabContainer>
    );
});

export default GeminiTab;
