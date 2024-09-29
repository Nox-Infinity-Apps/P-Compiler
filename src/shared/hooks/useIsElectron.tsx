"use client";

export default function useIsElectron() {
    if (typeof window !== "undefined") {
        if (typeof window.electron !== "undefined") {
            return true;
        }
    }
    return false;
}
