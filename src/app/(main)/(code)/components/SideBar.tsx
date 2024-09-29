"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { IoReorderThreeOutline } from "react-icons/io5";
import SideBarTopMenu from "@/app/(main)/(code)/components/SideBarTopMenu";
import useMainState from "@/recoil/MainState";
import { MENU } from "@/app/(main)/(code)/constants/SideBarMenu";
import useIsElectron from "@/shared/hooks/useIsElectron";

export default function SideBar({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const {
        state: [{ sideBarActiveIndex }],
        setSidebarActiveIndex,
    } = useMainState();

    return (
        <div
            {...props}
            className={cn(
                "border-r-xs border-r border-r-gray-600 h-full bg-[#171f2b] flex flex-col items-center py-2 [&>*]:cursor-pointer",
                className,
            )}
        >
            <SideBarTopMenu>
                <IoReorderThreeOutline className="text-gray-300 text-2xl" />
            </SideBarTopMenu>
            <div
                className={cn(
                    "w-full [&>div>*]:text-[1.3rem] [&>div>*:hover]:text-white mt-4 flex flex-col *:h-12 *:w-full *:flex *:justify-center *:items-center *:text-gray-400",
                )}
            >
                {MENU.map(({ icon }, index) => (
                    <div
                        onClick={() => {
                            setSidebarActiveIndex(
                                sideBarActiveIndex === index ? -1 : index,
                            );
                        }}
                        key={index}
                        className={cn(
                            "relative",
                            sideBarActiveIndex === index &&
                                "[&>*]:text-gray-100",
                        )}
                    >
                        {sideBarActiveIndex === index && (
                            <div className="w-[2px] h-full absolute top-0 bottom-0 left-0 bg-white" />
                        )}
                        {icon}
                    </div>
                ))}
            </div>
        </div>
    );
}
