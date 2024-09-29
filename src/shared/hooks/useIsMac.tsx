"use client";

export default function useIsMac() {
    if (typeof Window === "undefined") {
        return false;
    }
    return window.electron.platform.isMac();
}
