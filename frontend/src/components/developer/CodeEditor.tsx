import React, { useState } from "react";
import {
    Play,
    Copy,
    Check,
    Download,
    RotateCcw,
    Sparkles,
    Terminal,
    Lock,
    Maximize2,
    Minimize2,
    FileCode,
    Settings2,
    AlertCircle,
    CheckCircle2,
    Clock,
    Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type SupportedLanguage = "python" | "javascript" | "cpp" | "java" | "typescript" | "go";

interface CodeEditorProps {
    initialCode?: string;
    initialLanguage?: SupportedLanguage;
    problemTitle?: string;
}

const BOILERPLATES: Record<SupportedLanguage, string> = {
    python: `# Python 3 Competitive Programming Template
import sys

def solve():
    # Read all inputs from standard input
    input_data = sys.stdin.read().split()
    if not input_data:
        print("Hello from Calvion Developer Workspace!")
        return
    
    # Process test cases
    print("Processed tokens:", len(input_data))
    print("Tokens:", input_data)

if __name__ == "__main__":
    solve()
`,
    javascript: `// JavaScript (Node.js) Competitive Programming Template
const fs = require('fs');

function solve() {
    try {
        const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
        if (!input || input.length === 0 || input[0] === '') {
            console.log("Hello from Calvion Developer Workspace!");
            return;
        }
        console.log("Input tokens:", input);
    } catch (e) {
        console.log("Calvion JS Sandbox Ready!");
    }
}

solve();
`,
    cpp: `// C++20 Fast I/O Competitive Programming Template
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

void solve() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string s;
    if (cin >> s) {
        cout << "Input received: " << s << "\\n";
    } else {
        cout << "Hello from Calvion C++ Workspace!\\n";
    }
}

int main() {
    solve();
    return 0;
}
`,
    java: `// Java Competitive Programming Template
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        FastScanner fs = new FastScanner();
        String s = fs.next();
        if (s != null && !s.isEmpty()) {
            System.out.println("Input received: " + s);
        } else {
            System.out.println("Hello from Calvion Java Workspace!");
        }
    }

    static class FastScanner {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer("");
        String next() {
            while (!st.hasMoreTokens()) {
                try {
                    String line = br.readLine();
                    if (line == null) return null;
                    st = new StringTokenizer(line);
                } catch (IOException e) {
                    return null;
                }
            }
            return st.nextToken();
        }
    }
}
`,
    typescript: `// TypeScript Competitive Programming Template
function solve(input: string): string {
    if (!input.trim()) {
        return "Hello from Calvion TypeScript Workspace!";
    }
    const tokens = input.trim().split(/\\s+/);
    return \`Processed \${tokens.length} elements successfully.\`;
}

console.log(solve("10 20 30 40"));
`,
    go: `// Go Competitive Programming Template
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		fmt.Printf("Input: %s\\n", scanner.Text())
	} else {
		fmt.Println("Hello from Calvion Go Workspace!")
	}
}
`,
};

const JUDGE0_LANG_MAP: Record<SupportedLanguage, number> = {
    python: 92,     // Python (3.11.2)
    cpp: 105,       // C++ (GCC 14.1.0)
    java: 91,       // Java (JDK 17.0.6)
    javascript: 93, // JavaScript (Node.js 18.15.0)
    typescript: 94, // TypeScript (5.0.3)
    go: 95,         // Go (1.18.5)
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
    initialCode,
    initialLanguage = "python",
    problemTitle,
}) => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
    const [code, setCode] = useState<string>(initialCode || BOILERPLATES[initialLanguage]);
    const [customInput, setCustomInput] = useState<string>("4\n1 2 3 4");
    const [execStatus, setExecStatus] = useState<{
        statusType: "success" | "error" | "warning";
        label: string;
        time?: string | null;
        memory?: string | null;
    } | null>(null);
    const [stdout, setStdout] = useState<string>("");
    const [stderr, setStderr] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(14);

    const handleLanguageChange = (newLang: SupportedLanguage) => {
        setLanguage(newLang);
        // If current code matches default boilerplate of current language, switch boilerplate
        if (code === BOILERPLATES[language] || !code.trim()) {
            setCode(BOILERPLATES[newLang]);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const extMap: Record<SupportedLanguage, string> = {
            python: "py",
            javascript: "js",
            cpp: "cpp",
            java: "java",
            typescript: "ts",
            go: "go",
        };
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `solution.${extMap[language]}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setCode(BOILERPLATES[language]);
        setExecStatus(null);
        setStdout("");
        setStderr("");
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setExecStatus(null);
        setStdout("");
        setStderr("");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: JUDGE0_LANG_MAP[language],
                    stdin: customInput || "",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`Execution server responded with status: ${res.status}`);
            }

            const data = await res.json();
            const statusId = data.status?.id || 0;
            const statusDesc = data.status?.description || "Unknown";

            // Status id 3 is Accepted / Success in Judge0
            const isSuccess = statusId === 3;
            const isError = statusId === 6 || statusId >= 7;

            setExecStatus({
                statusType: isSuccess ? "success" : isError ? "error" : "warning",
                label: statusDesc,
                time: data.time ? `${data.time}s` : null,
                memory: data.memory ? `${data.memory} KB` : null,
            });

            setStdout(data.stdout || "");
            setStderr(data.stderr || data.compile_output || data.message || "");
        } catch (err: any) {
            // Client-side fallback for JS/TS if network issue
            if ((language === "javascript" || language === "typescript") && (err.name === "AbortError" || err.message?.includes("fetch"))) {
                const logs: string[] = [];
                const originalConsoleLog = console.log;
                console.log = (...args) => {
                    logs.push(args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
                };

                try {
                    // eslint-disable-next-line no-new-func
                    const runFn = new Function(code);
                    runFn();
                    console.log = originalConsoleLog;
                    setExecStatus({
                        statusType: "success",
                        label: "Executed (Local JS Sandbox)",
                    });
                    setStdout(logs.join("\n"));
                } catch (localErr: any) {
                    console.log = originalConsoleLog;
                    setExecStatus({
                        statusType: "error",
                        label: "Runtime Error (Local)",
                    });
                    setStderr(localErr?.message || String(localErr));
                }
            } else {
                setExecStatus({
                    statusType: "error",
                    label: "Execution Failed",
                });
                setStderr(`Connection Error: ${err?.message || "Failed to reach execution sandbox. Please check your internet connection."}`);
            }
        } finally {
            setIsRunning(false);
        }
    };

    const handleSaveToVault = () => {
        // Save snippet into sessionStorage to carry over to AddAsset
        sessionStorage.setItem(
            "calvion_developer_snippet",
            JSON.stringify({
                title: problemTitle || `Code Snippet (${language.toUpperCase()})`,
                content: code,
                type: "CREDENTIAL",
                description: `Created in Calvion Developer Editor - ${language.toUpperCase()}`,
            })
        );
        navigate("/add-asset");
    };

    const lineCount = code.split("\n").length;

    return (
        <div className={`flex flex-col rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] shadow-xl overflow-hidden transition-all duration-300 ${isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : "w-full"}`}>
            {/* TOP BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-black/80 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                        <FileCode size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {problemTitle ? problemTitle : "Interactive Code Playground"}
                            </span>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                                Ready
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                            Zero-delay client-side execution & private vault storage
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                    {/* LANGUAGE SELECTOR */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                            className="h-9 appearance-none rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-3 pr-8 text-xs font-semibold text-slate-700 dark:text-neutral-200 outline-none transition hover:border-slate-300 dark:hover:border-neutral-700 focus:border-cyan-500 dark:focus:border-cyan-400"
                        >
                            <option value="python">Python 3</option>
                            <option value="javascript">JavaScript (ES6)</option>
                            <option value="cpp">C++ (GCC 13)</option>
                            <option value="java">Java 21</option>
                            <option value="typescript">TypeScript</option>
                            <option value="go">Go 1.22</option>
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            ▼
                        </div>
                    </div>

                    {/* FONT SIZE CONTROLS */}
                    <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5 text-xs font-semibold text-slate-600 dark:text-neutral-400">
                        <button
                            type="button"
                            onClick={() => setFontSize((f) => Math.max(12, f - 1))}
                            className="px-2 py-1 hover:text-slate-900 dark:hover:text-white"
                            title="Decrease font size"
                        >
                            A-
                        </button>
                        <span className="px-1 text-[11px] opacity-60">{fontSize}px</span>
                        <button
                            type="button"
                            onClick={() => setFontSize((f) => Math.min(20, f + 1))}
                            className="px-2 py-1 hover:text-slate-900 dark:hover:text-white"
                            title="Increase font size"
                        >
                            A+
                        </button>
                    </div>

                    {/* COPY */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                        title="Copy Code"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                    </button>

                    {/* DOWNLOAD */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                        title="Download Source File"
                    >
                        <Download size={14} />
                    </button>

                    {/* RESET */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                        title="Reset to Template"
                    >
                        <RotateCcw size={14} />
                    </button>

                    {/* FULLSCREEN */}
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex h-9 items-center rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>

                    {/* SAVE TO VAULT */}
                    <button
                        type="button"
                        onClick={handleSaveToVault}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-950/40 px-3.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition shadow-sm"
                        title="Store this solution securely in Calvion encrypted vault"
                    >
                        <Lock size={13} />
                        <span>Save to Vault</span>
                    </button>

                    {/* RUN CODE */}
                    <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition"
                    >
                        <Play size={13} className={isRunning ? "animate-spin" : "fill-current"} />
                        <span>{isRunning ? "Running..." : "Run Code"}</span>
                    </button>
                </div>
            </div>

            {/* MAIN SPLIT VIEW: EDITOR & CONSOLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                {/* CODE EDITOR AREA */}
                <div className="relative flex lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 bg-[#09090b] text-neutral-100">
                    {/* LINE NUMBERS */}
                    <div className="select-none py-4 px-3 text-right font-mono text-neutral-600 text-xs border-r border-neutral-800/80 bg-black/40 min-w-[45px]">
                        {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                            <div key={i} className="leading-6">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* TEXTAREA EDITOR */}
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Type your code here..."
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        className="w-full h-full min-h-[460px] resize-none bg-transparent p-4 font-mono leading-6 outline-none text-neutral-100 placeholder:text-neutral-700"
                        style={{ fontSize: `${fontSize}px` }}
                    />
                </div>

                {/* CONSOLE & TEST INPUT PANEL */}
                <div className="lg:col-span-4 flex flex-col bg-slate-50 dark:bg-black">
                    {/* CUSTOM INPUT */}
                    <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-neutral-300">
                                <Settings2 size={13} className="text-cyan-500" />
                                <span>Custom Test Input (stdin)</span>
                            </label>
                            <span className="text-[10px] text-slate-400 dark:text-neutral-500">Passed to execution</span>
                        </div>
                        <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter test inputs here..."
                            rows={4}
                            className="w-full flex-1 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-3 font-mono text-xs text-slate-800 dark:text-neutral-200 outline-none transition focus:border-cyan-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                        />
                    </div>

                    {/* OUTPUT CONSOLE */}
                    <div className="p-4 flex-1 flex flex-col min-h-[240px]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-neutral-300">
                                    <Terminal size={13} className="text-emerald-500" />
                                    <span>Console Output</span>
                                </label>
                                {execStatus && (
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                execStatus.statusType === "success"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                                                    : execStatus.statusType === "error"
                                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20"
                                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"
                                            }`}
                                        >
                                            {execStatus.statusType === "success" ? (
                                                <CheckCircle2 size={11} />
                                            ) : (
                                                <AlertCircle size={11} />
                                            )}
                                            <span>{execStatus.label}</span>
                                        </span>
                                        {execStatus.time && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-neutral-500">
                                                <Clock size={10} />
                                                {execStatus.time}
                                            </span>
                                        )}
                                        {execStatus.memory && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-neutral-500">
                                                <Cpu size={10} />
                                                {execStatus.memory}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {(stdout || stderr || execStatus) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStdout("");
                                        setStderr("");
                                        setExecStatus(null);
                                    }}
                                    className="text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 transition"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="w-full flex-1 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-3 font-mono text-xs overflow-y-auto max-h-[300px]">
                            {isRunning ? (
                                <div className="flex items-center gap-2 py-4 text-cyan-500 dark:text-cyan-400">
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span className="text-xs">Compiling & executing in secure sandbox...</span>
                                </div>
                            ) : stderr ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-[11px]">
                                        <AlertCircle size={13} />
                                        <span>Error Output / Traceback:</span>
                                    </div>
                                    <pre className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap break-all leading-5 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/20">
                                        {stderr}
                                    </pre>
                                    {stdout && (
                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800">
                                            <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold mb-1">Standard Output (stdout):</div>
                                            <pre className="text-slate-800 dark:text-neutral-200 whitespace-pre-wrap break-all leading-5">
                                                {stdout}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ) : stdout ? (
                                <pre className="text-slate-800 dark:text-neutral-200 whitespace-pre-wrap break-all leading-5">
                                    {stdout}
                                </pre>
                            ) : execStatus ? (
                                <div className="text-emerald-500 dark:text-emerald-400 italic text-xs py-2">
                                    Program finished with exit code 0. (No stdout output produced)
                                </div>
                            ) : (
                                <span className="text-slate-400 dark:text-neutral-600 italic">
                                    Click &quot;Run Code&quot; to execute your solution and see console output or error traces here.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS BAR FOOTER */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-neutral-800 bg-slate-100/80 dark:bg-neutral-950 px-4 py-2 text-[11px] text-slate-500 dark:text-neutral-400">
                <div className="flex items-center gap-4">
                    <span>Language: <strong className="text-slate-700 dark:text-neutral-200 uppercase">{language}</strong></span>
                    <span>Lines: <strong className="text-slate-700 dark:text-neutral-200">{lineCount}</strong></span>
                    <span>Characters: <strong className="text-slate-700 dark:text-neutral-200">{code.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Calvion Developer Engine</span>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
