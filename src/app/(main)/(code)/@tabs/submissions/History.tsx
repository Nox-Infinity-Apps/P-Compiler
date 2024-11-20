import * as React from "react";
import TabHeader from "@/app/(main)/(code)/@tabs/components/TabHeader";
import TabContainer from "@/app/(main)/(code)/components/TabContainer";
import useSubmissionHistory from "@/queries/useSubmissionHistory";
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

export default function History() {
    const { isLoading, data } = useSubmissionHistory();
    return (
        <TabContainer>
            <TabHeader>Lịch sử nộp bài</TabHeader>
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
                            <TableCaption>Submissions</TableCaption>
                            <TableHeader className="sticky top-0">
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Mã bài
                                    </TableHead>
                                    <TableHead>Tên bài</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="">
                                        Thời gian chạy
                                    </TableHead>
                                    <TableHead className="">Bộ nhớ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-y-scroll">
                                {data?.data?.map((info, rank) => {
                                    return (
                                        <TableRow
                                            className={
                                                info.status
                                                    .trim()
                                                    .includes("AC")
                                                    ? "bg-green-950"
                                                    : "bg-red-950"
                                            }
                                            key={rank}
                                        >
                                            <TableCell className="font-medium">
                                                {info.id}
                                            </TableCell>
                                            <TableCell>{info.title}</TableCell>
                                            <TableCell>
                                                {info.status.toUpperCase()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {info.time}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {info.capacity}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}
            </div>
        </TabContainer>
    );
}
