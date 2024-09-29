import * as React from "react";
import useMainState from "@/recoil/MainState";
import { MENU } from "@/app/(main)/(code)/constants/SideBarMenu";

export default function SideBarContent() {
    const {
        state: [{ sideBarActiveIndex }],
    } = useMainState();

    const render = React.useMemo(() => {
        if (sideBarActiveIndex === -1) return null;
        return MENU[sideBarActiveIndex].component;
    }, [sideBarActiveIndex]);

    return (
        <div className="flex flex-col items-center size-full bg-top-bar border-r-[0.5px] border-r-gray-600">
            {render}
        </div>
    );
}
