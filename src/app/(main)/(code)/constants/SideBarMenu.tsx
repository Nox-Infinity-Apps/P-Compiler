"use client";
import { VscSearch } from "react-icons/vsc";
import { PiRanking } from "react-icons/pi";
import { FaBarsStaggered } from "react-icons/fa6";
import * as React from "react";
import { lazy } from "react";
import { SiChatbot, SiPytest } from "react-icons/si";
import Testing from "@/app/(main)/(code)/@tabs/testing/Testing";
import GeminiIcon from "@/app/(main)/(code)/@tabs/components/GeminiIcon";

import { AiOutlineFileDone } from "react-icons/ai";

const TabSearch = lazy(
    () => import("@/app/(main)/(code)/@tabs/tree/TabSearch"),
);
const ProblemTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/problems/ProblemTab"),
);

const History = lazy(
    () => import("@/app/(main)/(code)/@tabs/submissions/History"),
);

const RankTab = lazy(() => import("@/app/(main)/(code)/@tabs/rank/RankTab"));
const GeminiTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/gemini/GeminiTab"),
);

const MENU = [
    {
        icon: <PiRanking />,
        onPress: () => {},
        component: <RankTab />,
    },
    {
        icon: <FaBarsStaggered />,
        onPress: () => {},
        component: <ProblemTab />,
    },
    {
        icon: <SiPytest />,
        onPress: () => {},
        component: <Testing />,
    },
    {
        icon: <AiOutlineFileDone />,
        onPress: () => {},
        component: <History />,
    },
    {
        icon: <GeminiIcon className="w-[24px] h-[24px]" />,
        onPress: () => {},
        component: <GeminiTab />,
    },
];

export { MENU };
