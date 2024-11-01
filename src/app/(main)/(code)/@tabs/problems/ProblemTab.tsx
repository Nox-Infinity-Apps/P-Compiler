import * as React from "react";
import TabHeader from "@/app/(main)/(code)/@tabs/components/TabHeader";
import TabContainer from "@/app/(main)/(code)/components/TabContainer";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useProblems from "@/queries/useProblems";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import useCodePTITState from "@/recoil/CodePTITState";
import useProblemTabState from "@/recoil/TabState";

export default function ProblemTab() {
    const { isLoading, data } = useProblems();
    const [state] = useCodePTITState();
    const [, setTabState] = useProblemTabState();

    const newTab = useCallback(
        (course: string, id: string, name: string) => {
            setTabState((pre) => ({
                ...pre,
                tab: [
                    ...pre.tab,
                    {
                        problemId: id,
                        problemName: name,
                        code: "",
                        courseId: course,
                    },
                ],
                activeTab: pre.tab.length,
            }));
        },
        [setTabState],
    );

    return (
        <TabContainer>
            <TabHeader>Problems</TabHeader>
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
                            <TableCaption>Bài tập</TableCaption>
                            <TableHeader className="sticky top-0">
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Code
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Group</TableHead>
                                    <TableHead className="">Topic</TableHead>
                                    <TableHead className="">Level</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-y-scroll">
                                {data?.data?.map((course) => (
                                    <TableRow
                                        onClick={() => {
                                            newTab(
                                                state.targetCourse,
                                                course.code,
                                                course.name,
                                            );
                                        }}
                                        className={
                                            course.status === 0
                                                ? "bg-red-950 hover:bg-red-900"
                                                : course.status === 1
                                                  ? "bg-green-950 hover:bg-green-900"
                                                  : undefined
                                        }
                                        key={course.code}
                                    >
                                        <TableCell className="font-medium">
                                            {course.code}
                                        </TableCell>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>{course.group}</TableCell>
                                        <TableCell className="text-right">
                                            {course.topic}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {course.level}
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
