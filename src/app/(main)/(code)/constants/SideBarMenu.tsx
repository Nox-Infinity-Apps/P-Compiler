"use client";
import { VscSearch } from "react-icons/vsc";
import { PiRanking } from "react-icons/pi";
import { FaBarsStaggered } from "react-icons/fa6";
import * as React from "react";
import { lazy } from "react";

const TabSearch = lazy(
    () => import("@/app/(main)/(code)/@tabs/tree/TabSearch"),
);
const ProblemTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/problems/ProblemTab"),
);

const SearchTab = lazy(
    () => import("@/app/(main)/(code)/@tabs/search/SearchTab"),
);

const MENU = [
    {
        icon: <VscSearch />,
        onPress: () => {},
        component: <SearchTab />,
    },
    {
        icon: <PiRanking />,
        onPress: () => {},
        component: <TabSearch />,
    },
    {
        icon: <FaBarsStaggered />,
        onPress: () => {},
        component: <ProblemTab />,
    },
];

export { MENU };
