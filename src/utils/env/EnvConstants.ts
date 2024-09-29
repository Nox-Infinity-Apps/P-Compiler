const ENV = {
    IS_ELECTRON: Boolean(process.env.NEXT_PUBLIC_ELECTRON || "false"),
};

export { ENV };
