import { VscSearch } from "react-icons/vsc";
import { PiRanking } from "react-icons/pi";
import { FaBarsStaggered } from "react-icons/fa6";
import * as React from "react";
import dynamic from "next/dynamic";

const TabSearch = dynamic(
    () => import("@/app/(main)/(code)/@tabs/tree/TabSearch"),
);
const ProblemTab = dynamic(
    () => import("@/app/(main)/(code)/@tabs/problems/ProblemTab"),
);

const SearchTab = dynamic(
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
