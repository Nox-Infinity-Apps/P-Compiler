import OutputTabTerminal from "@/app/(main)/(code)/(codespace)/components/OutputTabTerminal";

const TERMINAL_TABS = [
    {
        title: "Terminal",
        component: null,
    },
    {
        title: "Submissions",
    },
    {
        title: "Output",
        component: <OutputTabTerminal />,
    },
];

export { TERMINAL_TABS };
