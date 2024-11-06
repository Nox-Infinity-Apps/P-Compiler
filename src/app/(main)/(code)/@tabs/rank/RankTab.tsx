import * as React from "react";
import TabHeader from "@/app/(main)/(code)/@tabs/components/TabHeader";
import TabContainer from "@/app/(main)/(code)/components/TabContainer";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useRanking from "@/queries/useRanking";
import useCodePTITState from "@/recoil/CodePTITState";

export default function RankTab() {
    const [codeState] = useCodePTITState();
    const { isLoading, data } = useRanking(codeState.targetCourse);

    return (
        <TabContainer>
            <TabHeader>Bảng xếp hạng</TabHeader>
            <div className="grow overflow-y-scroll">
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            exit={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            initial={{
                                opacity: 0,
                            }}
                            className="flex flex-col gap-y-1 px-2 mt-5 overflow-y-scroll h-[calc(100vh-3.5rem)]"
                        >
                            {Array.from({ length: 50 }).map((e, i) => (
                                <Skeleton key={i} className="h-5 w-full" />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                {!isLoading && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            translateY: 10,
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                        }}
                        transition={{
                            delay: 0.5,
                            duration: 0.5,
                            ease: "easeInOut",
                        }}
                        className="px-1 overflow-y-scroll h-[calc(100vh-3.5rem)]"
                    >
                        <Table className="overflow-x-auto text-xs relative">
                            <TableCaption>Bảng xếp hạng</TableCaption>
                            <TableHeader className="sticky top-0">
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        #
                                    </TableHead>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Mã SV</TableHead>
                                    <TableHead className="">Lớp</TableHead>
                                    <TableHead className="">AC</TableHead>
                                    <TableHead className="">Tried</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-y-scroll">
                                {data?.data.map((info, rank) => (
                                    <TableRow key={rank}>
                                        <TableCell className="font-medium">
                                            {rank + 1}
                                        </TableCell>
                                        <TableCell>
                                            {info.userFirstName}{" "}
                                            {info.userLastName}
                                        </TableCell>
                                        <TableCell>{info.account}</TableCell>
                                        <TableCell className="text-right">
                                            {info.class_}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {info.ac}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {info.tried}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}
            </div>
        </TabContainer>
    );
}
