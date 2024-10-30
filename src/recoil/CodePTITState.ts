import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const def = {
    targetCourse: "",
};

export const codeState = atom<typeof def>({
    key: "useCodePTITState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useCodePTITState() {
    return useRecoilState(codeState);
}
