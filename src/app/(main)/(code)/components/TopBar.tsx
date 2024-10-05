import * as React from "react";
import CompileButton from "@/app/(main)/(code)/components/CompileButton";

export default function TopBar() {
    return (
        <div className="font-medium h-9 bg-top-pbar flex justify-end w-full items-center px-2 gap-x-4 py-0.5">
            <CompileButton />
            <img
                src="https://picsum.photos/200"
                className="h-6 aspect-square rounded-full cursor-pointer border border-gray-600"
                alt="Avatar"
            />
        </div>
    );
}
