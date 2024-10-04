import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RecoilProvider from "@/providers/RecoilProvider";
import { ClientOnly } from "@/app/(main)/(code)/components/ClientOnly";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TanstackQuery from "@/providers/TanstackQuery";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "P-Compiler",
    description: "P-Compiler app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased dark absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white`}
            >
                <TanstackQuery>
                    <ClientOnly>
                        <RecoilProvider>{children}</RecoilProvider>
                    </ClientOnly>
                </TanstackQuery>
            </body>
        </html>
    );
}
