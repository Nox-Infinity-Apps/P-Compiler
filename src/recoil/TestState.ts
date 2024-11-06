import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type Test = {
    input: string;
    output: string;
    reality_output: string;
}[];

const def = [
    {
        input: "",
        output: "",
        reality_output: "",
    },
];

export const testState = atom<Test>({
    key: "testState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useTestState() {
    return useRecoilState(testState);
}
