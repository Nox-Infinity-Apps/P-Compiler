"use client";

export default function useIsMac() {
    if (typeof window.electron === "undefined") {
        return false;
    }
    return window.electron.platform.isMac();
}
