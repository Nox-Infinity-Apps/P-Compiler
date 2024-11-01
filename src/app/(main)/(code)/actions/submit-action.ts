"use client";
import { axiosCompiler } from "@/utils/instants/axios/compiler";

export interface Root {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: any;
    stdout: string;
    status_id: number;
    created_at: string;
    finished_at: string;
    time: string;
    memory: number;
    stderr: any;
    token: string;
    number_of_runs: number;
    cpu_time_limit: string;
    cpu_extra_time: string;
    wall_time_limit: string;
    memory_limit: number;
    stack_limit: number;
    max_processes_and_or_threads: number;
    enable_per_process_and_thread_time_limit: boolean;
    enable_per_process_and_thread_memory_limit: boolean;
    max_file_size: number;
    compile_output: any;
    exit_code: number;
    exit_signal: any;
    message: any;
    wall_time: string;
    compiler_options: any;
    command_line_arguments: any;
    redirect_stderr_to_stdout: boolean;
    callback_url: any;
    additional_files: any;
    enable_network: boolean;
}

export async function compileCode(source: string, lang_id: number = 71) {
    return await axiosCompiler.post<
        any,
        {
            data: Root;
        }
    >("/submissions?base64_encoded=false&wait=true&fields=*", {
        language_id: lang_id,
        source_code: source,
    });
}
