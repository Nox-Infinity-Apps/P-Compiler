"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useLogin from "@/mutations/useLogin";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LoginInputs = {
    username: string;
    password: string;
};

export default function Page() {
    const { mutate, data, isError, isSuccess, isPending, reset } = useLogin();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = (data) => {
        mutate(data);
    };

    useEffect(() => {
        router.prefetch("/");
    }, [router]);

    useEffect(() => {
        if (isSuccess) {
            localStorage.setItem("access_token", data.data.access_token);
            router.replace("/");
        }
    }, [data?.data.access_token, isSuccess, router]);

    useEffect(() => {
        if (isError) {
            toast("Đăng nhập thất bại!", {
                description: "Tên đăng nhập hoặc mật khẩu không đúng",
            });
        }
    }, [isError]);

    return (
        <div className="grid place-items-center h-screen">
            {isError && (
                <AlertDialog open>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Đăng nhập thất bại!
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Tên đăng nhập hoặc mật khẩu không chính xác!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => reset()}>
                                Thử lại
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Đăng nhập</CardTitle>
                        <CardDescription>
                            Đăng nhập bằng tài khoản CodePTIT
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Tên đăng nhập</Label>
                                <Input
                                    id="name"
                                    placeholder="Tên đăng nhập"
                                    {...register("username", {
                                        required: true,
                                    })}
                                />
                                {errors.username && (
                                    <span className="text-red-400 text-xs">
                                        Tên đăng nhập không được trống
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Mật khẩu</Label>
                                <Input
                                    id="name"
                                    placeholder="Mật khẩu code PTIT"
                                    type="password"
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                                {errors.password && (
                                    <span className="text-red-400 text-xs">
                                        Mật khẩu không được trống
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button disabled={isPending} type="submit">
                            Tiếp tục
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
