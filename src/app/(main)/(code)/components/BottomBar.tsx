"use client";
import * as React from "react";
import { GoDependabot } from "react-icons/go";
import { FaBook, FaTerminal, FaUser } from "react-icons/fa";
import useMainState from "@/recoil/MainState";
import languageCodes from "@/app/(main)/(code)/constants/Languages";
import useCodeState from "@/recoil/CodeState";
import useUserInfo from "@/queries/useUserInfo";
import useCourses from "@/queries/useCourses";
import useCodePTITState from "@/recoil/CodePTITState";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function BottomBar() {
    const { handleOpenTerminal } = useMainState();
    const [codeState, setCodeState] = useCodePTITState();
    const [state, setState] = useCodeState();
    const { data } = useUserInfo();
    const { data: courses } = useCourses();
    const queryClient = useQueryClient();

    useEffect(() => {
        const langId = Object.keys(languageCodes).find(
            (item) =>
                (languageCodes[item as keyof typeof languageCodes] as any)
                    ?.course == codeState.targetCourse,
        );
        if (langId) {
            setState((pre) => ({
                ...pre,
                lang: (
                    languageCodes[langId as keyof typeof languageCodes] as any
                ).code,
            }));
        }
    }, [codeState.targetCourse, setState]);

    return (
        <div className="px-2 gap-x-1 [&>button]:gap-x-1.5 translate-y-[100%] py-0.5 md:translate-y-0 flex transition-all duration-100 [&>button]:font-bold [&>button]:text-gray-400 [&>button:hover]:bg-gray-700 ease-in flex-row h-5 border-t-gray-600 border-t-[0.5px] w-full bg-[#1f2939]">
            <button
                onClick={handleOpenTerminal}
                className="flex items-center text-[0.65rem] rounded-sm px-2"
            >
                <FaTerminal className="text-[0.7rem]" />
                Terminal
            </button>
            <div className="flex items-center">
                <FaBook className="text-[0.7rem]" />
                <select
                    onChange={(e) => {
                        setCodeState((pre) => ({
                            ...pre,
                            targetCourse: String(e.target.value) || "",
                        }));
                        queryClient.refetchQueries({
                            queryKey: ["SUBMISSIONS"],
                        });
                    }}
                    value={codeState.targetCourse}
                    className="flex bg-ide_bg items-center text-[0.65rem] rounded-sm px-2 active:outline-none"
                >
                    {courses?.data?.map((course) => (
                        <option key={course.value} value={course.value}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grow"></div>
            <select
                onChange={(event) => {
                    setState((pre) => ({
                        ...pre,
                        lang: Number(event.target.value || 71),
                    }));
                }}
                value={state.lang}
                className="flex bg-ide_bg items-center text-[0.65rem] rounded-sm px-2"
            >
                {Object.entries(languageCodes).map(([key, value]) => (
                    <option key={key} value={value.code}>
                        {value.title}
                    </option>
                ))}
            </select>
            <button className="flex items-center text-[0.65rem] rounded-sm px-2">
                <GoDependabot className="text-[0.7rem]" />
                ChatGPT
            </button>
            <button className="flex items-center text-[0.65rem] rounded-sm px-2">
                <FaUser className="text-[0.7rem]" />
                {data?.data?.username}
            </button>
        </div>
    );
}
