import React, { useState, useRef, useEffect } from "react";
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
    Bot,
    FileText,
    Flame,
    Columns2,
    Rows2,
    HelpCircle,
    X,
    ExternalLink,
    ChevronDown,
    Plus,
    Code2,
    Zap,
    BookOpen,
    Tag,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { PROBLEMS, type CodingProblem } from "./TestPrepSection";

export type SupportedLanguage = "python" | "javascript" | "cpp" | "java" | "typescript" | "go";
export type EditorTheme = "antigravity-obsidian" | "cyber-neon" | "vs-dark" | "vs-light";
export type LayoutMode = "split" | "stacked";

interface CodeEditorProps {
    initialCode?: string;
    initialLanguage?: SupportedLanguage;
    problemTitle?: string;
    activeProblem?: CodingProblem | null;
    onSelectProblem?: (problem: CodingProblem | null) => void;
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
\t"bufio"
\t"fmt"
\t"os"
)

func main() {
\tscanner := bufio.NewScanner(os.Stdin)
\tif scanner.Scan() {
\t\tfmt.Printf("Go received input: %s\\n", scanner.Text())
\t} else {
\t\tfmt.Println("Hello from Calvion Go Engine!")
\t}
}
`,
};

const TEMPLATES: Record<SupportedLanguage, { label: string; code: string }[]> = {
    python: [
        {
            label: "Fast I/O & Array Ingestion",
            code: `import sys\n\ndef solve():\n    input = sys.stdin.read\n    data = input().split()\n    if not data: return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    print(f"Array of size {n}:", nums)\n\nif __name__ == "__main__":\n    solve()\n`,
        },
        {
            label: "Binary Search Template",
            code: `def binary_search(arr: list[int], target: int) -> int:\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\narr = [1, 3, 5, 7, 9, 11, 15]\nprint("Found at index:", binary_search(arr, 7))\n`,
        },
        {
            label: "BFS / DFS Graph Traversal",
            code: `from collections import deque, defaultdict\n\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\ng = defaultdict(list, {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []})\nprint("BFS Order:", bfs(g, 1))\n`,
        },
        {
            label: "Dynamic Programming Memoization",
            code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint("Fibonacci(30):", fib(30))\n`,
        },
    ],
    javascript: [
        {
            label: "Fast I/O Array Processing",
            code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const nums = input.map(Number);\n    console.log("Sum:", nums.reduce((a, b) => a + b, 0));\n}\n`,
        },
        {
            label: "Binary Search",
            code: `function binarySearch(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\nconsole.log("Index:", binarySearch([2, 4, 6, 8, 10], 8));\n`,
        },
    ],
    cpp: [
        {
            label: "Fast I/O Competitive Boilerplate",
            code: `#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    cout << "Sorted: ";\n    for (int x : a) cout << x << " ";\n    cout << "\\n";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    solve();\n    return 0;\n}\n`,
        },
        {
            label: "Binary Search & Lower Bound",
            code: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30, 40, 50};\n    auto it = lower_bound(v.begin(), v.end(), 30);\n    cout << "Found 30 at index: " << (it - v.begin()) << "\\n";\n    return 0;\n}\n`,
        },
    ],
    java: [
        {
            label: "Fast Scanner Template",
            code: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) {\n            System.out.println("Ready for input");\n            return;\n        }\n        int n = sc.nextInt();\n        int sum = 0;\n        for (int i = 0; i < n; i++) sum += sc.nextInt();\n        System.out.println("Sum of " + n + " numbers: " + sum);\n    }\n}\n`,
        },
    ],
    typescript: [
        {
            label: "Standard Ingestion Template",
            code: `function processInput(data: string): void {\n    const numbers = data.trim().split(/\\s+/).map(Number).filter(n => !isNaN(n));\n    console.log(\`Received \${numbers.length} numbers. Max:\`, Math.max(...numbers));\n}\n\nprocessInput("15 42 8 99 23");\n`,
        },
    ],
    go: [
        {
            label: "Buffered Scanner Template",
            code: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tif scanner.Scan() {\n\t\tparts := strings.Fields(scanner.Text())\n\t\tfmt.Printf("Received %d tokens\\n", len(parts))\n\t}\n}\n`,
        },
    ],
};

const FILE_NAMES: Record<SupportedLanguage, string> = {
    python: "solution.py",
    javascript: "solution.js",
    cpp: "solution.cpp",
    java: "Main.java",
    typescript: "solution.ts",
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

const LANGUAGE_BADGES: Record<SupportedLanguage, { name: string; color: string; dot: string }> = {
    python: { name: "Python 3.11", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", dot: "bg-amber-400" },
    javascript: { name: "JavaScript Node", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", dot: "bg-yellow-400" },
    cpp: { name: "C++ 20 (GCC)", color: "text-blue-400 border-blue-500/30 bg-blue-500/10", dot: "bg-blue-400" },
    java: { name: "Java 21 (JDK)", color: "text-orange-400 border-orange-500/30 bg-orange-500/10", dot: "bg-orange-400" },
    typescript: { name: "TypeScript 5", color: "text-sky-400 border-sky-500/30 bg-sky-500/10", dot: "bg-sky-400" },
    go: { name: "Go 1.22", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", dot: "bg-cyan-400" },
};

interface TestCase {
    id: number;
    name: string;
    input: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    initialCode,
    initialLanguage = "python",
    problemTitle,
    activeProblem: propActiveProblem,
    onSelectProblem,
}) => {
    const navigate = useNavigate();

    // Problem state (either provided by parent or selected internally)
    const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(
        propActiveProblem || null
    );

    // Sync if parent updates prop
    useEffect(() => {
        if (propActiveProblem !== undefined) {
            setSelectedProblem(propActiveProblem);
        }
    }, [propActiveProblem]);

    const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
    const [code, setCode] = useState<string>(
        initialCode ||
        (selectedProblem && selectedProblem.starterCode[initialLanguage as keyof typeof selectedProblem.starterCode]) ||
        BOILERPLATES[initialLanguage]
    );

    // Layout & Theme state
    const [layoutMode, setLayoutMode] = useState<LayoutMode>("split");
    const [editorTheme, setEditorTheme] = useState<EditorTheme>("antigravity-obsidian");
    const [showProblemPane, setShowProblemPane] = useState<boolean>(Boolean(selectedProblem));
    const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
    const [showTemplateMenu, setShowTemplateMenu] = useState<boolean>(false);
    const [showProblemModal, setShowProblemModal] = useState<boolean>(false);
    const [problemSearch, setProblemSearch] = useState<string>("");
    const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

    // Multi-test case state
    const [testCases, setTestCases] = useState<TestCase[]>([
        { id: 1, name: "Case 1", input: "4\n10 20 30 40" },
        { id: 2, name: "Case 2", input: "5\n1 3 5 7 9" },
    ]);
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(1);

    // Tab state
    const [dockTab, setDockTab] = useState<"terminal" | "testcases" | "ai" | "problem">("terminal");

    // Execution state
    const [execStatus, setExecStatus] = useState<{
        statusType: "success" | "error" | "warning";
        label: string;
        time?: string | null;
        memory?: string | null;
        engine?: string;
    } | null>(null);
    const [stdout, setStdout] = useState<string>("");
    const [stderr, setStderr] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // AI Assistant state
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
    const [aiCopied, setAiCopied] = useState<boolean>(false);

    // Editor settings state
    const [copied, setCopied] = useState<boolean>(false);
    const [stdoutCopied, setStdoutCopied] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(14);
    const [showMinimap, setShowMinimap] = useState<boolean>(false);
    const [wordWrap, setWordWrap] = useState<boolean>(true);
    const [tabSize, setTabSize] = useState<number>(4);

    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const runCodeRef = useRef<() => void>(() => {});

    // Sync starter code when selected problem or language changes
    const handleSetProblem = (problem: CodingProblem | null) => {
        setSelectedProblem(problem);
        if (onSelectProblem) onSelectProblem(problem);
        if (problem) {
            setShowProblemPane(true);
            const starter = problem.starterCode[language as keyof typeof problem.starterCode];
            if (starter) {
                setCode(starter);
            }
        }
    };

    const handleLanguageChange = (newLang: SupportedLanguage) => {
        setLanguage(newLang);
        // If current problem has starter code for new language, apply it
        if (selectedProblem && selectedProblem.starterCode[newLang as keyof typeof selectedProblem.starterCode]) {
            setCode(selectedProblem.starterCode[newLang as keyof typeof selectedProblem.starterCode]);
        } else if (code === BOILERPLATES[language] || !code.trim()) {
            setCode(BOILERPLATES[newLang]);
        }
    };

    const activeTestCase = testCases.find((tc) => tc.id === activeTestCaseId) || testCases[0];

    const updateActiveTestCaseInput = (newVal: string) => {
        setTestCases((prev) =>
            prev.map((tc) => (tc.id === activeTestCaseId ? { ...tc, input: newVal } : tc))
        );
    };

    const handleAddTestCase = () => {
        const nextId = testCases.length > 0 ? Math.max(...testCases.map((t) => t.id)) + 1 : 1;
        const newCase: TestCase = {
            id: nextId,
            name: `Case ${nextId}`,
            input: "0",
        };
        setTestCases([...testCases, newCase]);
        setActiveTestCaseId(nextId);
    };

    const handleDeleteTestCase = (id: number) => {
        if (testCases.length <= 1) return;
        const remaining = testCases.filter((t) => t.id !== id);
        setTestCases(remaining);
        if (activeTestCaseId === id) {
            setActiveTestCaseId(remaining[0].id);
        }
    };

    // Run Code logic
    const handleRunCode = async () => {
        setIsRunning(true);
        setExecStatus(null);
        setStdout("");
        setStderr("");
        setDockTab("terminal");

        const startTime = Date.now();
        const currentInput = activeTestCase ? activeTestCase.input : "";

        try {
            // LAYER 1: Spring Boot Backend Process Runner
            const backendPromise = api.post("/developer/code/run", {
                language,
                sourceCode: code,
                stdin: currentInput,
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
                const isError =
                    data.status === "COMPILATION_ERROR" ||
                    data.status === "RUNTIME_ERROR" ||
                    data.status === "TIMEOUT";

                setExecStatus({
                    statusType: isSuccess ? "success" : isError ? "error" : "warning",
                    label: data.status === "SUCCESS" ? "Accepted" : data.status.replace(/_/g, " "),
                    time: `${data.executionTimeMs || Date.now() - startTime}ms`,
                    memory: data.memoryKb ? `${data.memoryKb} KB` : null,
                    engine: "Local Sandbox",
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
                        stdin: currentInput,
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
                    engine: "Judge0 Cloud Sandbox",
                });

                setStdout(data.stdout || "");
                setStderr(data.stderr || data.compile_output || data.message || "");
            } catch (err: any) {
                setExecStatus({
                    statusType: "error",
                    label: "Execution Error",
                    engine: "Diagnostics",
                });
                setStderr(
                    `Execution service notice: ${
                        err?.message || "Sandbox runner offline. Please verify network connectivity."
                    }`
                );
            }
        } finally {
            setIsRunning(false);
        }
    };

    runCodeRef.current = handleRunCode;

    // Register Themes on Mount
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // 1. Antigravity Pure Obsidian Theme
        monaco.editor.defineTheme("antigravity-obsidian", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "64748b", fontStyle: "italic" },
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
                "editor.lineHighlightBackground": "#121216",
                "editorCursor.foreground": "#06b6d4",
                "editorLineNumber.foreground": "#52525b",
                "editorLineNumber.activeForeground": "#22d3ee",
                "editor.selectionBackground": "#1e293b",
                "editorIndentGuide.background": "#27272a",
                "editorIndentGuide.activeBackground": "#3f3f46",
            },
        });

        // 2. Cyber Neon Theme
        monaco.editor.defineTheme("cyber-neon", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "5c6773", fontStyle: "italic" },
                { token: "keyword", foreground: "00f2fe", fontStyle: "bold" },
                { token: "string", foreground: "4ade80" },
                { token: "number", foreground: "f43f5e" },
                { token: "type", foreground: "e879f9" },
                { token: "function", foreground: "38bdf8" },
                { token: "variable", foreground: "e0e7ff" },
            ],
            colors: {
                "editor.background": "#030712",
                "editor.foreground": "#e0e7ff",
                "editor.lineHighlightBackground": "#0f172a",
                "editorCursor.foreground": "#f43f5e",
                "editorLineNumber.foreground": "#334155",
                "editorLineNumber.activeForeground": "#38bdf8",
                "editor.selectionBackground": "#1e1b4b",
            },
        });

        monaco.editor.setTheme(editorTheme);

        // Bind Ctrl+Enter or Cmd+Enter to Run Code
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            runCodeRef.current();
        });
    };

    // Watch theme changes
    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(editorTheme);
        }
    }, [editorTheme]);

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

    const handleCopyStdout = () => {
        navigator.clipboard.writeText(stdout);
        setStdoutCopied(true);
        setTimeout(() => setStdoutCopied(false), 2000);
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
        if (selectedProblem && selectedProblem.starterCode[language as keyof typeof selectedProblem.starterCode]) {
            setCode(selectedProblem.starterCode[language as keyof typeof selectedProblem.starterCode]);
        } else {
            setCode(BOILERPLATES[language]);
        }
        setExecStatus(null);
        setStdout("");
        setStderr("");
    };

    const handleApplyTemplate = (templateCode: string) => {
        setCode(templateCode);
        setShowTemplateMenu(false);
    };

    const handleSaveToVault = () => {
        sessionStorage.setItem(
            "calvion_developer_snippet",
            JSON.stringify({
                title: selectedProblem ? `${selectedProblem.id}. ${selectedProblem.title}` : `Code Snippet (${language.toUpperCase()})`,
                content: code,
                type: "CREDENTIAL",
                description: `Created in Calvion Antigravity IDE - ${language.toUpperCase()}`,
            })
        );
        navigate("/add-asset");
    };

    // AI Analysis simulation based on code parsing
    const handleAiAction = (actionType: "explain" | "complexity" | "bugs" | "optimize" | "tests") => {
        setIsAiAnalyzing(true);
        setDockTab("ai");
        setAiResponse(null);

        setTimeout(() => {
            setIsAiAnalyzing(false);
            const lines = code.split("\n").filter((l) => l.trim().length > 0).length;
            const hasLoop = code.includes("for") || code.includes("while");
            const hasNestedLoop = (code.match(/for|while/g) || []).length > 1;
            const hasRecursion = code.includes("solve") || code.includes("dfs") || code.includes("helper") || code.includes("rec");

            if (actionType === "explain") {
                setAiResponse(
                    `### 🧠 Antigravity Code Breakdown\n\n` +
                    `- **Language**: ${language.toUpperCase()} (${lines} logical lines)\n` +
                    `- **Program Flow**: Ingests input tokens from standard input (\`stdin\`), processes data structures, and writes results to stdout.\n` +
                    `- **Execution Strategy**: ${
                        hasRecursion
                            ? "Utilizes recursive divide-and-conquer logic with functional branching."
                            : hasNestedLoop
                            ? "Employs nested iteration across two-dimensional bounds or paired element comparisons."
                            : hasLoop
                            ? "Single-pass linear scan with efficient sequential state updates."
                            : "Direct constant-time operational flow."
                    }\n` +
                    `- **Memory Model**: Buffers tokens in contiguous memory, minimizing runtime garbage collection overhead.`
                );
            } else if (actionType === "complexity") {
                const timeComp = hasNestedLoop ? "O(N²)" : hasLoop ? "O(N)" : "O(1)";
                const spaceComp = code.includes("vector") || code.includes("split") || code.includes("map") || code.includes("list") ? "O(N)" : "O(1)";

                setAiResponse(
                    `### ⏱️ Time & Space Complexity Metrics\n\n` +
                    `- **Time Complexity**: **\`${timeComp}\`**\n` +
                    `  - ${hasNestedLoop ? "Detected nested loops over input bounds." : hasLoop ? "Linear traversal over array elements." : "Constant time arithmetic operations."}\n` +
                    `- **Auxiliary Space Complexity**: **\`${spaceComp}\`**\n` +
                    `  - ${spaceComp === "O(N)" ? "Allocates auxiliary hash map or dynamic collection buffers." : "Operates in-place with minimal pointer variables."}\n` +
                    `- **Competitive Benchmark**: ${timeComp === "O(1)" || timeComp === "O(N)" ? "✅ Highly optimal. Easily passes within 1.0s under $N \\le 10^6$." : "⚠️ Warning: $O(N^2)$ may time out if $N > 10^4$ within 1.0s limit."}`
                );
            } else if (actionType === "bugs") {
                setAiResponse(
                    `### 🔍 Edge Case & Vulnerability Inspection\n\n` +
                    `1. **Empty / Null Input**: Check standard input handling when \`stdin\` is completely blank or contains whitespace only.\n` +
                    `2. **Numeric Overflow**: In C++ or Java, integer additions or multiplications can overflow $2^{31}-1$. Ensure you use \`long long\` or \`BigInteger\` where appropriate.\n` +
                    `3. **Boundary Indices**: Verify loops termination condition to prevent zero-index or out-of-bounds array access.\n` +
                    `4. **Duplicate Elements**: If searching with Hash Maps, confirm whether identical keys need frequency counting or list chaining.`
                );
            } else if (actionType === "optimize") {
                setAiResponse(
                    `### 🚀 Performance Optimization Recommendations\n\n` +
                    `1. **Fast I/O Buffering**: ${language === "cpp" ? "Fast I/O is active (`cin.tie(NULL)`)." : language === "python" ? "Use `sys.stdin.read().split()` instead of repeated `input()` calls." : "Use buffered reader streams."}\n` +
                    `2. **Memory Pre-allocation**: Avoid dynamic resizing inside loops by initializing vectors or lists with known capacity.\n` +
                    `3. **Early Break**: In linear search or validation loops, return early as soon as the target state is reached.`
                );
            } else if (actionType === "tests") {
                setAiResponse(
                    `### 🧪 Suggested Corner Cases to Test\n\n` +
                    `- **Case A (Minimum Boundary)**: \`0\` or single element array: \`1\\n42\`\n` +
                    `- **Case B (Negative Values)**: Negative values with positive targets: \`-10 -20 50 10\`\n` +
                    `- **Case C (Duplicates)**: Repeated items: \`5\\n2 2 2 2 2\`\n` +
                    `- **Case D (Descending/Sorted)**: Reverse sorted inputs to test worst-case partition behaviors.`
                );
            }
        }, 500);
    };

    const filteredProblems = PROBLEMS.filter((p) => {
        const q = problemSearch.toLowerCase().trim();
        const matchesSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.topic.toLowerCase().includes(q) ||
            p.companies.some((c) => c.toLowerCase().includes(q));
        const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDiff;
    });

    return (
        <div
            className={`flex flex-col rounded-3xl border border-neutral-800 bg-[#09090b] text-neutral-100 shadow-2xl overflow-hidden transition-all duration-300 ${
                isFullscreen ? "fixed inset-2 z-50 rounded-2xl" : "w-full"
            }`}
        >
            {/* TOP HEADER CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/90 bg-[#0c0c0f] px-4 py-2.5 sm:px-6">
                {/* LEFT: TITLE & PROBLEM INFO */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 ring-1 ring-cyan-500/40 shadow-sm">
                        <Code2 size={19} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-white tracking-tight">
                                {selectedProblem
                                    ? `${selectedProblem.id}. ${selectedProblem.title}`
                                    : problemTitle || "Antigravity IDE Studio"}
                            </span>
                            {selectedProblem ? (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                                        selectedProblem.difficulty === "Easy"
                                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                                            : selectedProblem.difficulty === "Medium"
                                            ? "bg-amber-500/10 text-amber-400 ring-amber-500/30"
                                            : "bg-rose-500/10 text-rose-400 ring-rose-500/30"
                                    }`}
                                >
                                    {selectedProblem.difficulty}
                                </span>
                            ) : (
                                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                                    Monaco Core
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            {selectedProblem ? (
                                <span>{selectedProblem.topic} • {selectedProblem.sheet}</span>
                            ) : (
                                <span>Multi-language Sandbox & Competitive Workspace</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: COMPACT TOOLBAR CONTROLS */}
                <div className="flex items-center flex-wrap gap-2">
                    {/* PROBLEM SELECTOR BUTTON */}
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowProblemModal(true)}
                            className={`flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                                selectedProblem
                                    ? "border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40"
                                    : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white"
                            }`}
                            title="Browse & load coding challenges"
                        >
                            <BookOpen size={13} className="text-cyan-400" />
                            <span className="max-w-[140px] sm:max-w-[180px] truncate">
                                {selectedProblem ? `${selectedProblem.id}. ${selectedProblem.title}` : "Pick Problem"}
                            </span>
                            {selectedProblem ? (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetProblem(null);
                                    }}
                                    className="ml-1 rounded-full p-0.5 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 font-bold transition"
                                    title="Clear problem and blank sandbox"
                                >
                                    <X size={11} />
                                </span>
                            ) : (
                                <ChevronDown size={12} className="opacity-70" />
                            )}
                        </button>
                    </div>

                    {/* LANGUAGE SELECTOR */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                            className="h-8 appearance-none rounded-xl border border-neutral-800 bg-neutral-900 pl-3 pr-7 text-xs font-semibold text-neutral-200 outline-none transition hover:border-neutral-700 focus:border-cyan-500 cursor-pointer"
                        >
                            <option value="python">Python 3 (3.11)</option>
                            <option value="javascript">JavaScript (Node.js 18)</option>
                            <option value="cpp">C++ 20 (GCC 14)</option>
                            <option value="java">Java 21 (JDK)</option>
                            <option value="typescript">TypeScript 5.0</option>
                            <option value="go">Go 1.22</option>
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
                            ▼
                        </div>
                    </div>

                    {/* ALGORITHM TEMPLATES */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                            className="flex h-8 items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                            title="Insert Algorithm Starter Template"
                        >
                            <Zap size={13} className="text-amber-400" />
                            <span className="hidden sm:inline">Snippets</span>
                        </button>

                        {showTemplateMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowTemplateMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-neutral-800 bg-[#0e0e12] p-2 shadow-2xl z-50">
                                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                                    {language.toUpperCase()} Starter Snippets
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleApplyTemplate(BOILERPLATES[language])}
                                    className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 transition"
                                >
                                    Default Competitive Template
                                </button>
                                {TEMPLATES[language]?.map((tmpl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleApplyTemplate(tmpl.code)}
                                        className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 transition"
                                    >
                                        {tmpl.label}
                                    </button>
                                ))}
                            </div>
                            </>
                        )}
                    </div>

                    {/* LAYOUT TOGGLE (SPLIT VS STACKED) */}
                    <button
                        type="button"
                        onClick={() => setLayoutMode(layoutMode === "split" ? "stacked" : "split")}
                        className="flex h-8 items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title={layoutMode === "split" ? "Switch to Stacked View" : "Switch to Side-by-Side Split View"}
                    >
                        {layoutMode === "split" ? (
                            <>
                                <Rows2 size={13} className="text-cyan-400" />
                                <span className="hidden md:inline">Stacked</span>
                            </>
                        ) : (
                            <>
                                <Columns2 size={13} className="text-cyan-400" />
                                <span className="hidden md:inline">Split</span>
                            </>
                        )}
                    </button>

                    {/* THEME TOGGLE */}
                    <select
                        value={editorTheme}
                        onChange={(e) => setEditorTheme(e.target.value as EditorTheme)}
                        className="hidden sm:block h-8 appearance-none rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-semibold text-neutral-300 outline-none hover:border-neutral-700 cursor-pointer"
                        title="Editor Syntax Color Theme"
                    >
                        <option value="antigravity-obsidian">Obsidian Dark</option>
                        <option value="cyber-neon">Cyber Neon</option>
                        <option value="vs-dark">VS Dark</option>
                        <option value="vs-light">Clean Light</option>
                    </select>

                    {/* SETTINGS POPOVER */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                            className={`flex h-8 items-center rounded-xl border px-2 text-xs font-medium transition ${
                                showSettingsMenu
                                    ? "border-cyan-500 bg-cyan-950/40 text-cyan-300"
                                    : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                            }`}
                            title="Editor Settings"
                        >
                            <Settings2 size={13} />
                        </button>

                        {showSettingsMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSettingsMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-neutral-800 bg-[#0e0e12] p-3 shadow-2xl z-50 text-xs space-y-2.5">
                                    <div className="font-bold text-neutral-300 border-b border-neutral-800 pb-1.5">
                                        Editor Settings
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-400">Word Wrap</span>
                                        <button
                                            type="button"
                                            onClick={() => setWordWrap(!wordWrap)}
                                            className={`px-2 py-0.5 rounded-lg font-semibold text-[11px] ${
                                                wordWrap ? "bg-cyan-500/20 text-cyan-300" : "bg-neutral-800 text-neutral-400"
                                            }`}
                                        >
                                            {wordWrap ? "ON" : "OFF"}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-400">Minimap</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowMinimap(!showMinimap)}
                                            className={`px-2 py-0.5 rounded-lg font-semibold text-[11px] ${
                                                showMinimap ? "bg-cyan-500/20 text-cyan-300" : "bg-neutral-800 text-neutral-400"
                                            }`}
                                        >
                                            {showMinimap ? "ON" : "OFF"}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-400">Font Size</span>
                                        <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                                                className="px-1.5 hover:text-white"
                                            >
                                                -
                                            </button>
                                            <span className="px-1 text-[10px] text-cyan-300">{fontSize}px</span>
                                            <button
                                                type="button"
                                                onClick={() => setFontSize((f) => Math.min(22, f + 1))}
                                                className="px-1.5 hover:text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-400">Tab Size</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setTabSize(2)}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] ${tabSize === 2 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "bg-neutral-800 text-neutral-400"}`}
                                            >
                                                2
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTabSize(4)}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] ${tabSize === 4 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "bg-neutral-800 text-neutral-400"}`}
                                            >
                                                4
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* FORMAT CODE */}
                    <button
                        type="button"
                        onClick={handleFormatCode}
                        className="flex h-8 items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Format Code (Shift+Alt+F)"
                    >
                        <AlignLeft size={13} />
                        <span className="hidden lg:inline">Format</span>
                    </button>

                    {/* COPY */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex h-8 items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Copy Code"
                    >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span className="hidden xl:inline">{copied ? "Copied" : "Copy"}</span>
                    </button>

                    {/* DOWNLOAD */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex h-8 items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Download Solution File"
                    >
                        <Download size={13} />
                    </button>

                    {/* RESET */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex h-8 items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title="Reset to Template"
                    >
                        <RotateCcw size={13} />
                    </button>

                    {/* KEYBOARD SHORTCUTS MODAL TRIGGER */}
                    <button
                        type="button"
                        onClick={() => setShowShortcutsModal(true)}
                        className="flex h-8 items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-400 hover:text-white transition"
                        title="Keyboard Shortcuts Cheatsheet"
                    >
                        <HelpCircle size={13} />
                    </button>

                    {/* FULLSCREEN */}
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex h-8 items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
                    >
                        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>

                    {/* SAVE TO VAULT */}
                    <button
                        type="button"
                        onClick={handleSaveToVault}
                        className="inline-flex h-8 items-center gap-1 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 text-xs font-bold text-cyan-400 hover:bg-cyan-900/50 transition"
                        title="Save solution to Calvion Encrypted Vault"
                    >
                        <Lock size={12} />
                        <span className="hidden sm:inline">Vault</span>
                    </button>

                    {/* PRIMARY RUN CODE BUTTON */}
                    <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 disabled:opacity-50 transition"
                    >
                        <Play size={12} className={isRunning ? "animate-spin" : "fill-current"} />
                        <span>{isRunning ? "Running..." : "Run"}</span>
                        <kbd className="hidden md:inline rounded bg-black/30 px-1 py-0.2 text-[9px] font-mono font-normal">
                            Ctrl+↵
                        </kbd>
                    </button>
                </div>
            </div>

            {/* PROBLEM DRAWER / TOP NOTIFICATION IF ACTIVE */}
            {selectedProblem && showProblemPane && (
                <div className="flex items-center justify-between border-b border-neutral-800 bg-[#0c0c10] px-4 py-2 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="rounded-md bg-cyan-500/10 text-cyan-400 font-mono font-bold px-1.5 py-0.5 text-[10px]">
                            PROBLEM SPEC
                        </span>
                        <span className="font-semibold text-white truncate">
                            {selectedProblem.id}. {selectedProblem.title}
                        </span>
                        <span className="hidden sm:inline text-neutral-400">
                            • Companies: {selectedProblem.companies.slice(0, 3).join(", ")}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href={selectedProblem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyan-400 hover:underline text-[11px]"
                        >
                            <span>LeetCode</span>
                            <ExternalLink size={11} />
                        </a>
                        <button
                            type="button"
                            onClick={() => setShowProblemPane(false)}
                            className="text-neutral-500 hover:text-neutral-300"
                            title="Hide problem spec header"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN WORKSPACE BODY (SPLIT OR STACKED) */}
            <div
                className={`flex ${
                    layoutMode === "split" ? "flex-col lg:flex-row min-h-[560px]" : "flex-col"
                } bg-[#09090b]`}
            >
                {/* LEFT PANE: CODE EDITOR (60% IN SPLIT MODE) */}
                <div
                    className={`${
                        layoutMode === "split" ? "lg:w-3/5 lg:border-r border-neutral-800" : "w-full"
                    } flex flex-col`}
                >
                    {/* FILE TAB BAR */}
                    <div className="flex items-center justify-between border-b border-neutral-800 bg-[#0c0c0f] px-3">
                        <div className="flex items-center">
                            <div className="flex items-center gap-1.5 border-t-2 border-cyan-500 bg-[#09090b] px-3.5 py-2 text-xs font-semibold text-cyan-300">
                                <FileCode size={13} className="text-cyan-400" />
                                <span>{FILE_NAMES[language]}</span>
                                <span className={`h-1.5 w-1.5 rounded-full ${LANGUAGE_BADGES[language].dot} ml-1`} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 pr-2">
                            <span>UTF-8</span>
                            <span>•</span>
                            <span>{LANGUAGE_BADGES[language].name}</span>
                        </div>
                    </div>

                    {/* MONACO CODE EDITOR */}
                    <div className="relative flex-1 min-h-[440px] bg-[#09090b]">
                        <Editor
                            height={
                                isFullscreen
                                    ? layoutMode === "split"
                                        ? "calc(100vh - 120px)"
                                        : "calc(100vh - 380px)"
                                    : layoutMode === "split"
                                    ? "560px"
                                    : "460px"
                            }
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            onMount={handleEditorDidMount}
                            theme={editorTheme}
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
                                tabSize: tabSize,
                                padding: { top: 12, bottom: 12 },
                                renderLineHighlight: "all",
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT PANE (SPLIT) OR BOTTOM DOCK (STACKED) (40% IN SPLIT MODE) */}
                <div
                    className={`${
                        layoutMode === "split"
                            ? "lg:w-2/5 flex flex-col bg-[#0b0b0e]"
                            : "w-full border-t border-neutral-800 bg-[#0b0b0e] flex flex-col"
                    }`}
                >
                    {/* DOCK TABS */}
                    <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-[#0c0c0f] px-3 py-1.5">
                        <div className="flex items-center gap-1 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setDockTab("terminal")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                                    dockTab === "terminal"
                                        ? "bg-neutral-800 text-white shadow-sm"
                                        : "text-neutral-400 hover:text-neutral-200"
                                }`}
                            >
                                <Terminal size={13} className="text-emerald-400" />
                                <span>Output Console</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDockTab("testcases")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                                    dockTab === "testcases"
                                        ? "bg-neutral-800 text-white shadow-sm"
                                        : "text-neutral-400 hover:text-neutral-200"
                                }`}
                            >
                                <Settings2 size={13} className="text-amber-400" />
                                <span>Test Cases</span>
                                <span className="rounded-full bg-neutral-700 px-1.5 text-[9px]">
                                    {testCases.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDockTab("ai")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                                    dockTab === "ai"
                                        ? "bg-neutral-800 text-white shadow-sm"
                                        : "text-neutral-400 hover:text-neutral-200"
                                }`}
                            >
                                <Bot size={13} className="text-purple-400" />
                                <span>AI Copilot</span>
                            </button>

                            {selectedProblem && (
                                <button
                                    type="button"
                                    onClick={() => setDockTab("problem")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                                        dockTab === "problem"
                                            ? "bg-neutral-800 text-white shadow-sm"
                                            : "text-neutral-400 hover:text-neutral-200"
                                    }`}
                                >
                                    <FileText size={13} className="text-cyan-400" />
                                    <span>Problem Details</span>
                                </button>
                            )}
                        </div>

                        {/* STATUS PILL (IF EXECUTED) */}
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
                                    <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-400 font-mono">
                                        <Clock size={10} />
                                        {execStatus.time}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DOCK CONTENT BODY */}
                    <div className="flex-1 p-4 overflow-y-auto min-h-[280px] max-h-[520px] font-sans text-xs">
                        {/* 1. TERMINAL OUTPUT TAB */}
                        {dockTab === "terminal" && (
                            <div className="space-y-3 font-mono">
                                {isRunning ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-cyan-400">
                                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-current border-t-transparent mb-3" />
                                        <span className="font-semibold text-xs">Compiling & Executing in Sandbox...</span>
                                        <span className="text-[11px] text-neutral-500 mt-1">
                                            Running against {activeTestCase.name}
                                        </span>
                                    </div>
                                ) : execStatus ? (
                                    <div className="space-y-3">
                                        {/* TELEMETRY BAR */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-[#09090b] p-2.5 font-sans">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                    <span>Verdict:</span>
                                                    <span
                                                        className={
                                                            execStatus.statusType === "success"
                                                                ? "text-emerald-400"
                                                                : "text-rose-400"
                                                        }
                                                    >
                                                        {execStatus.label}
                                                    </span>
                                                </div>
                                                {execStatus.time && (
                                                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                                        <Clock size={11} className="text-cyan-400" />
                                                        {execStatus.time}
                                                    </span>
                                                )}
                                                {execStatus.memory && (
                                                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                                        <Cpu size={11} className="text-purple-400" />
                                                        {execStatus.memory}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {execStatus.engine && (
                                                    <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                                                        {execStatus.engine}
                                                    </span>
                                                )}
                                                {stdout && (
                                                    <button
                                                        type="button"
                                                        onClick={handleCopyStdout}
                                                        className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        {stdoutCopied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                                                        <span>{stdoutCopied ? "Copied" : "Copy"}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* ERROR DISPLAY */}
                                        {stderr && (
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                                                    <AlertCircle size={13} />
                                                    <span>Standard Error (stderr) & Diagnostics:</span>
                                                </div>
                                                <pre className="text-rose-400 whitespace-pre-wrap break-all leading-5 bg-rose-950/20 p-3 rounded-xl border border-rose-500/20 text-xs">
                                                    {stderr}
                                                </pre>
                                            </div>
                                        )}

                                        {/* STDOUT DISPLAY */}
                                        {stdout ? (
                                            <div className="space-y-1.5">
                                                <div className="text-[11px] text-neutral-400 font-bold">
                                                    Standard Output (stdout):
                                                </div>
                                                <pre className="text-neutral-100 whitespace-pre-wrap break-all leading-5 bg-[#09090b] p-3 rounded-xl border border-neutral-800 text-xs">
                                                    {stdout}
                                                </pre>
                                            </div>
                                        ) : !stderr ? (
                                            <div className="text-emerald-400 italic text-xs py-2">
                                                Process finished with exit code 0. (No stdout produced)
                                            </div>
                                        ) : null}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500">
                                        <Terminal size={32} className="opacity-30 mb-2" />
                                        <p className="text-xs font-semibold text-neutral-400">No output generated yet</p>
                                        <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                                            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Run</kbd> or{" "}
                                            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Ctrl+Enter</kbd> to compile and execute in the sandbox.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. TEST CASES TAB */}
                        {dockTab === "testcases" && (
                            <div className="space-y-3.5">
                                {/* TEST CASE SELECTOR PILLS */}
                                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                                    <div className="flex items-center gap-1.5 overflow-x-auto">
                                        {testCases.map((tc) => (
                                            <button
                                                key={tc.id}
                                                type="button"
                                                onClick={() => setActiveTestCaseId(tc.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                                                    activeTestCaseId === tc.id
                                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                                        : "bg-neutral-900 text-neutral-400 hover:text-white"
                                                }`}
                                            >
                                                <span>{tc.name}</span>
                                                {testCases.length > 1 && (
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTestCase(tc.id);
                                                        }}
                                                        className="hover:text-rose-400"
                                                    >
                                                        ×
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddTestCase}
                                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                                            title="Add Custom Test Case"
                                        >
                                            <Plus size={13} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                                        <span>Active: <strong>{activeTestCase.name}</strong></span>
                                    </div>
                                </div>

                                {/* PRESET QUICK INSERT CHIPS */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[11px] text-neutral-400 mr-1">Quick Presets:</span>
                                    <button
                                        type="button"
                                        onClick={() => updateActiveTestCaseInput("4\n10 20 30 40")}
                                        className="rounded-lg bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        Array [10..40]
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateActiveTestCaseInput("3 3\n1 2 3\n4 5 6\n7 8 9")}
                                        className="rounded-lg bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        3×3 Matrix
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateActiveTestCaseInput("Hello\nWorld\nCalvion")}
                                        className="rounded-lg bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        String Tokens
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateActiveTestCaseInput("1000000")}
                                        className="rounded-lg bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition"
                                    >
                                        Large Number
                                    </button>
                                </div>

                                {/* STDIN INPUT EDITOR */}
                                <div>
                                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                                        <span>Standard Input Stream (stdin)</span>
                                        <span className="text-[10px]">Passed to program entry point</span>
                                    </div>
                                    <textarea
                                        value={activeTestCase.input}
                                        onChange={(e) => updateActiveTestCaseInput(e.target.value)}
                                        rows={6}
                                        placeholder="Type test case input lines here..."
                                        className="w-full rounded-2xl border border-neutral-800 bg-[#09090b] p-3.5 font-mono text-xs text-neutral-200 outline-none focus:border-cyan-500 transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 3. AI COPILOT TAB */}
                        {dockTab === "ai" && (
                            <div className="space-y-3.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleAiAction("explain")}
                                        className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 transition"
                                    >
                                        <Sparkles size={13} className="text-cyan-400" />
                                        <span>Explain Logic</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAiAction("complexity")}
                                        className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition"
                                    >
                                        <Clock size={13} className="text-purple-400" />
                                        <span>Big-O Complexity</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAiAction("bugs")}
                                        className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition"
                                    >
                                        <Flame size={13} className="text-amber-400" />
                                        <span>Edge Cases & Bugs</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAiAction("optimize")}
                                        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition"
                                    >
                                        <Zap size={13} className="text-emerald-400" />
                                        <span>Optimize Speed</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAiAction("tests")}
                                        className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-900/50 transition"
                                    >
                                        <Settings2 size={13} className="text-blue-400" />
                                        <span>Generate Tests</span>
                                    </button>
                                </div>

                                {isAiAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-purple-400">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent mb-2" />
                                        <span className="text-xs">Antigravity AI is inspecting code tokens & AST structures...</span>
                                    </div>
                                ) : aiResponse ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                                                AI Analysis Report
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(aiResponse);
                                                    setAiCopied(true);
                                                    setTimeout(() => setAiCopied(false), 2000);
                                                }}
                                                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                                            >
                                                {aiCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                                <span>{aiCopied ? "Copied" : "Copy Analysis"}</span>
                                            </button>
                                        </div>
                                        <div className="rounded-2xl border border-neutral-800 bg-[#09090b] p-4 text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
                                            {aiResponse}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-500">
                                        <Bot size={28} className="opacity-30 mb-2" />
                                        <p className="text-xs font-semibold text-neutral-400">Intelligent Code Assistant</p>
                                        <p className="text-[11px] text-neutral-500 mt-1 max-w-sm">
                                            Click any prompt above to generate instantaneous algorithm breakdowns, Big-O metrics, or edge case vulnerability reports.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. PROBLEM DETAILS TAB */}
                        {dockTab === "problem" && selectedProblem && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white">
                                            {selectedProblem.id}. {selectedProblem.title}
                                        </h3>
                                        <p className="text-[11px] text-neutral-400">
                                            Topic: {selectedProblem.topic} • List: {selectedProblem.sheet}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            selectedProblem.difficulty === "Easy"
                                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                : selectedProblem.difficulty === "Medium"
                                                ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                                                : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                                        }`}
                                    >
                                        {selectedProblem.difficulty}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {selectedProblem.companies.map((comp) => (
                                        <span
                                            key={comp}
                                            className="rounded-lg bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 flex items-center gap-1"
                                        >
                                            <Tag size={9} className="text-cyan-400" />
                                            {comp}
                                        </span>
                                    ))}
                                </div>

                                <div className="rounded-xl border border-neutral-800 bg-[#09090b] p-3 text-xs text-neutral-300 space-y-2">
                                    <div className="font-semibold text-white">Challenge Description</div>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Write a complete, high-performance algorithm in {language.toUpperCase()} to solve{" "}
                                        <strong>{selectedProblem.title}</strong>. Read standard input or test cases, process the state efficiently within standard competitive limits (1.0s runtime, 256MB memory), and output the solution.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <a
                                        href={selectedProblem.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition"
                                    >
                                        <span>View on LeetCode</span>
                                        <ExternalLink size={12} />
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const starter = selectedProblem.starterCode[language as keyof typeof selectedProblem.starterCode];
                                            if (starter) setCode(starter);
                                        }}
                                        className="text-xs text-neutral-400 hover:text-white underline"
                                    >
                                        Reload Starter Code
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STATUS BAR FOOTER */}
            <div className="flex flex-wrap items-center justify-between border-t border-neutral-800/80 bg-[#0c0c0f] px-4 py-2 text-[11px] text-neutral-400">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${LANGUAGE_BADGES[language].dot}`} />
                        <strong className="text-neutral-200 uppercase">{language}</strong>
                    </span>
                    <span>
                        Characters: <strong className="text-neutral-200">{code.length}</strong>
                    </span>
                    <span>
                        Lines: <strong className="text-neutral-200">{code.split("\n").length}</strong>
                    </span>
                    <span className="hidden sm:inline">
                        Layout: <strong className="text-neutral-200 capitalize">{layoutMode}</strong>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Sandbox Ready</span>
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Sparkles size={11} className="text-cyan-400" />
                        <span className="text-neutral-300">Calvion Antigravity IDE</span>
                    </div>
                </div>
            </div>

            {/* KEYBOARD SHORTCUTS MODAL */}
            {showShortcutsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-[#0e0e12] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <div className="flex items-center gap-2">
                                <HelpCircle size={18} className="text-cyan-400" />
                                <h3 className="text-sm font-bold text-white">Keyboard Shortcuts & Commands</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowShortcutsModal(false)}
                                className="text-neutral-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 p-2.5">
                                <span className="text-neutral-300">Run Program (Sandbox)</span>
                                <kbd className="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-mono font-bold">
                                    Ctrl + Enter / ⌘ + Enter
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 p-2.5">
                                <span className="text-neutral-300">Format Document</span>
                                <kbd className="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-mono font-bold">
                                    Shift + Alt + F
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 p-2.5">
                                <span className="text-neutral-300">Toggle Line Comment</span>
                                <kbd className="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-mono font-bold">
                                    Ctrl + /
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 p-2.5">
                                <span className="text-neutral-300">Multi-Cursor Selection</span>
                                <kbd className="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-mono font-bold">
                                    Alt + Click
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 p-2.5">
                                <span className="text-neutral-300">Find / Replace</span>
                                <kbd className="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-mono font-bold">
                                    Ctrl + F / Ctrl + H
                                </kbd>
                            </div>
                        </div>

                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                onClick={() => setShowShortcutsModal(false)}
                                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-600 hover:to-blue-700 transition"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CODING PROBLEMS BROWSER MODAL */}
            {showProblemModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-neutral-800 bg-[#0e0e12] p-5 shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                                    <BookOpen size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Coding Challenges Library</h3>
                                    <p className="text-[11px] text-neutral-400">Select a problem to load starter code and specifications</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedProblem && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSetProblem(null);
                                            setShowProblemModal(false);
                                        }}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:text-rose-400 transition"
                                    >
                                        Clear &amp; Blank Sandbox
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowProblemModal(false)}
                                    className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="py-3 space-y-2 border-b border-neutral-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={problemSearch}
                                    onChange={(e) => setProblemSearch(e.target.value)}
                                    placeholder="Search by title, topic (e.g. Arrays, Graph), or company (e.g. Google)..."
                                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 pl-9 text-xs text-neutral-200 outline-none focus:border-cyan-500 transition placeholder:text-neutral-500"
                                />
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                                {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setDifficultyFilter(diff)}
                                        className={`rounded-xl px-3 py-1 font-semibold transition ${
                                            difficultyFilter === diff
                                                ? diff === "Easy"
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : diff === "Medium"
                                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                    : diff === "Hard"
                                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                                        }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                                <span className="ml-auto text-[11px] text-neutral-500">
                                    {filteredProblems.length} available
                                </span>
                            </div>
                        </div>

                        {/* Problems List */}
                        <div className="flex-1 overflow-y-auto py-2 space-y-1.5 pr-1 max-h-[50vh]">
                            {filteredProblems.length === 0 ? (
                                <div className="py-10 text-center text-xs text-neutral-500">
                                    No problems match your search filter.
                                </div>
                            ) : (
                                filteredProblems.map((prob) => {
                                    const isSelected = selectedProblem?.id === prob.id;
                                    return (
                                        <button
                                            key={prob.id}
                                            type="button"
                                            onClick={() => {
                                                handleSetProblem(prob);
                                                setShowProblemModal(false);
                                            }}
                                            className={`w-full flex items-center justify-between rounded-2xl p-3 text-left transition border ${
                                                isSelected
                                                    ? "border-cyan-500/50 bg-cyan-950/20 text-white"
                                                    : "border-neutral-850 bg-neutral-900/50 hover:bg-neutral-800/80 text-neutral-200"
                                            }`}
                                        >
                                            <div className="space-y-1 min-w-0 pr-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs">
                                                        {prob.id}. {prob.title}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                                                            prob.difficulty === "Easy"
                                                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                                : prob.difficulty === "Medium"
                                                                ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                                                                : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                                                        }`}
                                                    >
                                                        {prob.difficulty}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                                                    <span>{prob.topic}</span>
                                                    <span>•</span>
                                                    <span>{prob.sheet}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="hidden sm:inline text-neutral-500">
                                                        {prob.companies.slice(0, 3).join(", ")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                <span
                                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                                                        isSelected
                                                            ? "bg-cyan-500 text-black font-bold"
                                                            : "bg-neutral-800 text-neutral-300 hover:bg-cyan-500 hover:text-black"
                                                    } transition`}
                                                >
                                                    {isSelected ? "Active" : "Load"}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;
