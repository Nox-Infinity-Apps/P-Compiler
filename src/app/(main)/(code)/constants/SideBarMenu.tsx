"use client";
import { VscSearch } from "react-icons/vsc";
import { PiRanking } from "react-icons/pi";
import { FaBarsStaggered } from "react-icons/fa6";
import * as React from "react";
import { lazy } from "react";
import { SiPytest } from "react-icons/si";
import Testing from "@/app/(main)/(code)/@tabs/testing/Testing";

const TabSearch = lazy(
    () => import("@/app/(main)/(code)/@tabs/tree/TabSearch"),
);
const ProblemTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/problems/ProblemTab"),
);

const SearchTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/search/SearchTab"),
);

const RankTab = lazy(() => import("@/app/(main)/(code)/@tabs/rank/RankTab"));

const MENU = [
    {
        icon: <VscSearch />,
        onPress: () => {},
        component: <SearchTab />,
    },
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
];

export { MENU };
