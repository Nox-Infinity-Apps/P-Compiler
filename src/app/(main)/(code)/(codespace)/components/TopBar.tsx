import * as React from "react";
import { cn } from "@/lib/utils";
import { FaPlay } from "react-icons/fa";

export default function TopBar({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                className,
                "flex flex-row h-8 bg-top-bar border-b-[0.5px] border-b-gray-600 mb-1 justify-end items-center px-4 [&>*]:cursor-pointer",
            )}
        ></div>
    );
}
