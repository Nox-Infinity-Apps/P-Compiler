import OutputTabTerminal from "@/app/(main)/(code)/(codespace)/components/OutputTabTerminal";
import SubmissionStatus from "@/app/(main)/(code)/(codespace)/components/SubmissionStatus";

const TERMINAL_TABS = [
    {
        title: "Terminal",
        component: null,
    },
    {
        title: "Submissions",
        component: <SubmissionStatus />,
    },
    {
        title: "Output",
        component: <OutputTabTerminal />,
    },
];

export { TERMINAL_TABS };
