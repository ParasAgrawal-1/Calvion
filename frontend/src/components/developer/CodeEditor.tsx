import React, { useState, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
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
    AlignLeft,
    Layers,
    Bot,
    FileText,
    Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export type SupportedLanguage = "python" | "javascript" | "cpp" | "java" | "typescript" | "go";

interface CodeEditorProps {
    initialCode?: string;
    initialLanguage?: SupportedLanguage;
    problemTitle?: string;
}

const BOILERPLATES: Record<SupportedLanguage, string> = {
    python: `# Python 3 Competitive Programming Solution
import sys

def solve():
    # Read all tokens from standard input
    input_data = sys.stdin.read().split()
    if not input_data:
        print("Hello from Calvion Antigravity IDE!")
        return
    
    print(f"Processed {len(input_data)} tokens successfully.")
    print("Tokens:", input_data)

if __name__ == "__main__":
    solve()
`,
    javascript: `// JavaScript (Node.js) Competitive Solution
const fs = require('fs');

function solve() {
    try {
        const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
        if (!input || input.length === 0 || input[0] === '') {
            console.log("Hello from Calvion Antigravity IDE!");
            return;
        }
        console.log(\`Received \${input.length} input elements:\`, input);
    } catch (e) {
        console.log("Calvion Node.js Engine Active!");
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
        cout << "Hello from Calvion C++ Engine!\\n";
    }
}

int main() {
    solve();
    return 0;
}
`,
    java: `// Java High-Performance Competitive Template
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String token = scanner.next();
            System.out.println("Java processed token: " + token);
        } else {
            System.out.println("Hello from Calvion Java Sandbox Engine!");
        }
    }
}
`,
    typescript: `// TypeScript High-Performance Template
function solve(input: string): void {
    if (!input.trim()) {
        console.log("Hello from Calvion TypeScript Engine!");
        return;
    }
    const tokens = input.trim().split(/\\s+/);
    console.log(\`Successfully processed \${tokens.length} tokens.\`);
    console.log("First token:", tokens[0]);
}

solve("42 100 200");
`,
    go: `// Go Competitive Solution
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		fmt.Printf("Go received input: %s\\n", scanner.Text())
	} else {
		fmt.Println("Hello from Calvion Go Engine!")
	}
}
`,
};

const FILE_NAMES: Record<SupportedLanguage, string> = {
    python: "main.py",
    javascript: "main.js",
    cpp: "solution.cpp",
    java: "Main.java",
    typescript: "main.ts",
    go: "main.go",
};

const JUDGE0_LANG_MAP: Record<SupportedLanguage, number> = {
    python: 92,     // Python 3.11.2
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
    const [customInput, setCustomInput] = useState<string>("4\n10 20 30 40");
    const [activeTab, setActiveTab] = useState<"code" | "input" | "readme">("code");
    const [bottomDockTab, setBottomDockTab] = useState<"console" | "stdin" | "ai">("console");

    // Execution state
    const [execStatus, setExecStatus] = useState<{
        statusType: "success" | "error" | "warning";
        label: string;
        time?: string | null;
        memory?: string | null;
    } | null>(null);
    const [stdout, setStdout] = useState<string>("");
    const [stderr, setStderr] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // AI Assistant state
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

    // Editor settings state
    const [copied, setCopied] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(14);
    const [showMinimap, setShowMinimap] = useState<boolean>(false);
    const [wordWrap, setWordWrap] = useState<boolean>(true);

    const editorRef = useRef<any>(null);
    const runCodeRef = useRef<() => void>(() => {});

    // Sync handleRunCode ref so Monaco shortcuts always use latest state
    const handleRunCode = async () => {
        setIsRunning(true);
        setExecStatus(null);
        setStdout("");
        setStderr("");
        setBottomDockTab("console");

        const startTime = Date.now();

        try {
            // LAYER 1: Spring Boot Backend Process Runner
            const backendPromise = api.post("/developer/code/run", {
                language,
                sourceCode: code,
                stdin: customInput || "",
                timeoutSeconds: 7,
            });

            // Set 8-second timeout for backend attempt
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Backend timeout")), 8000)
            );

            const res: any = await Promise.race([backendPromise, timeoutPromise]);

            if (res && res.data) {
                const data = res.data;
                const isSuccess = data.status === "SUCCESS";
                const isError = data.status === "COMPILATION_ERROR" || data.status === "RUNTIME_ERROR" || data.status === "TIMEOUT";

                setExecStatus({
                    statusType: isSuccess ? "success" : isError ? "error" : "warning",
                    label: data.status === "SUCCESS" ? "Accepted" : data.status.replace("_", " "),
                    time: `${data.executionTimeMs || Date.now() - startTime}ms`,
                    memory: data.memoryKb ? `${data.memoryKb} KB` : null,
                });

                setStdout(data.stdout || "");
                setStderr(data.stderr || "");
                setIsRunning(false);
                return;
            }
        } catch (backendErr) {
            // LAYER 2: Fallback to high-speed Judge0 sandbox if backend is offline/unreachable
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000);

                const res = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        source_code: code,
                        language_id: JUDGE0_LANG_MAP[language],
                        stdin: customInput || "",
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    throw new Error(`Execution error HTTP ${res.status}`);
                }

                const data = await res.json();
                const statusId = data.status?.id || 0;
                const statusDesc = data.status?.description || "Completed";
                const isSuccess = statusId === 3;
                const isError = statusId === 6 || statusId >= 7;

                setExecStatus({
                    statusType: isSuccess ? "success" : isError ? "error" : "warning",
                    label: statusDesc,
                    time: data.time ? `${data.time}s` : `${Date.now() - startTime}ms`,
                    memory: data.memory ? `${data.memory} KB` : null,
                });

                setStdout(data.stdout || "");
                setStderr(data.stderr || data.compile_output || data.message || "");
            } catch (err: any) {
                setExecStatus({
                    statusType: "error",
                    label: "Execution Error",
                });
                setStderr(`Execution service notice: ${err?.message || "Sandbox runner offline. Please check your network connection."}`);
            }
        } finally {
            setIsRunning(false);
        }
    };

    runCodeRef.current = handleRunCode;

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Register custom Antigravity Pure Obsidian Theme
        monaco.editor.defineTheme("antigravity-obsidian", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                { token: "keyword", foreground: "38bdf8", fontStyle: "bold" },
                { token: "string", foreground: "34d399" },
                { token: "number", foreground: "fbbf24" },
                { token: "type", foreground: "c084fc" },
                { token: "function", foreground: "60a5fa" },
                { token: "variable", foreground: "f1f5f9" },
                { token: "delimiter", foreground: "94a3b8" },
            ],
            colors: {
                "editor.background": "#09090b",
                "editor.foreground": "#f8fafc",
                "editor.lineHighlightBackground": "#131316",
                "editorCursor.foreground": "#06b6d4",
                "editorLineNumber.foreground": "#52525b",
                "editorLineNumber.activeForeground": "#22d3ee",
                "editor.selectionBackground": "#1e293b",
                "editorIndentGuide.background": "#27272a",
                "editorIndentGuide.activeBackground": "#3f3f46",
            },
        });

        monaco.editor.setTheme("antigravity-obsidian");

        // Bind Ctrl+Enter or Cmd+Enter to Run Code
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            runCodeRef.current();
        });
    };

    const handleLanguageChange = (newLang: SupportedLanguage) => {
        setLanguage(newLang);
        if (code === BOILERPLATES[language] || !code.trim()) {
            setCode(BOILERPLATES[newLang]);
        }
    };

    const handleFormatCode = () => {
        if (editorRef.current) {
            editorRef.current.getAction("editor.action.formatDocument")?.run();
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

    const handleSaveToVault = () => {
        sessionStorage.setItem(
            "calvion_developer_snippet",
            JSON.stringify({
                title: problemTitle || `Code Snippet (${language.toUpperCase()})`,
                content: code,
                type: "CREDENTIAL",
                description: `Created in Calvion Antigravity IDE - ${language.toUpperCase()}`,
            })
        );
        navigate("/add-asset");
    };

    // AI Analysis simulation based on code parsing
    const handleAiAction = (actionType: "explain" | "complexity" | "bugs") => {
        setIsAiAnalyzing(true);
        setBottomDockTab("ai");
        setAiResponse(null);

        setTimeout(() => {
            setIsAiAnalyzing(false);
            const lines = code.split("\n").filter((l) => l.trim().length > 0).length;
            const hasLoop = code.includes("for") || code.includes("while");
            const hasNestedLoop = (code.match(/for|while/g) || []).length > 1;
            const hasRecursion = code.includes("solve") || code.includes("dfs") || code.includes("helper");

            if (actionType === "explain") {
                setAiResponse(
                    `### 🧠 Antigravity Code Breakdown\n\n` +
                    `- **Language**: ${language.toUpperCase()} (${lines} logical lines)\n` +
                    `- **Program Flow**: The script starts execution at the main entry point, ingests custom input from standard input (\`stdin\`), and systematically processes test cases.\n` +
                    `- **Control Flow**: ${hasRecursion ? "Uses recursive / functional dispatch to decompose the problem space." : hasLoop ? "Uses iterative loops to step through inputs or state vectors." : "Uses linear control flow with standard input ingestion."}\n` +
                    `- **Memory Model**: Stores input tokens in memory, ensuring $O(1)$ to $O(N)$ space allocation.`
                );
            } else if (actionType === "complexity") {
                const timeComp = hasNestedLoop ? "O(N²)" : hasLoop ? "O(N)" : "O(1)";
                const spaceComp = code.includes("vector") || code.includes("split") || code.includes("map") ? "O(N)" : "O(1)";

                setAiResponse(
                    `### ⏱️ Time & Space Complexity Analysis\n\n` +
                    `- **Estimated Time Complexity**: **\`${timeComp}\`**\n` +
                    `  - ${hasNestedLoop ? "Detected nested iteration patterns across input boundaries." : hasLoop ? "Detected single-pass iteration through token list." : "Direct mathematical or $O(1)$ constant operations."}\n` +
                    `- **Auxiliary Space Complexity**: **\`${spaceComp}\`**\n` +
                    `  - Stores input elements and output buffers dynamically.\n` +
                    `- **Competitive Programming Verdict**: Suitable for constraints up to $N \\le 10^{${hasNestedLoop ? "4" : "6"}}$ within 1.0s limit.`
                );
            } else if (actionType === "bugs") {
                setAiResponse(
                    `### 🔍 Edge Case & Bug Vulnerability Inspection\n\n` +
                    `1. **Empty / Null Input**: Ensure empty \`stdin\` does not cause \`IndexOutOfBounds\` or \`StopIteration\`.\n` +
                    `2. **Large Integers**: In languages like C++ or Java, check if values exceed $2^{31}-1$ (use \`long long\` or \`BigInteger\`).\n` +
                    `3. **Division by Zero**: Verify denominators are non-zero before modulo/division operations.\n` +
                    `4. **Fast I/O Check**: ${language === "cpp" ? "Fast I/O is enabled (`ios_base::sync_with_stdio(false)`)." : "Make sure input reading is buffered for massive test cases."}`
                );
            }
        }, 600);
    };

    return (
        <div
            className={`flex flex-col rounded-3xl border border-slate-200 dark:border-neutral-800 bg-[#09090b] text-neutral-100 shadow-2xl overflow-hidden transition-all duration-300 ${
                isFullscreen ? "fixed inset-2 z-50 rounded-2xl" : "w-full"
            }`}
        >
            {/* TOP HEADER CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-[#0c0c0e] px-4 py-2.5 sm:px-5">
                {/* LOGO & TITLE */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
                        <FileCode size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-tight">
                                {problemTitle ? problemTitle : "Antigravity IDE Studio"}
                            </span>
                            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                                Monaco Engine
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                            Dual-layer local backend + high-performance remote sandbox
                        </p>
                    </div>
                </div>

                {/* ACTION TOOLS */}
                <div className="flex items-center flex-wrap gap-2">
                    {/* LANGUAGE SELECTOR */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                            className="h-8 appearance-none rounded-lg border border-neutral-700 bg-neutral-900 pl-2.5 pr-7 text-xs font-semibold text-neutral-200 outline-none transition hover:border-neutral-600 focus:border-cyan-500"
                        >
                            <option value="python">Python 3 (3.11)</option>
                            <option value="javascript">JavaScript (Node.js 18)</option>
                            <option value="cpp">C++ (GCC 14 / C++20)</option>
                            <option value="java">Java (JDK 21)</option>
                            <option value="typescript">TypeScript (5.0)</option>
                            <option value="go">Go (1.22)</option>
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
                            ▼
                        </div>
                    </div>

                    {/* FORMAT CODE */}
                    <button
                        type="button"
                        onClick={handleFormatCode}
                        className="flex h-8 items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Format Code (Prettier / Shift+Alt+F)"
                    >
                        <AlignLeft size={13} />
                        <span className="hidden sm:inline">Format</span>
                    </button>

                    {/* MINIMAP TOGGLE */}
                    <button
                        type="button"
                        onClick={() => setShowMinimap(!showMinimap)}
                        className={`flex h-8 items-center gap-1 rounded-lg border border-neutral-800 px-2.5 text-xs font-medium transition ${
                            showMinimap ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                        }`}
                        title="Toggle Minimap"
                    >
                        <Layers size={13} />
                        <span className="hidden sm:inline">Map</span>
                    </button>

                    {/* WORD WRAP */}
                    <button
                        type="button"
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`h-8 px-2.5 rounded-lg border border-neutral-800 text-xs font-medium transition ${
                            wordWrap ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                        }`}
                        title="Toggle Word Wrap"
                    >
                        Wrap
                    </button>

                    {/* FONT RESIZE */}
                    <div className="hidden sm:flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5 text-xs font-semibold text-neutral-400">
                        <button
                            type="button"
                            onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                            className="px-1.5 py-0.5 hover:text-white"
                            title="Decrease font size"
                        >
                            A-
                        </button>
                        <span className="px-1 text-[10px] opacity-70">{fontSize}px</span>
                        <button
                            type="button"
                            onClick={() => setFontSize((f) => Math.min(22, f + 1))}
                            className="px-1.5 py-0.5 hover:text-white"
                            title="Increase font size"
                        >
                            A+
                        </button>
                    </div>

                    {/* COPY */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex h-8 items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Copy Code"
                    >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                    </button>

                    {/* DOWNLOAD */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex h-8 items-center rounded-lg border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Download Source Code File"
                    >
                        <Download size={13} />
                    </button>

                    {/* RESET */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex h-8 items-center rounded-lg border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Reset to Template"
                    >
                        <RotateCcw size={13} />
                    </button>

                    {/* FULLSCREEN */}
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex h-8 items-center rounded-lg border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
                    >
                        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>

                    {/* SAVE TO VAULT */}
                    <button
                        type="button"
                        onClick={handleSaveToVault}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 text-xs font-bold text-cyan-400 hover:bg-cyan-900/50 transition"
                        title="Save solution to Calvion Encrypted Vault"
                    >
                        <Lock size={12} />
                        <span className="hidden sm:inline">Vault</span>
                    </button>

                    {/* RUN CODE BUTTON */}
                    <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition"
                    >
                        <Play size={12} className={isRunning ? "animate-spin" : "fill-current"} />
                        <span>{isRunning ? "Running..." : "Run (Ctrl+Enter)"}</span>
                    </button>
                </div>
            </div>

            {/* ANTIGRAVITY FILE TABS */}
            <div className="flex items-center justify-between border-b border-neutral-800 bg-[#0f0f12] px-3">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("code")}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-t-2 transition ${
                            activeTab === "code"
                                ? "border-cyan-500 bg-[#09090b] text-cyan-300 font-semibold"
                                : "border-transparent text-neutral-400 hover:text-neutral-200"
                        }`}
                    >
                        <FileCode size={13} className="text-cyan-400" />
                        <span>{FILE_NAMES[language]}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("input")}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-t-2 transition ${
                            activeTab === "input"
                                ? "border-cyan-500 bg-[#09090b] text-cyan-300 font-semibold"
                                : "border-transparent text-neutral-400 hover:text-neutral-200"
                        }`}
                    >
                        <Settings2 size={13} className="text-amber-400" />
                        <span>stdin.txt</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("readme")}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-t-2 transition ${
                            activeTab === "readme"
                                ? "border-cyan-500 bg-[#09090b] text-cyan-300 font-semibold"
                                : "border-transparent text-neutral-400 hover:text-neutral-200"
                        }`}
                    >
                        <FileText size={13} className="text-purple-400" />
                        <span>README.md</span>
                    </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>UTF-8</span>
                    <span>•</span>
                    <span>Spaces: 4</span>
                </div>
            </div>

            {/* MONACO CODE EDITOR BODY */}
            <div className="relative min-h-[460px] bg-[#09090b]">
                {activeTab === "code" && (
                    <Editor
                        height={isFullscreen ? "calc(100vh - 400px)" : "480px"}
                        language={language}
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        onMount={handleEditorDidMount}
                        theme="antigravity-obsidian"
                        options={{
                            fontSize: fontSize,
                            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                            fontLigatures: true,
                            minimap: { enabled: showMinimap },
                            wordWrap: wordWrap ? "on" : "off",
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on",
                            smoothScrolling: true,
                            bracketPairColorization: { enabled: true },
                            tabSize: 4,
                            padding: { top: 12, bottom: 12 },
                            renderLineHighlight: "all",
                        }}
                    />
                )}

                {activeTab === "input" && (
                    <div className="p-4">
                        <div className="mb-2 text-xs font-bold text-neutral-300 flex items-center justify-between">
                            <span>Standard Input Stream (stdin)</span>
                            <span className="text-[11px] text-neutral-500">Passed to your solution on Run</span>
                        </div>
                        <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter test inputs here..."
                            rows={16}
                            className="w-full rounded-xl border border-neutral-800 bg-[#0c0c0e] p-4 font-mono text-xs text-neutral-200 outline-none focus:border-cyan-500"
                        />
                    </div>
                )}

                {activeTab === "readme" && (
                    <div className="p-6 max-w-3xl text-sm leading-relaxed text-neutral-300">
                        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles size={16} className="text-cyan-400" />
                            Antigravity Developer Studio
                        </h2>
                        <p className="text-neutral-400 mb-4">
                            Welcome to your high-performance in-browser IDE powered by the Monaco VS Code engine and
                            dual-layer execution sandboxes.
                        </p>
                        <div className="space-y-3">
                            <div className="rounded-xl border border-neutral-800 bg-[#0c0c0e] p-3.5">
                                <h4 className="font-semibold text-white text-xs mb-1">⚡ Instant Keyboard Execution</h4>
                                <p className="text-xs text-neutral-400">
                                    Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-400 font-mono">Ctrl + Enter</kbd> or{" "}
                                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-400 font-mono">Cmd + Enter</kbd> to compile and run your code immediately.
                                </p>
                            </div>
                            <div className="rounded-xl border border-neutral-800 bg-[#0c0c0e] p-3.5">
                                <h4 className="font-semibold text-white text-xs mb-1">🛡️ Real Compiler & Runtime Diagnostics</h4>
                                <p className="text-xs text-neutral-400">
                                    Zero simulated outputs. Python tracebacks, C++ compiler errors, and Java exceptions are
                                    rendered accurately with line-by-line debugging traces.
                                </p>
                            </div>
                            <div className="rounded-xl border border-neutral-800 bg-[#0c0c0e] p-3.5">
                                <h4 className="font-semibold text-white text-xs mb-1">🔒 Private Vault Storage</h4>
                                <p className="text-xs text-neutral-400">
                                    Click <strong>Save to Vault</strong> anytime to securely encrypt and persist your algorithms
                                    into your Calvion digital asset vault.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM DOCK PANEL (TERMINAL, STDIN, AI ASSISTANT) */}
            <div className="border-t border-neutral-800 bg-[#0b0b0e] flex flex-col">
                {/* DOCK TABS */}
                <div className="flex flex-wrap items-center justify-between border-b border-neutral-800/80 px-4 py-1.5">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setBottomDockTab("console")}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                                bottomDockTab === "console"
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            <Terminal size={13} className="text-emerald-400" />
                            <span>Terminal Output</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setBottomDockTab("stdin")}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                                bottomDockTab === "stdin"
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            <Settings2 size={13} className="text-cyan-400" />
                            <span>Custom Stdin</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setBottomDockTab("ai")}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                                bottomDockTab === "ai"
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                            }`}
                        >
                            <Bot size={13} className="text-purple-400" />
                            <span>AI Assistant</span>
                        </button>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="flex items-center gap-3">
                        {execStatus && (
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        execStatus.statusType === "success"
                                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                            : execStatus.statusType === "error"
                                            ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                                            : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
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
                                    <span className="flex items-center gap-0.5 text-[10px] text-neutral-400">
                                        <Clock size={10} />
                                        {execStatus.time}
                                    </span>
                                )}
                                {execStatus.memory && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-neutral-400">
                                        <Cpu size={10} />
                                        {execStatus.memory}
                                    </span>
                                )}
                            </div>
                        )}

                        {(stdout || stderr || execStatus) && bottomDockTab === "console" && (
                            <button
                                type="button"
                                onClick={() => {
                                    setStdout("");
                                    setStderr("");
                                    setExecStatus(null);
                                }}
                                className="text-[10px] text-neutral-400 hover:text-neutral-200 transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* DOCK CONTENT AREA */}
                <div className="p-4 min-h-[160px] max-h-[260px] overflow-y-auto font-mono text-xs">
                    {/* TAB 1: CONSOLE */}
                    {bottomDockTab === "console" && (
                        <div>
                            {isRunning ? (
                                <div className="flex items-center gap-2.5 py-4 text-cyan-400">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span className="text-xs font-sans">Compiling & executing in sandbox...</span>
                                </div>
                            ) : stderr ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px] font-sans">
                                        <AlertCircle size={13} />
                                        <span>Diagnostics / Stderr Output:</span>
                                    </div>
                                    <pre className="text-rose-400 whitespace-pre-wrap break-all leading-5 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                                        {stderr}
                                    </pre>
                                    {stdout && (
                                        <div className="mt-3 pt-3 border-t border-neutral-800">
                                            <div className="text-[11px] text-neutral-400 font-semibold mb-1 font-sans">Standard Output (stdout):</div>
                                            <pre className="text-neutral-200 whitespace-pre-wrap break-all leading-5">
                                                {stdout}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ) : stdout ? (
                                <pre className="text-neutral-200 whitespace-pre-wrap break-all leading-5">
                                    {stdout}
                                </pre>
                            ) : execStatus ? (
                                <div className="text-emerald-400 italic text-xs py-2">
                                    Program finished with exit code 0. (No stdout output produced)
                                </div>
                            ) : (
                                <div className="text-neutral-500 italic py-3 font-sans text-xs">
                                    Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Run Code</kbd> or{" "}
                                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Ctrl+Enter</kbd> to compile and execute. Real output & error traces appear here.
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: STDIN */}
                    {bottomDockTab === "stdin" && (
                        <div className="space-y-3 font-sans">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs text-neutral-300 font-medium">Quick Test Case Presets:</span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setCustomInput("5\n10 20 30 40 50")}
                                        className="rounded-lg bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        Array Input
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomInput("Hello\nWorld\nCalvion")}
                                        className="rounded-lg bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        Strings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomInput("3 3\n1 2 3\n4 5 6\n7 8 9")}
                                        className="rounded-lg bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        Matrix
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter custom standard input..."
                                rows={4}
                                className="w-full rounded-xl border border-neutral-800 bg-[#09090b] p-3 font-mono text-xs text-neutral-200 outline-none focus:border-cyan-500"
                            />
                        </div>
                    )}

                    {/* TAB 3: AI ASSISTANT */}
                    {bottomDockTab === "ai" && (
                        <div className="space-y-3 font-sans">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAiAction("explain")}
                                    className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-900/50 transition"
                                >
                                    <Sparkles size={12} />
                                    <span>Explain Algorithm</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAiAction("complexity")}
                                    className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-400 hover:bg-purple-900/50 transition"
                                >
                                    <Clock size={12} />
                                    <span>Analyze Complexity</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAiAction("bugs")}
                                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-900/50 transition"
                                >
                                    <Flame size={12} />
                                    <span>Find Edge Cases & Bugs</span>
                                </button>
                            </div>

                            {isAiAnalyzing ? (
                                <div className="flex items-center gap-2 py-4 text-purple-400">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span className="text-xs">Antigravity AI is inspecting code tokens & patterns...</span>
                                </div>
                            ) : aiResponse ? (
                                <div className="rounded-xl border border-neutral-800 bg-[#09090b] p-3.5 text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
                                    {aiResponse}
                                </div>
                            ) : (
                                <div className="text-neutral-500 text-xs italic py-2">
                                    Select an AI action above to get an instant breakdown of your algorithm&apos;s logic, time & space complexity, or potential edge-case bugs.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* STATUS BAR FOOTER */}
            <div className="flex items-center justify-between border-t border-neutral-800 bg-[#09090b] px-4 py-1.5 text-[11px] text-neutral-400">
                <div className="flex items-center gap-4">
                    <span>Language: <strong className="text-neutral-200 uppercase">{language}</strong></span>
                    <span>Characters: <strong className="text-neutral-200">{code.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={11} className="text-cyan-400" />
                    <span>Calvion Antigravity Engine</span>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
