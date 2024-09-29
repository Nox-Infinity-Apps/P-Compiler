"use client";
import * as React from "react";
import { RecoilRoot } from "recoil";

export default function RecoilProvider({ children }: React.PropsWithChildren) {
    return <RecoilRoot>{children}</RecoilRoot>;
}
