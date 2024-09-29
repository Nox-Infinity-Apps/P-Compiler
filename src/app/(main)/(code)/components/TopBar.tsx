import * as React from "react";
import { FaPlay } from "react-icons/fa";

export default function TopBar() {
    return (
        <div className="font-medium h-9 bg-top-pbar flex justify-end w-full items-center px-2 gap-x-4 py-0.5">
            <button className="flex gap-x-1 text-xs items-center px-2 text-green-500 hover:text-green-700 py-1 border hover:border-green-800 border-green-700 rounded-md">
                <FaPlay className="text-xs text-green-600 hover:text-green-800" />
                Run
            </button>
            <img
                src="https://picsum.photos/200"
                className="h-6 aspect-square rounded-full cursor-pointer border border-gray-600"
                alt="Avatar"
            />
        </div>
    );
}
