import { atom, useRecoilState } from "recoil";
import * as React from "react";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const def = {
    isOpenTerminal: true,
    sideBarActiveIndex: -1,
    terminalActiveIndex: -1,
};

export const mainState = atom<typeof def>({
    key: "mainState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useMainState() {
    const state = useRecoilState(mainState);

    const handleCloseTerminal = React.useCallback(() => {
        state[1]((pre) => ({
            ...pre,
            isOpenTerminal: false,
        }));
    }, [state]);

    const handleOpenTerminal = React.useCallback(() => {
        state[1]((pre) => ({
            ...pre,
            isOpenTerminal: true,
        }));
    }, [state]);

    const setSidebarActiveIndex = React.useCallback(
        (i: number) => {
            state[1]((pre) => ({
                ...pre,
                sideBarActiveIndex: i,
            }));
        },
        [state],
    );

    const setTerminalActiveIndex = React.useCallback(
        (i: number) => {
            state[1]((pre) => ({
                ...pre,
                terminalActiveIndex: i,
            }));
        },
        [state],
    );

    return {
        state,
        handleCloseTerminal,
        handleOpenTerminal,
        setSidebarActiveIndex,
        setTerminalActiveIndex,
    };
}
