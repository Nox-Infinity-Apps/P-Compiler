import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const def = {
    source: "",
    output: "",
    err: "",
    loading: false,
};

export const codeState = atom<typeof def>({
    key: "codeState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useCodeState() {
    return useRecoilState(codeState);
}
