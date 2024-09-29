import * as React from "react";
import { Suspense } from "react";
import Loading from "@/components/app/Loading";

export default function TabContainer({ children }: React.PropsWithChildren) {
    return (
        <div className="size-full relative">
            <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
    );
}
