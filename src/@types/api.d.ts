declare global {
    type Status = "success" | "failed";
    type Result<T> = {
        status: Status;
        message: string;
        data: T;
    };
}

export {};
