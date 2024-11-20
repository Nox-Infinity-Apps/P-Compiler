import { atom, useRecoilState } from "recoil";

type SubmissionStateT = {
    submissions: {
        name: string;
        id: string;
        status: "pending" | "done";
        submissionStatus: string;
    }[];
};
export const submissionState = atom<SubmissionStateT>({
    default: {
        submissions: [],
    },
    key: "submissionState",
});

export default function useSubmissionState() {
    return useRecoilState(submissionState);
}
