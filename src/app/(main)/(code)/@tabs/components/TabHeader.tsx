import * as React from "react";
import { RxDotsHorizontal } from "react-icons/rx";

export default function TabHeader({ children }: React.PropsWithChildren) {
    return (
        <p className="px-5 mt-3 font-medium text-gray-200 text-xs uppercase flex justify-between">
            {children}
            <RxDotsHorizontal className="cursor-pointer" />
        </p>
    );
}
