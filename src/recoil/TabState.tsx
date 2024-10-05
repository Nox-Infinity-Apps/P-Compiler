import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type TabStateI = {
    tab: {
        problemName: string;
        code: string;
        problemId: string;
        courseId: string;
    }[];
    activeTab: number;
};

export const tabState = atom<TabStateI>({
    key: "tabState",
    default: {
        tab: [],
        activeTab: 0,
    },
    effects_UNSTABLE: [persistAtom],
});

export default function useProblemTabState() {
    return useRecoilState(tabState);
}
