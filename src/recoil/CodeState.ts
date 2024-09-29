import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import languageCodes from "@/app/(main)/(code)/constants/Languages";

const { persistAtom } = recoilPersist();

const def = {
    source: "",
    output: "",
    err: "",
    loading: false,
    lang: languageCodes.python.code,
};

export const codeState = atom<typeof def>({
    key: "codeState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useCodeState() {
    return useRecoilState(codeState);
}
