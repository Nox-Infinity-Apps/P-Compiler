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

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

export default function ProblemTab() {
    const { isLoading, data } = useProblems();
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
                            className="flex flex-col gap-y-1 px-2 mt-5"
                        >
                            {Array.from({ length:  }).map((e, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
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
                        className="px-1 overflow-y-scroll h-screen"
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
                                {data?.data.map((course) => (
                                    <TableRow
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
