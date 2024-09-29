import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const def = {
    fontSize: 14,
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: "600",
};

export const editorState = atom<typeof def>({
    key: "editorState",
    default: def,
    effects_UNSTABLE: [persistAtom],
});

export default function useEditorState() {
    return useRecoilState(editorState);
}
