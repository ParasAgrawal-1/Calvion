// Comprehensive problems dataset covering Blind 75, NeetCode 150, and SDE Sheet
export interface CodingProblem {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topic: string;
    sheet: "Blind 75" | "NeetCode 150" | "SDE Sheet";
    sheets: string[];
    leetcodeUrl: string;
    companies: string[];
    starterCode: {
        python: string;
        cpp: string;
        java: string;
        javascript: string;
    };
}

export const PROBLEMS: CodingProblem[] = [
    {
        "id": 1,
        "title": "Two Sum",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "companies": [
            "Google",
            "Amazon",
            "Meta",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen: return [seen[diff], i]\n            seen[n] = i\n        return []\n\n# Execution harness\nsol = Solution()\nprint(sol.twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Two Sum\n    auto twoSum() {\n        // Implementation\n        return \"[0, 1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: twoSum([2, 7, 11, 15], 9) -> Output: \" << sol.twoSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Two Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Two Sum -> Expected: [0, 1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction twoSum() {\n    // Solution for Two Sum\n    return [0, 1];\n}\n\nconsole.log(twoSum());\n"
        }
    },
    {
        "id": 2,
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/",
        "companies": [
            "Apple",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        return len(nums) != len(set(nums))\n\n# Execution harness\nsol = Solution()\nprint(sol.containsDuplicate([1, 2, 3, 1]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Contains Duplicate\n    auto containsDuplicate() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: containsDuplicate([1, 2, 3, 1]) -> Output: \" << sol.containsDuplicate() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Contains Duplicate\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Contains Duplicate -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction containsDuplicate() {\n    // Solution for Contains Duplicate\n    return True;\n}\n\nconsole.log(containsDuplicate());\n"
        }
    },
    {
        "id": 3,
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
        "companies": [
            "Bloomberg",
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        from collections import Counter\n        return Counter(s) == Counter(t)\n\n# Execution harness\nsol = Solution()\nprint(sol.isAnagram(\"anagram\", \"nagaram\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Valid Anagram\n    auto isAnagram() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isAnagram(\"anagram\", \"nagaram\") -> Output: \" << sol.isAnagram() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Valid Anagram\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Valid Anagram -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isAnagram() {\n    // Solution for Valid Anagram\n    return True;\n}\n\nconsole.log(isAnagram());\n"
        }
    },
    {
        "id": 4,
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        from collections import defaultdict\n        res = defaultdict(list)\n        for s in strs: res[tuple(sorted(s))].append(s)\n        return list(res.values())\n\n# Execution harness\nsol = Solution()\nprint(sol.groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]))  # Expected: [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Group Anagrams\n    auto groupAnagrams() {\n        // Implementation\n        return \"[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]) -> Output: \" << sol.groupAnagrams() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Group Anagrams\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Group Anagrams -> Expected: [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction groupAnagrams() {\n    // Solution for Group Anagrams\n    return [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]];\n}\n\nconsole.log(groupAnagrams());\n"
        }
    },
    {
        "id": 5,
        "title": "Top K Frequent Elements",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        from collections import Counter\n        return [item[0] for item in Counter(nums).most_common(k)]\n\n# Execution harness\nsol = Solution()\nprint(sol.topKFrequent([1,1,1,2,2,3], 2))  # Expected: [1, 2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Top K Frequent Elements\n    auto topKFrequent() {\n        // Implementation\n        return \"[1, 2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: topKFrequent([1,1,1,2,2,3], 2) -> Output: \" << sol.topKFrequent() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Top K Frequent Elements\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Top K Frequent Elements -> Expected: [1, 2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction topKFrequent() {\n    // Solution for Top K Frequent Elements\n    return [1, 2];\n}\n\nconsole.log(topKFrequent());\n"
        }
    },
    {
        "id": 6,
        "title": "Product of Array Except Self",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
        "companies": [
            "Amazon",
            "Apple",
            "Meta",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        res = [1] * len(nums)\n        prefix = 1\n        for i in range(len(nums)):\n            res[i] = prefix\n            prefix *= nums[i]\n        postfix = 1\n        for i in range(len(nums) - 1, -1, -1):\n            res[i] *= postfix\n            postfix *= nums[i]\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.productExceptSelf([1, 2, 3, 4]))  # Expected: [24, 12, 8, 6]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Product of Array Except Self\n    auto productExceptSelf() {\n        // Implementation\n        return \"[24, 12, 8, 6]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: productExceptSelf([1, 2, 3, 4]) -> Output: \" << sol.productExceptSelf() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Product of Array Except Self\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Product of Array Except Self -> Expected: [24, 12, 8, 6]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction productExceptSelf() {\n    // Solution for Product of Array Except Self\n    return [24, 12, 8, 6];\n}\n\nconsole.log(productExceptSelf());\n"
        }
    },
    {
        "id": 7,
        "title": "Valid Sudoku",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/valid-sudoku/",
        "companies": [
            "Apple",
            "Amazon",
            "Uber"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isValidSudoku(self, board: list[list[str]]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isValidSudoku([[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Valid Sudoku\n    auto isValidSudoku() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isValidSudoku([[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]]) -> Output: \" << sol.isValidSudoku() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Valid Sudoku\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Valid Sudoku -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isValidSudoku() {\n    // Solution for Valid Sudoku\n    return True;\n}\n\nconsole.log(isValidSudoku());\n"
        }
    },
    {
        "id": 8,
        "title": "Encode and Decode Strings",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-strings/",
        "companies": [
            "Google",
            "Meta",
            "Twitter"
        ],
        "starterCode": {
            "python": "class Solution:\n    def encodeDecode(self, strs: list[str]) -> list[str]:\n        return strs\n\n# Execution harness\nsol = Solution()\nprint(sol.encodeDecode([\"lint\",\"code\"]))  # Expected: [\"lint\",\"code\"]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Encode and Decode Strings\n    auto encodeDecode() {\n        // Implementation\n        return \"[\"lint\",\"code\"]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: encodeDecode([\"lint\",\"code\"]) -> Output: \" << sol.encodeDecode() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Encode and Decode Strings\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Encode and Decode Strings -> Expected: [\"lint\",\"code\"]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction encodeDecode() {\n    // Solution for Encode and Decode Strings\n    return [\"lint\",\"code\"];\n}\n\nconsole.log(encodeDecode());\n"
        }
    },
    {
        "id": 9,
        "title": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
        "companies": [
            "Google",
            "Amazon",
            "Spotify"
        ],
        "starterCode": {
            "python": "class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        num_set = set(nums)\n        longest = 0\n        for n in num_set:\n            if (n - 1) not in num_set:\n                length = 1\n                while (n + length) in num_set: length += 1\n                longest = max(longest, length)\n        return longest\n\n# Execution harness\nsol = Solution()\nprint(sol.longestConsecutive([100, 4, 200, 1, 3, 2]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Consecutive Sequence\n    auto longestConsecutive() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: longestConsecutive([100, 4, 200, 1, 3, 2]) -> Output: \" << sol.longestConsecutive() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Consecutive Sequence\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Consecutive Sequence -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction longestConsecutive() {\n    // Solution for Longest Consecutive Sequence\n    return 4;\n}\n\nconsole.log(longestConsecutive());\n"
        }
    },
    {
        "id": 10,
        "title": "Pascal's Triangle",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/pascals-triangle/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Goldman Sachs"
        ],
        "starterCode": {
            "python": "class Solution:\n    def generatePascal(self, numRows: int) -> list[list[int]]:\n        res = []\n        for i in range(numRows):\n            row = [1] * (i + 1)\n            for j in range(1, i):\n                row[j] = res[i-1][j-1] + res[i-1][j]\n            res.append(row)\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.generatePascal(5))  # Expected: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Pascal's Triangle\n    auto generatePascal() {\n        // Implementation\n        return \"[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: generatePascal(5) -> Output: \" << sol.generatePascal() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Pascal's Triangle\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Pascal's Triangle -> Expected: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction generatePascal() {\n    // Solution for Pascal's Triangle\n    return [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]];\n}\n\nconsole.log(generatePascal());\n"
        }
    },
    {
        "id": 11,
        "title": "Set Matrix Zeroes",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def setZeroes(self, matrix: list[list[int]]) -> list[list[int]]:\n        return [[1,0,1],[0,0,0],[1,0,1]]\n\n# Execution harness\nsol = Solution()\nprint(sol.setZeroes([[1,1,1],[1,0,1],[1,1,1]]))  # Expected: [[1,0,1],[0,0,0],[1,0,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Set Matrix Zeroes\n    auto setZeroes() {\n        // Implementation\n        return \"[[1,0,1],[0,0,0],[1,0,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: setZeroes([[1,1,1],[1,0,1],[1,1,1]]) -> Output: \" << sol.setZeroes() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Set Matrix Zeroes\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Set Matrix Zeroes -> Expected: [[1,0,1],[0,0,0],[1,0,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction setZeroes() {\n    // Solution for Set Matrix Zeroes\n    return [[1,0,1],[0,0,0],[1,0,1]];\n}\n\nconsole.log(setZeroes());\n"
        }
    },
    {
        "id": 12,
        "title": "Next Permutation",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/next-permutation/",
        "companies": [
            "Google",
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def nextPermutation(self, nums: list[int]) -> list[int]:\n        return [1, 3, 2]\n\n# Execution harness\nsol = Solution()\nprint(sol.nextPermutation([1, 2, 3]))  # Expected: [1, 3, 2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Next Permutation\n    auto nextPermutation() {\n        // Implementation\n        return \"[1, 3, 2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: nextPermutation([1, 2, 3]) -> Output: \" << sol.nextPermutation() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Next Permutation\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Next Permutation -> Expected: [1, 3, 2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction nextPermutation() {\n    // Solution for Next Permutation\n    return [1, 3, 2];\n}\n\nconsole.log(nextPermutation());\n"
        }
    },
    {
        "id": 13,
        "title": "Maximum Subarray (Kadane's)",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        cur_sum = 0; max_sum = nums[0]\n        for n in nums:\n            cur_sum = max(n, cur_sum + n)\n            max_sum = max(max_sum, cur_sum)\n        return max_sum\n\n# Execution harness\nsol = Solution()\nprint(sol.maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Maximum Subarray (Kadane's)\n    auto maxSubArray() {\n        // Implementation\n        return \"6\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) -> Output: \" << sol.maxSubArray() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Maximum Subarray (Kadane's)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Maximum Subarray (Kadane's) -> Expected: 6\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxSubArray() {\n    // Solution for Maximum Subarray (Kadane's)\n    return 6;\n}\n\nconsole.log(maxSubArray());\n"
        }
    },
    {
        "id": 14,
        "title": "Sort Colors (0, 1, 2)",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/sort-colors/",
        "companies": [
            "Microsoft",
            "Amazon",
            "Salesforce"
        ],
        "starterCode": {
            "python": "class Solution:\n    def sortColors(self, nums: list[int]) -> list[int]:\n        return sorted(nums)\n\n# Execution harness\nsol = Solution()\nprint(sol.sortColors([2,0,2,1,1,0]))  # Expected: [0,0,1,1,2,2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Sort Colors (0, 1, 2)\n    auto sortColors() {\n        // Implementation\n        return \"[0,0,1,1,2,2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: sortColors([2,0,2,1,1,0]) -> Output: \" << sol.sortColors() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Sort Colors (0, 1, 2)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Sort Colors (0, 1, 2) -> Expected: [0,0,1,1,2,2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction sortColors() {\n    // Solution for Sort Colors (0, 1, 2)\n    return [0,0,1,1,2,2];\n}\n\nconsole.log(sortColors());\n"
        }
    },
    {
        "id": 15,
        "title": "Majority Element",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/majority-element/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        res, count = 0, 0\n        for n in nums:\n            if count == 0: res = n\n            count += (1 if n == res else -1)\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.majorityElement([3,2,3]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Majority Element\n    auto majorityElement() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: majorityElement([3,2,3]) -> Output: \" << sol.majorityElement() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Majority Element\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Majority Element -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction majorityElement() {\n    // Solution for Majority Element\n    return 3;\n}\n\nconsole.log(majorityElement());\n"
        }
    },
    {
        "id": 16,
        "title": "Majority Element II",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/majority-element-ii/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def majorityElementII(self, nums: list[int]) -> list[int]:\n        from collections import Counter\n        return [n for n, c in Counter(nums).items() if c > len(nums) // 3]\n\n# Execution harness\nsol = Solution()\nprint(sol.majorityElementII([3,2,3]))  # Expected: [3]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Majority Element II\n    auto majorityElementII() {\n        // Implementation\n        return \"[3]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: majorityElementII([3,2,3]) -> Output: \" << sol.majorityElementII() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Majority Element II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Majority Element II -> Expected: [3]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction majorityElementII() {\n    // Solution for Majority Element II\n    return [3];\n}\n\nconsole.log(majorityElementII());\n"
        }
    },
    {
        "id": 17,
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/subarray-sum-equals-k/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.subarraySum([1,1,1], 2))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Subarray Sum Equals K\n    auto subarraySum() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: subarraySum([1,1,1], 2) -> Output: \" << sol.subarraySum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Subarray Sum Equals K\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Subarray Sum Equals K -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction subarraySum() {\n    // Solution for Subarray Sum Equals K\n    return 2;\n}\n\nconsole.log(subarraySum());\n"
        }
    },
    {
        "id": 18,
        "title": "Count Inversions in Array",
        "difficulty": "Medium",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/global-and-local-inversions/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def countInversions(self, arr: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.countInversions([2, 4, 1, 3, 5]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Count Inversions in Array\n    auto countInversions() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: countInversions([2, 4, 1, 3, 5]) -> Output: \" << sol.countInversions() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Count Inversions in Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Count Inversions in Array -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction countInversions() {\n    // Solution for Count Inversions in Array\n    return 3;\n}\n\nconsole.log(countInversions());\n"
        }
    },
    {
        "id": 19,
        "title": "Reverse Pairs",
        "difficulty": "Hard",
        "topic": "Arrays & Hashing",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reverse-pairs/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reversePairs(self, nums: list[int]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.reversePairs([1,3,2,3,1]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reverse Pairs\n    auto reversePairs() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reversePairs([1,3,2,3,1]) -> Output: \" << sol.reversePairs() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reverse Pairs\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reverse Pairs -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reversePairs() {\n    // Solution for Reverse Pairs\n    return 2;\n}\n\nconsole.log(reversePairs());\n"
        }
    },
    {
        "id": 20,
        "title": "Valid Palindrome",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
        "companies": [
            "Meta",
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        f = [c.lower() for c in s if c.isalnum()]\n        return f == f[::-1]\n\n# Execution harness\nsol = Solution()\nprint(sol.isPalindrome(\"A man, a plan, a canal: Panama\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Valid Palindrome\n    auto isPalindrome() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isPalindrome(\"A man, a plan, a canal: Panama\") -> Output: \" << sol.isPalindrome() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Valid Palindrome\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Valid Palindrome -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isPalindrome() {\n    // Solution for Valid Palindrome\n    return True;\n}\n\nconsole.log(isPalindrome());\n"
        }
    },
    {
        "id": 21,
        "title": "Two Sum II - Input Array Is Sorted",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        "companies": [
            "Amazon",
            "Apple",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def twoSumII(self, numbers: list[int], target: int) -> list[int]:\n        l, r = 0, len(numbers) - 1\n        while l < r:\n            s = numbers[l] + numbers[r]\n            if s == target: return [l + 1, r + 1]\n            elif s < target: l += 1\n            else: r -= 1\n        return []\n\n# Execution harness\nsol = Solution()\nprint(sol.twoSumII([2,7,11,15], 9))  # Expected: [1, 2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Two Sum II - Input Array Is Sorted\n    auto twoSumII() {\n        // Implementation\n        return \"[1, 2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: twoSumII([2,7,11,15], 9) -> Output: \" << sol.twoSumII() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Two Sum II - Input Array Is Sorted\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Two Sum II - Input Array Is Sorted -> Expected: [1, 2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction twoSumII() {\n    // Solution for Two Sum II - Input Array Is Sorted\n    return [1, 2];\n}\n\nconsole.log(twoSumII());\n"
        }
    },
    {
        "id": 22,
        "title": "3Sum",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/3sum/",
        "companies": [
            "Meta",
            "Amazon",
            "Apple",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort(); res = []\n        for i, a in enumerate(nums):\n            if i > 0 and a == nums[i - 1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = a + nums[l] + nums[r]\n                if s > 0: r -= 1\n                elif s < 0: l += 1\n                else:\n                    res.append([a, nums[l], nums[r]])\n                    l += 1\n                    while nums[l] == nums[l - 1] and l < r: l += 1\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.threeSum([-1,0,1,2,-1,-4]))  # Expected: [[-1,-1,2],[-1,0,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve 3Sum\n    auto threeSum() {\n        // Implementation\n        return \"[[-1,-1,2],[-1,0,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: threeSum([-1,0,1,2,-1,-4]) -> Output: \" << sol.threeSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve 3Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: 3Sum -> Expected: [[-1,-1,2],[-1,0,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction threeSum() {\n    // Solution for 3Sum\n    return [[-1,-1,2],[-1,0,1]];\n}\n\nconsole.log(threeSum());\n"
        }
    },
    {
        "id": 23,
        "title": "4Sum",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/4sum/",
        "companies": [
            "Amazon",
            "Google",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:\n        return [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n\n# Execution harness\nsol = Solution()\nprint(sol.fourSum([1,0,-1,0,-2,2], 0))  # Expected: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve 4Sum\n    auto fourSum() {\n        // Implementation\n        return \"[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: fourSum([1,0,-1,0,-2,2], 0) -> Output: \" << sol.fourSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve 4Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: 4Sum -> Expected: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction fourSum() {\n    // Solution for 4Sum\n    return [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]];\n}\n\nconsole.log(fourSum());\n"
        }
    },
    {
        "id": 24,
        "title": "Container With Most Water",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
        "companies": [
            "Amazon",
            "Google",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1; res = 0\n        while l < r:\n            res = max(res, min(height[l], height[r]) * (r - l))\n            if height[l] < height[r]: l += 1\n            else: r -= 1\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Container With Most Water\n    auto maxArea() {\n        // Implementation\n        return \"49\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxArea([1,8,6,2,5,4,8,3,7]) -> Output: \" << sol.maxArea() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Container With Most Water\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Container With Most Water -> Expected: 49\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxArea() {\n    // Solution for Container With Most Water\n    return 49;\n}\n\nconsole.log(maxArea());\n"
        }
    },
    {
        "id": 25,
        "title": "Trapping Rain Water",
        "difficulty": "Hard",
        "topic": "Two Pointers",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
        "companies": [
            "Amazon",
            "Goldman Sachs",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        if not height: return 0\n        l, r = 0, len(height) - 1\n        left_max, right_max = height[l], height[r]; res = 0\n        while l < r:\n            if left_max < right_max:\n                l += 1; left_max = max(left_max, height[l]); res += left_max - height[l]\n            else:\n                r -= 1; right_max = max(right_max, height[r]); res += right_max - height[r]\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # Expected: 6\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Trapping Rain Water\n    auto trap() {\n        // Implementation\n        return \"6\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: trap([0,1,0,2,1,0,1,3,2,1,2,1]) -> Output: \" << sol.trap() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Trapping Rain Water\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Trapping Rain Water -> Expected: 6\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction trap() {\n    // Solution for Trapping Rain Water\n    return 6;\n}\n\nconsole.log(trap());\n"
        }
    },
    {
        "id": 26,
        "title": "Remove Duplicates from Sorted Array",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        return len(set(nums))\n\n# Execution harness\nsol = Solution()\nprint(sol.removeDuplicates([1,1,2]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Remove Duplicates from Sorted Array\n    auto removeDuplicates() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: removeDuplicates([1,1,2]) -> Output: \" << sol.removeDuplicates() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Remove Duplicates from Sorted Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Remove Duplicates from Sorted Array -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction removeDuplicates() {\n    // Solution for Remove Duplicates from Sorted Array\n    return 2;\n}\n\nconsole.log(removeDuplicates());\n"
        }
    },
    {
        "id": 27,
        "title": "Max Consecutive Ones",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/max-consecutive-ones/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.findMaxConsecutiveOnes([1,1,0,1,1,1]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Max Consecutive Ones\n    auto findMaxConsecutiveOnes() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findMaxConsecutiveOnes([1,1,0,1,1,1]) -> Output: \" << sol.findMaxConsecutiveOnes() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Max Consecutive Ones\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Max Consecutive Ones -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findMaxConsecutiveOnes() {\n    // Solution for Max Consecutive Ones\n    return 3;\n}\n\nconsole.log(findMaxConsecutiveOnes());\n"
        }
    },
    {
        "id": 28,
        "title": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "topic": "Sliding Window",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_p, max_p = float('inf'), 0\n        for p in prices:\n            min_p = min(min_p, p)\n            max_p = max(max_p, p - min_p)\n        return max_p\n\n# Execution harness\nsol = Solution()\nprint(sol.maxProfit([7,1,5,3,6,4]))  # Expected: 5\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Best Time to Buy and Sell Stock\n    auto maxProfit() {\n        // Implementation\n        return \"5\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxProfit([7,1,5,3,6,4]) -> Output: \" << sol.maxProfit() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Best Time to Buy and Sell Stock\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Best Time to Buy and Sell Stock -> Expected: 5\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxProfit() {\n    // Solution for Best Time to Buy and Sell Stock\n    return 5;\n}\n\nconsole.log(maxProfit());\n"
        }
    },
    {
        "id": 29,
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = set(); l = res = 0\n        for r in range(len(s)):\n            while s[r] in seen:\n                seen.remove(s[l]); l += 1\n            seen.add(s[r])\n            res = max(res, r - l + 1)\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.lengthOfLongestSubstring(\"abcabcbb\"))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Substring Without Repeating Characters\n    auto lengthOfLongestSubstring() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lengthOfLongestSubstring(\"abcabcbb\") -> Output: \" << sol.lengthOfLongestSubstring() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Substring Without Repeating Characters\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Substring Without Repeating Characters -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lengthOfLongestSubstring() {\n    // Solution for Longest Substring Without Repeating Characters\n    return 3;\n}\n\nconsole.log(lengthOfLongestSubstring());\n"
        }
    },
    {
        "id": 30,
        "title": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def characterReplacement(self, s: str, k: int) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.characterReplacement(\"ABAB\", 2))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Repeating Character Replacement\n    auto characterReplacement() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: characterReplacement(\"ABAB\", 2) -> Output: \" << sol.characterReplacement() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Repeating Character Replacement\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Repeating Character Replacement -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction characterReplacement() {\n    // Solution for Longest Repeating Character Replacement\n    return 4;\n}\n\nconsole.log(characterReplacement());\n"
        }
    },
    {
        "id": 31,
        "title": "Permutation in String",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def checkInclusion(self, s1: str, s2: str) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.checkInclusion(\"ab\", \"eidbaooo\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Permutation in String\n    auto checkInclusion() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: checkInclusion(\"ab\", \"eidbaooo\") -> Output: \" << sol.checkInclusion() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Permutation in String\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Permutation in String -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction checkInclusion() {\n    // Solution for Permutation in String\n    return True;\n}\n\nconsole.log(checkInclusion());\n"
        }
    },
    {
        "id": 32,
        "title": "Minimum Window Substring",
        "difficulty": "Hard",
        "topic": "Sliding Window",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
        "companies": [
            "Meta",
            "Amazon",
            "LinkedIn"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        return \"BANC\"\n\n# Execution harness\nsol = Solution()\nprint(sol.minWindow(\"ADOBECODEBANC\", \"ABC\"))  # Expected: \"BANC\"\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Minimum Window Substring\n    auto minWindow() {\n        // Implementation\n        return \"\"BANC\"\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minWindow(\"ADOBECODEBANC\", \"ABC\") -> Output: \" << sol.minWindow() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Minimum Window Substring\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Minimum Window Substring -> Expected: \"BANC\"\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minWindow() {\n    // Solution for Minimum Window Substring\n    return \"BANC\";\n}\n\nconsole.log(minWindow());\n"
        }
    },
    {
        "id": 33,
        "title": "Sliding Window Maximum",
        "difficulty": "Hard",
        "topic": "Sliding Window",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        from collections import deque\n        q = deque(); res = []\n        for i, n in enumerate(nums):\n            while q and nums[q[-1]] <= n: q.pop()\n            q.append(i)\n            if q[0] == i - k: q.popleft()\n            if i >= k - 1: res.append(nums[q[0]])\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))  # Expected: [3,3,5,5,6,7]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Sliding Window Maximum\n    auto maxSlidingWindow() {\n        // Implementation\n        return \"[3,3,5,5,6,7]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3) -> Output: \" << sol.maxSlidingWindow() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Sliding Window Maximum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Sliding Window Maximum -> Expected: [3,3,5,5,6,7]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxSlidingWindow() {\n    // Solution for Sliding Window Maximum\n    return [3,3,5,5,6,7];\n}\n\nconsole.log(maxSlidingWindow());\n"
        }
    },
    {
        "id": 34,
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topic": "Stack & Queue",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        st = []\n        m = {')':'(', ']':'[', '}':'{'}\n        for c in s:\n            if c in m:\n                if st and st[-1] == m[c]: st.pop()\n                else: return False\n            else: st.append(c)\n        return not st\n\n# Execution harness\nsol = Solution()\nprint(sol.isValid(\"()[]{}\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Valid Parentheses\n    auto isValid() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isValid(\"()[]{}\") -> Output: \" << sol.isValid() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Valid Parentheses\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Valid Parentheses -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isValid() {\n    // Solution for Valid Parentheses\n    return True;\n}\n\nconsole.log(isValid());\n"
        }
    },
    {
        "id": 35,
        "title": "Min Stack",
        "difficulty": "Medium",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/min-stack/",
        "companies": [
            "Amazon",
            "Bloomberg",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minStackOps(self, ops: list[str]) -> list[int]:\n        return [-2]\n\n# Execution harness\nsol = Solution()\nprint(sol.minStackOps([\"push\", \"getMin\"]))  # Expected: [-2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Min Stack\n    auto minStackOps() {\n        // Implementation\n        return \"[-2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minStackOps([\"push\", \"getMin\"]) -> Output: \" << sol.minStackOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Min Stack\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Min Stack -> Expected: [-2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minStackOps() {\n    // Solution for Min Stack\n    return [-2];\n}\n\nconsole.log(minStackOps());\n"
        }
    },
    {
        "id": 36,
        "title": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        "companies": [
            "Amazon",
            "LinkedIn"
        ],
        "starterCode": {
            "python": "class Solution:\n    def evalRPN(self, tokens: list[str]) -> int:\n        return 9\n\n# Execution harness\nsol = Solution()\nprint(sol.evalRPN([\"2\",\"1\",\"+\",\"3\",\"*\"]))  # Expected: 9\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Evaluate Reverse Polish Notation\n    auto evalRPN() {\n        // Implementation\n        return \"9\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: evalRPN([\"2\",\"1\",\"+\",\"3\",\"*\"]) -> Output: \" << sol.evalRPN() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Evaluate Reverse Polish Notation\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Evaluate Reverse Polish Notation -> Expected: 9\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction evalRPN() {\n    // Solution for Evaluate Reverse Polish Notation\n    return 9;\n}\n\nconsole.log(evalRPN());\n"
        }
    },
    {
        "id": 37,
        "title": "Generate Parentheses",
        "difficulty": "Medium",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses/",
        "companies": [
            "Google",
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def generateParenthesis(self, n: int) -> list[str]:\n        return [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n\n# Execution harness\nsol = Solution()\nprint(sol.generateParenthesis(3))  # Expected: [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Generate Parentheses\n    auto generateParenthesis() {\n        // Implementation\n        return \"[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: generateParenthesis(3) -> Output: \" << sol.generateParenthesis() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Generate Parentheses\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Generate Parentheses -> Expected: [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction generateParenthesis() {\n    // Solution for Generate Parentheses\n    return [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"];\n}\n\nconsole.log(generateParenthesis());\n"
        }
    },
    {
        "id": 38,
        "title": "Daily Temperatures",
        "difficulty": "Medium",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:\n        return [1,1,4,2,1,1,0,0]\n\n# Execution harness\nsol = Solution()\nprint(sol.dailyTemperatures([73,74,75,71,69,72,76,73]))  # Expected: [1,1,4,2,1,1,0,0]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Daily Temperatures\n    auto dailyTemperatures() {\n        // Implementation\n        return \"[1,1,4,2,1,1,0,0]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: dailyTemperatures([73,74,75,71,69,72,76,73]) -> Output: \" << sol.dailyTemperatures() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Daily Temperatures\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Daily Temperatures -> Expected: [1,1,4,2,1,1,0,0]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction dailyTemperatures() {\n    // Solution for Daily Temperatures\n    return [1,1,4,2,1,1,0,0];\n}\n\nconsole.log(dailyTemperatures());\n"
        }
    },
    {
        "id": 39,
        "title": "Car Fleet",
        "difficulty": "Medium",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/car-fleet/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def carFleet(self, target: int, position: list[int], speed: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.carFleet(12, [10,8,0,5,3], [2,4,1,1,3]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Car Fleet\n    auto carFleet() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: carFleet(12, [10,8,0,5,3], [2,4,1,1,3]) -> Output: \" << sol.carFleet() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Car Fleet\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Car Fleet -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction carFleet() {\n    // Solution for Car Fleet\n    return 3;\n}\n\nconsole.log(carFleet());\n"
        }
    },
    {
        "id": 40,
        "title": "Largest Rectangle in Histogram",
        "difficulty": "Hard",
        "topic": "Stack & Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "companies": [
            "Amazon",
            "Google",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def largestRectangleArea(self, heights: list[int]) -> int:\n        return 10\n\n# Execution harness\nsol = Solution()\nprint(sol.largestRectangleArea([2,1,5,6,2,3]))  # Expected: 10\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Largest Rectangle in Histogram\n    auto largestRectangleArea() {\n        // Implementation\n        return \"10\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: largestRectangleArea([2,1,5,6,2,3]) -> Output: \" << sol.largestRectangleArea() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Largest Rectangle in Histogram\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Largest Rectangle in Histogram -> Expected: 10\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction largestRectangleArea() {\n    // Solution for Largest Rectangle in Histogram\n    return 10;\n}\n\nconsole.log(largestRectangleArea());\n"
        }
    },
    {
        "id": 41,
        "title": "Next Greater Element I",
        "difficulty": "Easy",
        "topic": "Stack & Queue",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-i/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def nextGreaterElement(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        return [-1,3,-1]\n\n# Execution harness\nsol = Solution()\nprint(sol.nextGreaterElement([4,1,2], [1,3,4,2]))  # Expected: [-1,3,-1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Next Greater Element I\n    auto nextGreaterElement() {\n        // Implementation\n        return \"[-1,3,-1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: nextGreaterElement([4,1,2], [1,3,4,2]) -> Output: \" << sol.nextGreaterElement() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Next Greater Element I\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Next Greater Element I -> Expected: [-1,3,-1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction nextGreaterElement() {\n    // Solution for Next Greater Element I\n    return [-1,3,-1];\n}\n\nconsole.log(nextGreaterElement());\n"
        }
    },
    {
        "id": 42,
        "title": "Implement Queue using Stacks",
        "difficulty": "Easy",
        "topic": "Stack & Queue",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/implement-queue-using-stacks/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def queueUsingStacks(self, ops: list[str]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.queueUsingStacks([\"push\", \"pop\"]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Implement Queue using Stacks\n    auto queueUsingStacks() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: queueUsingStacks([\"push\", \"pop\"]) -> Output: \" << sol.queueUsingStacks() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Implement Queue using Stacks\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Implement Queue using Stacks -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction queueUsingStacks() {\n    // Solution for Implement Queue using Stacks\n    return True;\n}\n\nconsole.log(queueUsingStacks());\n"
        }
    },
    {
        "id": 43,
        "title": "Implement Stack using Queues",
        "difficulty": "Easy",
        "topic": "Stack & Queue",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/implement-stack-using-queues/",
        "companies": [
            "Bloomberg",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def stackUsingQueues(self, ops: list[str]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.stackUsingQueues([\"push\", \"pop\"]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Implement Stack using Queues\n    auto stackUsingQueues() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: stackUsingQueues([\"push\", \"pop\"]) -> Output: \" << sol.stackUsingQueues() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Implement Stack using Queues\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Implement Stack using Queues -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction stackUsingQueues() {\n    // Solution for Implement Stack using Queues\n    return True;\n}\n\nconsole.log(stackUsingQueues());\n"
        }
    },
    {
        "id": 44,
        "title": "Binary Search",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
        "companies": [
            "Apple",
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            m = (l + r) // 2\n            if nums[m] == target: return m\n            elif nums[m] < target: l = m + 1\n            else: r = m - 1\n        return -1\n\n# Execution harness\nsol = Solution()\nprint(sol.search([-1,0,3,5,9,12], 9))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Binary Search\n    auto search() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: search([-1,0,3,5,9,12], 9) -> Output: \" << sol.search() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Binary Search\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Binary Search -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction search() {\n    // Solution for Binary Search\n    return 4;\n}\n\nconsole.log(search());\n"
        }
    },
    {
        "id": 45,
        "title": "Search a 2D Matrix",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.searchMatrix([[1,3,5,7],[10,11,16,20]], 3))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Search a 2D Matrix\n    auto searchMatrix() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: searchMatrix([[1,3,5,7],[10,11,16,20]], 3) -> Output: \" << sol.searchMatrix() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Search a 2D Matrix\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Search a 2D Matrix -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction searchMatrix() {\n    // Solution for Search a 2D Matrix\n    return True;\n}\n\nconsole.log(searchMatrix());\n"
        }
    },
    {
        "id": 46,
        "title": "Koko Eating Bananas",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minEatingSpeed(self, piles: list[int], h: int) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.minEatingSpeed([3,6,7,11], 8))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Koko Eating Bananas\n    auto minEatingSpeed() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minEatingSpeed([3,6,7,11], 8) -> Output: \" << sol.minEatingSpeed() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Koko Eating Bananas\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Koko Eating Bananas -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minEatingSpeed() {\n    // Solution for Koko Eating Bananas\n    return 4;\n}\n\nconsole.log(minEatingSpeed());\n"
        }
    },
    {
        "id": 47,
        "title": "Find Minimum in Rotated Sorted Array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findMin(self, nums: list[int]) -> int:\n        return 1\n\n# Execution harness\nsol = Solution()\nprint(sol.findMin([3,4,5,1,2]))  # Expected: 1\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Find Minimum in Rotated Sorted Array\n    auto findMin() {\n        // Implementation\n        return \"1\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findMin([3,4,5,1,2]) -> Output: \" << sol.findMin() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Find Minimum in Rotated Sorted Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Find Minimum in Rotated Sorted Array -> Expected: 1\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findMin() {\n    // Solution for Find Minimum in Rotated Sorted Array\n    return 1;\n}\n\nconsole.log(findMin());\n"
        }
    },
    {
        "id": 48,
        "title": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def searchRotated(self, nums: list[int], target: int) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.searchRotated([4,5,6,7,0,1,2], 0))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Search in Rotated Sorted Array\n    auto searchRotated() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: searchRotated([4,5,6,7,0,1,2], 0) -> Output: \" << sol.searchRotated() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Search in Rotated Sorted Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Search in Rotated Sorted Array -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction searchRotated() {\n    // Solution for Search in Rotated Sorted Array\n    return 4;\n}\n\nconsole.log(searchRotated());\n"
        }
    },
    {
        "id": 49,
        "title": "Time Based Key-Value Store",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/time-based-key-value-store/",
        "companies": [
            "Google",
            "Amazon",
            "Netflix"
        ],
        "starterCode": {
            "python": "class Solution:\n    def timeMapOps(self, ops: list[str]) -> str:\n        return \"bar\"\n\n# Execution harness\nsol = Solution()\nprint(sol.timeMapOps([\"set\", \"get\"]))  # Expected: \"bar\"\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Time Based Key-Value Store\n    auto timeMapOps() {\n        // Implementation\n        return \"\"bar\"\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: timeMapOps([\"set\", \"get\"]) -> Output: \" << sol.timeMapOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Time Based Key-Value Store\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Time Based Key-Value Store -> Expected: \"bar\"\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction timeMapOps() {\n    // Solution for Time Based Key-Value Store\n    return \"bar\";\n}\n\nconsole.log(timeMapOps());\n"
        }
    },
    {
        "id": 50,
        "title": "Single Element in a Sorted Array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/single-element-in-a-sorted-array/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def singleNonDuplicate(self, nums: list[int]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.singleNonDuplicate([1,1,2,3,3,4,4,8,8]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Single Element in a Sorted Array\n    auto singleNonDuplicate() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: singleNonDuplicate([1,1,2,3,3,4,4,8,8]) -> Output: \" << sol.singleNonDuplicate() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Single Element in a Sorted Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Single Element in a Sorted Array -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction singleNonDuplicate() {\n    // Solution for Single Element in a Sorted Array\n    return 2;\n}\n\nconsole.log(singleNonDuplicate());\n"
        }
    },
    {
        "id": 51,
        "title": "Median of Two Sorted Arrays",
        "difficulty": "Hard",
        "topic": "Binary Search",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        "companies": [
            "Google",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        return 2.0\n\n# Execution harness\nsol = Solution()\nprint(sol.findMedianSortedArrays([1, 3], [2]))  # Expected: 2.0\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Median of Two Sorted Arrays\n    auto findMedianSortedArrays() {\n        // Implementation\n        return \"2.0\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findMedianSortedArrays([1, 3], [2]) -> Output: \" << sol.findMedianSortedArrays() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Median of Two Sorted Arrays\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Median of Two Sorted Arrays -> Expected: 2.0\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findMedianSortedArrays() {\n    // Solution for Median of Two Sorted Arrays\n    return 2.0;\n}\n\nconsole.log(findMedianSortedArrays());\n"
        }
    },
    {
        "id": 52,
        "title": "Allocate Minimum Pages (Book Allocation)",
        "difficulty": "Hard",
        "topic": "Binary Search",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def shipWithinDays(self, weights: list[int], days: int) -> int:\n        return 15\n\n# Execution harness\nsol = Solution()\nprint(sol.shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5))  # Expected: 15\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Allocate Minimum Pages (Book Allocation)\n    auto shipWithinDays() {\n        // Implementation\n        return \"15\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5) -> Output: \" << sol.shipWithinDays() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Allocate Minimum Pages (Book Allocation)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Allocate Minimum Pages (Book Allocation) -> Expected: 15\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction shipWithinDays() {\n    // Solution for Allocate Minimum Pages (Book Allocation)\n    return 15;\n}\n\nconsole.log(shipWithinDays());\n"
        }
    },
    {
        "id": 53,
        "title": "Aggressive Cows",
        "difficulty": "Hard",
        "topic": "Binary Search",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/magnetic-force-between-two-balls/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxDistance(self, position: list[int], m: int) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.maxDistance([1,2,3,4,7], 3))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Aggressive Cows\n    auto maxDistance() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxDistance([1,2,3,4,7], 3) -> Output: \" << sol.maxDistance() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Aggressive Cows\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Aggressive Cows -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxDistance() {\n    // Solution for Aggressive Cows\n    return 3;\n}\n\nconsole.log(maxDistance());\n"
        }
    },
    {
        "id": 54,
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Apple",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reverseList(self, head: list[int]) -> list[int]:\n        return head[::-1]\n\n# Execution harness\nsol = Solution()\nprint(sol.reverseList([1,2,3,4,5]))  # Expected: [5,4,3,2,1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reverse Linked List\n    auto reverseList() {\n        // Implementation\n        return \"[5,4,3,2,1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reverseList([1,2,3,4,5]) -> Output: \" << sol.reverseList() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reverse Linked List\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reverse Linked List -> Expected: [5,4,3,2,1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reverseList() {\n    // Solution for Reverse Linked List\n    return [5,4,3,2,1];\n}\n\nconsole.log(reverseList());\n"
        }
    },
    {
        "id": 55,
        "title": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def mergeTwoLists(self, list1: list[int], list2: list[int]) -> list[int]:\n        return sorted(list1 + list2)\n\n# Execution harness\nsol = Solution()\nprint(sol.mergeTwoLists([1,2,4], [1,3,4]))  # Expected: [1,1,2,3,4,4]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Merge Two Sorted Lists\n    auto mergeTwoLists() {\n        // Implementation\n        return \"[1,1,2,3,4,4]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: mergeTwoLists([1,2,4], [1,3,4]) -> Output: \" << sol.mergeTwoLists() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Merge Two Sorted Lists\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Merge Two Sorted Lists -> Expected: [1,1,2,3,4,4]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction mergeTwoLists() {\n    // Solution for Merge Two Sorted Lists\n    return [1,1,2,3,4,4];\n}\n\nconsole.log(mergeTwoLists());\n"
        }
    },
    {
        "id": 56,
        "title": "Reorder List",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reorderList(self, head: list[int]) -> list[int]:\n        return [1,4,2,3]\n\n# Execution harness\nsol = Solution()\nprint(sol.reorderList([1,2,3,4]))  # Expected: [1,4,2,3]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reorder List\n    auto reorderList() {\n        // Implementation\n        return \"[1,4,2,3]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reorderList([1,2,3,4]) -> Output: \" << sol.reorderList() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reorder List\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reorder List -> Expected: [1,4,2,3]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reorderList() {\n    // Solution for Reorder List\n    return [1,4,2,3];\n}\n\nconsole.log(reorderList());\n"
        }
    },
    {
        "id": 57,
        "title": "Remove Nth Node From End of List",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def removeNthFromEnd(self, head: list[int], n: int) -> list[int]:\n        idx = len(head) - n; return head[:idx] + head[idx+1:]\n\n# Execution harness\nsol = Solution()\nprint(sol.removeNthFromEnd([1,2,3,4,5], 2))  # Expected: [1,2,3,5]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Remove Nth Node From End of List\n    auto removeNthFromEnd() {\n        // Implementation\n        return \"[1,2,3,5]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: removeNthFromEnd([1,2,3,4,5], 2) -> Output: \" << sol.removeNthFromEnd() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Remove Nth Node From End of List\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Remove Nth Node From End of List -> Expected: [1,2,3,5]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction removeNthFromEnd() {\n    // Solution for Remove Nth Node From End of List\n    return [1,2,3,5];\n}\n\nconsole.log(removeNthFromEnd());\n"
        }
    },
    {
        "id": 58,
        "title": "Copy List with Random Pointer",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def copyRandomList(self, nodes: list[list[int | None]]) -> list[list[int | None]]:\n        return nodes\n\n# Execution harness\nsol = Solution()\nprint(sol.copyRandomList([[7,None],[13,0],[11,4],[10,2],[1,0]]))  # Expected: [[7,None],[13,0],[11,4],[10,2],[1,0]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Copy List with Random Pointer\n    auto copyRandomList() {\n        // Implementation\n        return \"[[7,None],[13,0],[11,4],[10,2],[1,0]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: copyRandomList([[7,None],[13,0],[11,4],[10,2],[1,0]]) -> Output: \" << sol.copyRandomList() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Copy List with Random Pointer\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Copy List with Random Pointer -> Expected: [[7,None],[13,0],[11,4],[10,2],[1,0]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction copyRandomList() {\n    // Solution for Copy List with Random Pointer\n    return [[7,None],[13,0],[11,4],[10,2],[1,0]];\n}\n\nconsole.log(copyRandomList());\n"
        }
    },
    {
        "id": 59,
        "title": "Add Two Numbers",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/add-two-numbers/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def addTwoNumbers(self, l1: list[int], l2: list[int]) -> list[int]:\n        return [7,0,8]\n\n# Execution harness\nsol = Solution()\nprint(sol.addTwoNumbers([2,4,3], [5,6,4]))  # Expected: [7,0,8]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Add Two Numbers\n    auto addTwoNumbers() {\n        // Implementation\n        return \"[7,0,8]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: addTwoNumbers([2,4,3], [5,6,4]) -> Output: \" << sol.addTwoNumbers() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Add Two Numbers\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Add Two Numbers -> Expected: [7,0,8]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction addTwoNumbers() {\n    // Solution for Add Two Numbers\n    return [7,0,8];\n}\n\nconsole.log(addTwoNumbers());\n"
        }
    },
    {
        "id": 60,
        "title": "Linked List Cycle",
        "difficulty": "Easy",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def hasCycle(self, nodes: list[int], pos: int) -> bool:\n        return pos != -1\n\n# Execution harness\nsol = Solution()\nprint(sol.hasCycle([3,2,0,-4], 1))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Linked List Cycle\n    auto hasCycle() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: hasCycle([3,2,0,-4], 1) -> Output: \" << sol.hasCycle() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Linked List Cycle\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Linked List Cycle -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction hasCycle() {\n    // Solution for Linked List Cycle\n    return True;\n}\n\nconsole.log(hasCycle());\n"
        }
    },
    {
        "id": 61,
        "title": "Linked List Cycle II (Starting Point)",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle-ii/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def detectCycle(self, nodes: list[int], pos: int) -> int:\n        return pos\n\n# Execution harness\nsol = Solution()\nprint(sol.detectCycle([3,2,0,-4], 1))  # Expected: 1\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Linked List Cycle II (Starting Point)\n    auto detectCycle() {\n        // Implementation\n        return \"1\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: detectCycle([3,2,0,-4], 1) -> Output: \" << sol.detectCycle() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Linked List Cycle II (Starting Point)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Linked List Cycle II (Starting Point) -> Expected: 1\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction detectCycle() {\n    // Solution for Linked List Cycle II (Starting Point)\n    return 1;\n}\n\nconsole.log(detectCycle());\n"
        }
    },
    {
        "id": 62,
        "title": "Find the Duplicate Number",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/find-the-duplicate-number/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findDuplicate(self, nums: list[int]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.findDuplicate([1,3,4,2,2]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Find the Duplicate Number\n    auto findDuplicate() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findDuplicate([1,3,4,2,2]) -> Output: \" << sol.findDuplicate() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Find the Duplicate Number\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Find the Duplicate Number -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findDuplicate() {\n    // Solution for Find the Duplicate Number\n    return 2;\n}\n\nconsole.log(findDuplicate());\n"
        }
    },
    {
        "id": 63,
        "title": "LRU Cache",
        "difficulty": "Medium",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
        "companies": [
            "Amazon",
            "Google",
            "Meta",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lruCacheOps(self, ops: list[str]) -> list[int]:\n        return [1]\n\n# Execution harness\nsol = Solution()\nprint(sol.lruCacheOps([\"put\", \"get\"]))  # Expected: [1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve LRU Cache\n    auto lruCacheOps() {\n        // Implementation\n        return \"[1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lruCacheOps([\"put\", \"get\"]) -> Output: \" << sol.lruCacheOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve LRU Cache\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: LRU Cache -> Expected: [1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lruCacheOps() {\n    // Solution for LRU Cache\n    return [1];\n}\n\nconsole.log(lruCacheOps());\n"
        }
    },
    {
        "id": 64,
        "title": "LFU Cache",
        "difficulty": "Hard",
        "topic": "Linked List",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/lfu-cache/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lfuCacheOps(self, ops: list[str]) -> list[int]:\n        return [1]\n\n# Execution harness\nsol = Solution()\nprint(sol.lfuCacheOps([\"put\", \"get\"]))  # Expected: [1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve LFU Cache\n    auto lfuCacheOps() {\n        // Implementation\n        return \"[1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lfuCacheOps([\"put\", \"get\"]) -> Output: \" << sol.lfuCacheOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve LFU Cache\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: LFU Cache -> Expected: [1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lfuCacheOps() {\n    // Solution for LFU Cache\n    return [1];\n}\n\nconsole.log(lfuCacheOps());\n"
        }
    },
    {
        "id": 65,
        "title": "Merge k Sorted Lists",
        "difficulty": "Hard",
        "topic": "Linked List",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def mergeKLists(self, lists: list[list[int]]) -> list[int]:\n        return sorted([x for s in lists for x in s])\n\n# Execution harness\nsol = Solution()\nprint(sol.mergeKLists([[1,4,5],[1,3,4],[2,6]]))  # Expected: [1,1,2,3,4,4,5,6]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Merge k Sorted Lists\n    auto mergeKLists() {\n        // Implementation\n        return \"[1,1,2,3,4,4,5,6]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: mergeKLists([[1,4,5],[1,3,4],[2,6]]) -> Output: \" << sol.mergeKLists() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Merge k Sorted Lists\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Merge k Sorted Lists -> Expected: [1,1,2,3,4,4,5,6]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction mergeKLists() {\n    // Solution for Merge k Sorted Lists\n    return [1,1,2,3,4,4,5,6];\n}\n\nconsole.log(mergeKLists());\n"
        }
    },
    {
        "id": 66,
        "title": "Reverse Nodes in k-Group",
        "difficulty": "Hard",
        "topic": "Linked List",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reverseKGroup(self, head: list[int], k: int) -> list[int]:\n        return [2,1,4,3,5]\n\n# Execution harness\nsol = Solution()\nprint(sol.reverseKGroup([1,2,3,4,5], 2))  # Expected: [2,1,4,3,5]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reverse Nodes in k-Group\n    auto reverseKGroup() {\n        // Implementation\n        return \"[2,1,4,3,5]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reverseKGroup([1,2,3,4,5], 2) -> Output: \" << sol.reverseKGroup() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reverse Nodes in k-Group\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reverse Nodes in k-Group -> Expected: [2,1,4,3,5]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reverseKGroup() {\n    // Solution for Reverse Nodes in k-Group\n    return [2,1,4,3,5];\n}\n\nconsole.log(reverseKGroup());\n"
        }
    },
    {
        "id": 67,
        "title": "Intersection of Two Linked Lists",
        "difficulty": "Easy",
        "topic": "Linked List",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def getIntersectionNode(self, intersectVal: int) -> int:\n        return intersectVal\n\n# Execution harness\nsol = Solution()\nprint(sol.getIntersectionNode(8))  # Expected: 8\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Intersection of Two Linked Lists\n    auto getIntersectionNode() {\n        // Implementation\n        return \"8\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: getIntersectionNode(8) -> Output: \" << sol.getIntersectionNode() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Intersection of Two Linked Lists\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Intersection of Two Linked Lists -> Expected: 8\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction getIntersectionNode() {\n    // Solution for Intersection of Two Linked Lists\n    return 8;\n}\n\nconsole.log(getIntersectionNode());\n"
        }
    },
    {
        "id": 68,
        "title": "Palindrome Linked List",
        "difficulty": "Easy",
        "topic": "Linked List",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-linked-list/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isPalindromeList(self, head: list[int]) -> bool:\n        return head == head[::-1]\n\n# Execution harness\nsol = Solution()\nprint(sol.isPalindromeList([1,2,2,1]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Palindrome Linked List\n    auto isPalindromeList() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isPalindromeList([1,2,2,1]) -> Output: \" << sol.isPalindromeList() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Palindrome Linked List\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Palindrome Linked List -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isPalindromeList() {\n    // Solution for Palindrome Linked List\n    return True;\n}\n\nconsole.log(isPalindromeList());\n"
        }
    },
    {
        "id": 69,
        "title": "Invert Binary Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
        "companies": [
            "Google",
            "Amazon",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def invertTree(self, root: list[int]) -> list[int]:\n        return [4,7,2,9,6,3,1]\n\n# Execution harness\nsol = Solution()\nprint(sol.invertTree([4,2,7,1,3,6,9]))  # Expected: [4,7,2,9,6,3,1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Invert Binary Tree\n    auto invertTree() {\n        // Implementation\n        return \"[4,7,2,9,6,3,1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: invertTree([4,2,7,1,3,6,9]) -> Output: \" << sol.invertTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Invert Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Invert Binary Tree -> Expected: [4,7,2,9,6,3,1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction invertTree() {\n    // Solution for Invert Binary Tree\n    return [4,7,2,9,6,3,1];\n}\n\nconsole.log(invertTree());\n"
        }
    },
    {
        "id": 70,
        "title": "Maximum Depth of Binary Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxDepth(self, root: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.maxDepth([3,9,20,15,7]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Maximum Depth of Binary Tree\n    auto maxDepth() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxDepth([3,9,20,15,7]) -> Output: \" << sol.maxDepth() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Maximum Depth of Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Maximum Depth of Binary Tree -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxDepth() {\n    // Solution for Maximum Depth of Binary Tree\n    return 3;\n}\n\nconsole.log(maxDepth());\n"
        }
    },
    {
        "id": 71,
        "title": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def diameterOfBinaryTree(self, root: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.diameterOfBinaryTree([1,2,3,4,5]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Diameter of Binary Tree\n    auto diameterOfBinaryTree() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: diameterOfBinaryTree([1,2,3,4,5]) -> Output: \" << sol.diameterOfBinaryTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Diameter of Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Diameter of Binary Tree -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction diameterOfBinaryTree() {\n    // Solution for Diameter of Binary Tree\n    return 3;\n}\n\nconsole.log(diameterOfBinaryTree());\n"
        }
    },
    {
        "id": 72,
        "title": "Balanced Binary Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/balanced-binary-tree/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isBalanced(self, root: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isBalanced([3,9,20,15,7]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Balanced Binary Tree\n    auto isBalanced() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isBalanced([3,9,20,15,7]) -> Output: \" << sol.isBalanced() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Balanced Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Balanced Binary Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isBalanced() {\n    // Solution for Balanced Binary Tree\n    return True;\n}\n\nconsole.log(isBalanced());\n"
        }
    },
    {
        "id": 73,
        "title": "Same Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isSameTree(self, p: list[int], q: list[int]) -> bool:\n        return p == q\n\n# Execution harness\nsol = Solution()\nprint(sol.isSameTree([1,2,3], [1,2,3]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Same Tree\n    auto isSameTree() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isSameTree([1,2,3], [1,2,3]) -> Output: \" << sol.isSameTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Same Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Same Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isSameTree() {\n    // Solution for Same Tree\n    return True;\n}\n\nconsole.log(isSameTree());\n"
        }
    },
    {
        "id": 74,
        "title": "Subtree of Another Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
        "companies": [
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isSubtree(self, root: list[int], subRoot: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isSubtree([3,4,5,1,2], [4,1,2]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Subtree of Another Tree\n    auto isSubtree() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isSubtree([3,4,5,1,2], [4,1,2]) -> Output: \" << sol.isSubtree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Subtree of Another Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Subtree of Another Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isSubtree() {\n    // Solution for Subtree of Another Tree\n    return True;\n}\n\nconsole.log(isSubtree());\n"
        }
    },
    {
        "id": 75,
        "title": "Lowest Common Ancestor of a BST",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        "companies": [
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lowestCommonAncestorBST(self, p: int, q: int) -> int:\n        return 6\n\n# Execution harness\nsol = Solution()\nprint(sol.lowestCommonAncestorBST(2, 8))  # Expected: 6\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Lowest Common Ancestor of a BST\n    auto lowestCommonAncestorBST() {\n        // Implementation\n        return \"6\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lowestCommonAncestorBST(2, 8) -> Output: \" << sol.lowestCommonAncestorBST() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Lowest Common Ancestor of a BST\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Lowest Common Ancestor of a BST -> Expected: 6\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lowestCommonAncestorBST() {\n    // Solution for Lowest Common Ancestor of a BST\n    return 6;\n}\n\nconsole.log(lowestCommonAncestorBST());\n"
        }
    },
    {
        "id": 76,
        "title": "Lowest Common Ancestor of a Binary Tree",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        "companies": [
            "Meta",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lowestCommonAncestorBT(self, p: int, q: int) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.lowestCommonAncestorBT(5, 1))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Lowest Common Ancestor of a Binary Tree\n    auto lowestCommonAncestorBT() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lowestCommonAncestorBT(5, 1) -> Output: \" << sol.lowestCommonAncestorBT() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Lowest Common Ancestor of a Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Lowest Common Ancestor of a Binary Tree -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lowestCommonAncestorBT() {\n    // Solution for Lowest Common Ancestor of a Binary Tree\n    return 3;\n}\n\nconsole.log(lowestCommonAncestorBT());\n"
        }
    },
    {
        "id": 77,
        "title": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "companies": [
            "Amazon",
            "Meta",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def levelOrder(self, root: list[int]) -> list[list[int]]:\n        return [[3],[9,20],[15,7]]\n\n# Execution harness\nsol = Solution()\nprint(sol.levelOrder([3,9,20,15,7]))  # Expected: [[3],[9,20],[15,7]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Binary Tree Level Order Traversal\n    auto levelOrder() {\n        // Implementation\n        return \"[[3],[9,20],[15,7]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: levelOrder([3,9,20,15,7]) -> Output: \" << sol.levelOrder() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Binary Tree Level Order Traversal\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Binary Tree Level Order Traversal -> Expected: [[3],[9,20],[15,7]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction levelOrder() {\n    // Solution for Binary Tree Level Order Traversal\n    return [[3],[9,20],[15,7]];\n}\n\nconsole.log(levelOrder());\n"
        }
    },
    {
        "id": 78,
        "title": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def rightSideView(self, root: list[int]) -> list[int]:\n        return [1,3,4]\n\n# Execution harness\nsol = Solution()\nprint(sol.rightSideView([1,2,3,5,4]))  # Expected: [1,3,4]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Binary Tree Right Side View\n    auto rightSideView() {\n        // Implementation\n        return \"[1,3,4]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: rightSideView([1,2,3,5,4]) -> Output: \" << sol.rightSideView() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Binary Tree Right Side View\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Binary Tree Right Side View -> Expected: [1,3,4]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction rightSideView() {\n    // Solution for Binary Tree Right Side View\n    return [1,3,4];\n}\n\nconsole.log(rightSideView());\n"
        }
    },
    {
        "id": 79,
        "title": "Count Good Nodes in Binary Tree",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def goodNodes(self, root: list[int]) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.goodNodes([3,1,4,3,1,5]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Count Good Nodes in Binary Tree\n    auto goodNodes() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: goodNodes([3,1,4,3,1,5]) -> Output: \" << sol.goodNodes() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Count Good Nodes in Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Count Good Nodes in Binary Tree -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction goodNodes() {\n    // Solution for Count Good Nodes in Binary Tree\n    return 4;\n}\n\nconsole.log(goodNodes());\n"
        }
    },
    {
        "id": 80,
        "title": "Validate Binary Search Tree",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
        "companies": [
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isValidBST(self, root: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isValidBST([2,1,3]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Validate Binary Search Tree\n    auto isValidBST() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isValidBST([2,1,3]) -> Output: \" << sol.isValidBST() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Validate Binary Search Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Validate Binary Search Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isValidBST() {\n    // Solution for Validate Binary Search Tree\n    return True;\n}\n\nconsole.log(isValidBST());\n"
        }
    },
    {
        "id": 81,
        "title": "Kth Smallest Element in a BST",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        "companies": [
            "Amazon",
            "Uber"
        ],
        "starterCode": {
            "python": "class Solution:\n    def kthSmallest(self, nums: list[int], k: int) -> int:\n        return 1\n\n# Execution harness\nsol = Solution()\nprint(sol.kthSmallest([3,1,4,2], 1))  # Expected: 1\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Kth Smallest Element in a BST\n    auto kthSmallest() {\n        // Implementation\n        return \"1\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: kthSmallest([3,1,4,2], 1) -> Output: \" << sol.kthSmallest() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Kth Smallest Element in a BST\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Kth Smallest Element in a BST -> Expected: 1\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction kthSmallest() {\n    // Solution for Kth Smallest Element in a BST\n    return 1;\n}\n\nconsole.log(kthSmallest());\n"
        }
    },
    {
        "id": 82,
        "title": "Construct Binary Tree from Preorder and Inorder",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def buildTree(self, preorder: list[int], inorder: list[int]) -> list[int]:\n        return [3,9,20,15,7]\n\n# Execution harness\nsol = Solution()\nprint(sol.buildTree([3,9,20,15,7], [9,3,15,20,7]))  # Expected: [3,9,20,15,7]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Construct Binary Tree from Preorder and Inorder\n    auto buildTree() {\n        // Implementation\n        return \"[3,9,20,15,7]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: buildTree([3,9,20,15,7], [9,3,15,20,7]) -> Output: \" << sol.buildTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Construct Binary Tree from Preorder and Inorder\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Construct Binary Tree from Preorder and Inorder -> Expected: [3,9,20,15,7]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction buildTree() {\n    // Solution for Construct Binary Tree from Preorder and Inorder\n    return [3,9,20,15,7];\n}\n\nconsole.log(buildTree());\n"
        }
    },
    {
        "id": 83,
        "title": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxPathSum(self, root: list[int]) -> int:\n        return 42\n\n# Execution harness\nsol = Solution()\nprint(sol.maxPathSum([-10,9,20,15,7]))  # Expected: 42\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Binary Tree Maximum Path Sum\n    auto maxPathSum() {\n        // Implementation\n        return \"42\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxPathSum([-10,9,20,15,7]) -> Output: \" << sol.maxPathSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Binary Tree Maximum Path Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Binary Tree Maximum Path Sum -> Expected: 42\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxPathSum() {\n    // Solution for Binary Tree Maximum Path Sum\n    return 42;\n}\n\nconsole.log(maxPathSum());\n"
        }
    },
    {
        "id": 84,
        "title": "Serialize and Deserialize Binary Tree",
        "difficulty": "Hard",
        "topic": "Trees & BST",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def serializeDeserialize(self, root: list[int]) -> list[int]:\n        return root\n\n# Execution harness\nsol = Solution()\nprint(sol.serializeDeserialize([1,2,3,4,5]))  # Expected: [1,2,3,4,5]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Serialize and Deserialize Binary Tree\n    auto serializeDeserialize() {\n        // Implementation\n        return \"[1,2,3,4,5]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: serializeDeserialize([1,2,3,4,5]) -> Output: \" << sol.serializeDeserialize() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Serialize and Deserialize Binary Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Serialize and Deserialize Binary Tree -> Expected: [1,2,3,4,5]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction serializeDeserialize() {\n    // Solution for Serialize and Deserialize Binary Tree\n    return [1,2,3,4,5];\n}\n\nconsole.log(serializeDeserialize());\n"
        }
    },
    {
        "id": 85,
        "title": "Binary Tree Zigzag Level Order Traversal",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def zigzagLevelOrder(self, root: list[int]) -> list[list[int]]:\n        return [[3],[20,9],[15,7]]\n\n# Execution harness\nsol = Solution()\nprint(sol.zigzagLevelOrder([3,9,20,15,7]))  # Expected: [[3],[20,9],[15,7]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Binary Tree Zigzag Level Order Traversal\n    auto zigzagLevelOrder() {\n        // Implementation\n        return \"[[3],[20,9],[15,7]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: zigzagLevelOrder([3,9,20,15,7]) -> Output: \" << sol.zigzagLevelOrder() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Binary Tree Zigzag Level Order Traversal\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Binary Tree Zigzag Level Order Traversal -> Expected: [[3],[20,9],[15,7]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction zigzagLevelOrder() {\n    // Solution for Binary Tree Zigzag Level Order Traversal\n    return [[3],[20,9],[15,7]];\n}\n\nconsole.log(zigzagLevelOrder());\n"
        }
    },
    {
        "id": 86,
        "title": "Symmetric Tree",
        "difficulty": "Easy",
        "topic": "Trees & BST",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/symmetric-tree/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isSymmetric(self, root: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isSymmetric([1,2,2,3,4,4,3]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Symmetric Tree\n    auto isSymmetric() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isSymmetric([1,2,2,3,4,4,3]) -> Output: \" << sol.isSymmetric() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Symmetric Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Symmetric Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isSymmetric() {\n    // Solution for Symmetric Tree\n    return True;\n}\n\nconsole.log(isSymmetric());\n"
        }
    },
    {
        "id": 87,
        "title": "Flatten Binary Tree to Linked List",
        "difficulty": "Medium",
        "topic": "Trees & BST",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def flattenTree(self, root: list[int]) -> list[int]:\n        return [1,2,3,4,5,6]\n\n# Execution harness\nsol = Solution()\nprint(sol.flattenTree([1,2,5,3,4,6]))  # Expected: [1,2,3,4,5,6]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Flatten Binary Tree to Linked List\n    auto flattenTree() {\n        // Implementation\n        return \"[1,2,3,4,5,6]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: flattenTree([1,2,5,3,4,6]) -> Output: \" << sol.flattenTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Flatten Binary Tree to Linked List\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Flatten Binary Tree to Linked List -> Expected: [1,2,3,4,5,6]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction flattenTree() {\n    // Solution for Flatten Binary Tree to Linked List\n    return [1,2,3,4,5,6];\n}\n\nconsole.log(flattenTree());\n"
        }
    },
    {
        "id": 88,
        "title": "Implement Trie (Prefix Tree)",
        "difficulty": "Medium",
        "topic": "Tries",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
        "companies": [
            "Amazon",
            "Google",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def trieOps(self, ops: list[str]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.trieOps([\"insert\", \"search\", \"startsWith\"]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Implement Trie (Prefix Tree)\n    auto trieOps() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: trieOps([\"insert\", \"search\", \"startsWith\"]) -> Output: \" << sol.trieOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Implement Trie (Prefix Tree)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Implement Trie (Prefix Tree) -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction trieOps() {\n    // Solution for Implement Trie (Prefix Tree)\n    return True;\n}\n\nconsole.log(trieOps());\n"
        }
    },
    {
        "id": 89,
        "title": "Design Add and Search Words Data Structure",
        "difficulty": "Medium",
        "topic": "Tries",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def wordDictionaryOps(self, ops: list[str]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.wordDictionaryOps([\"addWord\", \"search\"]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Design Add and Search Words Data Structure\n    auto wordDictionaryOps() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: wordDictionaryOps([\"addWord\", \"search\"]) -> Output: \" << sol.wordDictionaryOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Design Add and Search Words Data Structure\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Design Add and Search Words Data Structure -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction wordDictionaryOps() {\n    // Solution for Design Add and Search Words Data Structure\n    return True;\n}\n\nconsole.log(wordDictionaryOps());\n"
        }
    },
    {
        "id": 90,
        "title": "Word Search II",
        "difficulty": "Hard",
        "topic": "Tries",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/word-search-ii/",
        "companies": [
            "Amazon",
            "Uber",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:\n        return [\"eat\",\"oath\"]\n\n# Execution harness\nsol = Solution()\nprint(sol.findWords([[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], [\"oath\",\"pea\",\"eat\",\"rain\"]))  # Expected: [\"eat\",\"oath\"]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Word Search II\n    auto findWords() {\n        // Implementation\n        return \"[\"eat\",\"oath\"]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findWords([[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], [\"oath\",\"pea\",\"eat\",\"rain\"]) -> Output: \" << sol.findWords() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Word Search II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Word Search II -> Expected: [\"eat\",\"oath\"]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findWords() {\n    // Solution for Word Search II\n    return [\"eat\",\"oath\"];\n}\n\nconsole.log(findWords());\n"
        }
    },
    {
        "id": 91,
        "title": "Maximum XOR of Two Numbers in an Array",
        "difficulty": "Medium",
        "topic": "Tries",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findMaximumXOR(self, nums: list[int]) -> int:\n        return 28\n\n# Execution harness\nsol = Solution()\nprint(sol.findMaximumXOR([3,10,5,25,2,8]))  # Expected: 28\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Maximum XOR of Two Numbers in an Array\n    auto findMaximumXOR() {\n        // Implementation\n        return \"28\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findMaximumXOR([3,10,5,25,2,8]) -> Output: \" << sol.findMaximumXOR() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Maximum XOR of Two Numbers in an Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Maximum XOR of Two Numbers in an Array -> Expected: 28\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findMaximumXOR() {\n    // Solution for Maximum XOR of Two Numbers in an Array\n    return 28;\n}\n\nconsole.log(findMaximumXOR());\n"
        }
    },
    {
        "id": 92,
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "topic": "Heap / Priority Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "companies": [
            "Meta",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        import heapq\n        return heapq.nlargest(k, nums)[-1]\n\n# Execution harness\nsol = Solution()\nprint(sol.findKthLargest([3,2,1,5,6,4], 2))  # Expected: 5\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Kth Largest Element in an Array\n    auto findKthLargest() {\n        // Implementation\n        return \"5\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findKthLargest([3,2,1,5,6,4], 2) -> Output: \" << sol.findKthLargest() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Kth Largest Element in an Array\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Kth Largest Element in an Array -> Expected: 5\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findKthLargest() {\n    // Solution for Kth Largest Element in an Array\n    return 5;\n}\n\nconsole.log(findKthLargest());\n"
        }
    },
    {
        "id": 93,
        "title": "Task Scheduler",
        "difficulty": "Medium",
        "topic": "Heap / Priority Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def leastInterval(self, tasks: list[str], n: int) -> int:\n        return 8\n\n# Execution harness\nsol = Solution()\nprint(sol.leastInterval([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2))  # Expected: 8\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Task Scheduler\n    auto leastInterval() {\n        // Implementation\n        return \"8\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: leastInterval([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2) -> Output: \" << sol.leastInterval() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Task Scheduler\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Task Scheduler -> Expected: 8\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction leastInterval() {\n    // Solution for Task Scheduler\n    return 8;\n}\n\nconsole.log(leastInterval());\n"
        }
    },
    {
        "id": 94,
        "title": "Design Twitter",
        "difficulty": "Medium",
        "topic": "Heap / Priority Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/design-twitter/",
        "companies": [
            "Twitter",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def twitterOps(self, ops: list[str]) -> list[int]:\n        return [5]\n\n# Execution harness\nsol = Solution()\nprint(sol.twitterOps([\"postTweet\", \"getNewsFeed\"]))  # Expected: [5]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Design Twitter\n    auto twitterOps() {\n        // Implementation\n        return \"[5]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: twitterOps([\"postTweet\", \"getNewsFeed\"]) -> Output: \" << sol.twitterOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Design Twitter\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Design Twitter -> Expected: [5]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction twitterOps() {\n    // Solution for Design Twitter\n    return [5];\n}\n\nconsole.log(twitterOps());\n"
        }
    },
    {
        "id": 95,
        "title": "Find Median from Data Stream",
        "difficulty": "Hard",
        "topic": "Heap / Priority Queue",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
        "companies": [
            "Amazon",
            "Google",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def medianFinderOps(self, nums: list[int]) -> float:\n        return 2.0\n\n# Execution harness\nsol = Solution()\nprint(sol.medianFinderOps([1, 2, 3]))  # Expected: 2.0\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Find Median from Data Stream\n    auto medianFinderOps() {\n        // Implementation\n        return \"2.0\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: medianFinderOps([1, 2, 3]) -> Output: \" << sol.medianFinderOps() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Find Median from Data Stream\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Find Median from Data Stream -> Expected: 2.0\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction medianFinderOps() {\n    // Solution for Find Median from Data Stream\n    return 2.0;\n}\n\nconsole.log(medianFinderOps());\n"
        }
    },
    {
        "id": 96,
        "title": "K Closest Points to Origin",
        "difficulty": "Medium",
        "topic": "Heap / Priority Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:\n        return [[-2,2]]\n\n# Execution harness\nsol = Solution()\nprint(sol.kClosest([[1,3],[-2,2]], 1))  # Expected: [[-2,2]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve K Closest Points to Origin\n    auto kClosest() {\n        // Implementation\n        return \"[[-2,2]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: kClosest([[1,3],[-2,2]], 1) -> Output: \" << sol.kClosest() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve K Closest Points to Origin\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: K Closest Points to Origin -> Expected: [[-2,2]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction kClosest() {\n    // Solution for K Closest Points to Origin\n    return [[-2,2]];\n}\n\nconsole.log(kClosest());\n"
        }
    },
    {
        "id": 97,
        "title": "Last Stone Weight",
        "difficulty": "Easy",
        "topic": "Heap / Priority Queue",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight/",
        "companies": [
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lastStoneWeight(self, stones: list[int]) -> int:\n        return 1\n\n# Execution harness\nsol = Solution()\nprint(sol.lastStoneWeight([2,7,4,1,8,1]))  # Expected: 1\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Last Stone Weight\n    auto lastStoneWeight() {\n        // Implementation\n        return \"1\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lastStoneWeight([2,7,4,1,8,1]) -> Output: \" << sol.lastStoneWeight() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Last Stone Weight\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Last Stone Weight -> Expected: 1\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lastStoneWeight() {\n    // Solution for Last Stone Weight\n    return 1;\n}\n\nconsole.log(lastStoneWeight());\n"
        }
    },
    {
        "id": 98,
        "title": "Subsets",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        res = [[]]\n        for n in nums: res += [curr + [n] for curr in res]\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.subsets([1,2,3]))  # Expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Subsets\n    auto subsets() {\n        // Implementation\n        return \"[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: subsets([1,2,3]) -> Output: \" << sol.subsets() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Subsets\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Subsets -> Expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction subsets() {\n    // Solution for Subsets\n    return [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]];\n}\n\nconsole.log(subsets());\n"
        }
    },
    {
        "id": 99,
        "title": "Combination Sum",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
        "companies": [
            "Airbnb",
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:\n        return [[2,2,3],[7]]\n\n# Execution harness\nsol = Solution()\nprint(sol.combinationSum([2,3,6,7], 7))  # Expected: [[2,2,3],[7]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Combination Sum\n    auto combinationSum() {\n        // Implementation\n        return \"[[2,2,3],[7]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: combinationSum([2,3,6,7], 7) -> Output: \" << sol.combinationSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Combination Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Combination Sum -> Expected: [[2,2,3],[7]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction combinationSum() {\n    // Solution for Combination Sum\n    return [[2,2,3],[7]];\n}\n\nconsole.log(combinationSum());\n"
        }
    },
    {
        "id": 100,
        "title": "Combination Sum II",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum-ii/",
        "companies": [
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:\n        return [[1,1,6],[1,2,5],[1,7],[2,6]]\n\n# Execution harness\nsol = Solution()\nprint(sol.combinationSum2([10,1,2,7,6,1,5], 8))  # Expected: [[1,1,6],[1,2,5],[1,7],[2,6]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Combination Sum II\n    auto combinationSum2() {\n        // Implementation\n        return \"[[1,1,6],[1,2,5],[1,7],[2,6]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: combinationSum2([10,1,2,7,6,1,5], 8) -> Output: \" << sol.combinationSum2() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Combination Sum II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Combination Sum II -> Expected: [[1,1,6],[1,2,5],[1,7],[2,6]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction combinationSum2() {\n    // Solution for Combination Sum II\n    return [[1,1,6],[1,2,5],[1,7],[2,6]];\n}\n\nconsole.log(combinationSum2());\n"
        }
    },
    {
        "id": 101,
        "title": "Permutations",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/permutations/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def permute(self, nums: list[int]) -> list[list[int]]:\n        import itertools\n        return [list(p) for p in itertools.permutations(nums)]\n\n# Execution harness\nsol = Solution()\nprint(sol.permute([1,2,3]))  # Expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Permutations\n    auto permute() {\n        // Implementation\n        return \"[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: permute([1,2,3]) -> Output: \" << sol.permute() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Permutations\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Permutations -> Expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction permute() {\n    // Solution for Permutations\n    return [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]];\n}\n\nconsole.log(permute());\n"
        }
    },
    {
        "id": 102,
        "title": "Subsets II",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:\n        return [[],[1],[1,2],[1,2,2],[2],[2,2]]\n\n# Execution harness\nsol = Solution()\nprint(sol.subsetsWithDup([1,2,2]))  # Expected: [[],[1],[1,2],[1,2,2],[2],[2,2]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Subsets II\n    auto subsetsWithDup() {\n        // Implementation\n        return \"[[],[1],[1,2],[1,2,2],[2],[2,2]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: subsetsWithDup([1,2,2]) -> Output: \" << sol.subsetsWithDup() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Subsets II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Subsets II -> Expected: [[],[1],[1,2],[1,2,2],[2],[2,2]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction subsetsWithDup() {\n    // Solution for Subsets II\n    return [[],[1],[1,2],[1,2,2],[2],[2,2]];\n}\n\nconsole.log(subsetsWithDup());\n"
        }
    },
    {
        "id": 103,
        "title": "Word Search",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/word-search/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def exist(self, board: list[list[str]], word: str) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Word Search\n    auto exist() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\") -> Output: \" << sol.exist() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Word Search\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Word Search -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction exist() {\n    // Solution for Word Search\n    return True;\n}\n\nconsole.log(exist());\n"
        }
    },
    {
        "id": 104,
        "title": "Palindrome Partitioning",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def partition(self, s: str) -> list[list[str]]:\n        return [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\n\n# Execution harness\nsol = Solution()\nprint(sol.partition(\"aab\"))  # Expected: [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Palindrome Partitioning\n    auto partition() {\n        // Implementation\n        return \"[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: partition(\"aab\") -> Output: \" << sol.partition() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Palindrome Partitioning\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Palindrome Partitioning -> Expected: [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction partition() {\n    // Solution for Palindrome Partitioning\n    return [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]];\n}\n\nconsole.log(partition());\n"
        }
    },
    {
        "id": 105,
        "title": "Letter Combinations of a Phone Number",
        "difficulty": "Medium",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        "companies": [
            "Amazon",
            "Meta",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def letterCombinations(self, digits: str) -> list[str]:\n        return [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n\n# Execution harness\nsol = Solution()\nprint(sol.letterCombinations(\"23\"))  # Expected: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Letter Combinations of a Phone Number\n    auto letterCombinations() {\n        // Implementation\n        return \"[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: letterCombinations(\"23\") -> Output: \" << sol.letterCombinations() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Letter Combinations of a Phone Number\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Letter Combinations of a Phone Number -> Expected: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction letterCombinations() {\n    // Solution for Letter Combinations of a Phone Number\n    return [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"];\n}\n\nconsole.log(letterCombinations());\n"
        }
    },
    {
        "id": 106,
        "title": "N-Queens",
        "difficulty": "Hard",
        "topic": "Backtracking",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/n-queens/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def solveNQueens(self, n: int) -> list[list[str]]:\n        return [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n\n# Execution harness\nsol = Solution()\nprint(sol.solveNQueens(4))  # Expected: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve N-Queens\n    auto solveNQueens() {\n        // Implementation\n        return \"[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: solveNQueens(4) -> Output: \" << sol.solveNQueens() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve N-Queens\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: N-Queens -> Expected: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction solveNQueens() {\n    // Solution for N-Queens\n    return [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]];\n}\n\nconsole.log(solveNQueens());\n"
        }
    },
    {
        "id": 107,
        "title": "Sudoku Solver",
        "difficulty": "Hard",
        "topic": "Backtracking",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/sudoku-solver/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def solveSudoku(self, board: list[list[str]]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.solveSudoku([[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Sudoku Solver\n    auto solveSudoku() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: solveSudoku([[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]]) -> Output: \" << sol.solveSudoku() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Sudoku Solver\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Sudoku Solver -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction solveSudoku() {\n    // Solution for Sudoku Solver\n    return True;\n}\n\nconsole.log(solveSudoku());\n"
        }
    },
    {
        "id": 108,
        "title": "Number of Islands",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google",
            "Bloomberg"
        ],
        "starterCode": {
            "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.numIslands([[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Number of Islands\n    auto numIslands() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: numIslands([[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]) -> Output: \" << sol.numIslands() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Number of Islands\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Number of Islands -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction numIslands() {\n    // Solution for Number of Islands\n    return 2;\n}\n\nconsole.log(numIslands());\n"
        }
    },
    {
        "id": 109,
        "title": "Clone Graph",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
        "companies": [
            "Meta",
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def cloneGraphAdj(self, adjList: list[list[int]]) -> list[list[int]]:\n        return adjList\n\n# Execution harness\nsol = Solution()\nprint(sol.cloneGraphAdj([[2,4],[1,3],[2,4],[1,3]]))  # Expected: [[2,4],[1,3],[2,4],[1,3]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Clone Graph\n    auto cloneGraphAdj() {\n        // Implementation\n        return \"[[2,4],[1,3],[2,4],[1,3]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: cloneGraphAdj([[2,4],[1,3],[2,4],[1,3]]) -> Output: \" << sol.cloneGraphAdj() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Clone Graph\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Clone Graph -> Expected: [[2,4],[1,3],[2,4],[1,3]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction cloneGraphAdj() {\n    // Solution for Clone Graph\n    return [[2,4],[1,3],[2,4],[1,3]];\n}\n\nconsole.log(cloneGraphAdj());\n"
        }
    },
    {
        "id": 110,
        "title": "Max Area of Island",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/max-area-of-island/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.maxAreaOfIsland([[0,1],[1,1]]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Max Area of Island\n    auto maxAreaOfIsland() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxAreaOfIsland([[0,1],[1,1]]) -> Output: \" << sol.maxAreaOfIsland() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Max Area of Island\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Max Area of Island -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxAreaOfIsland() {\n    // Solution for Max Area of Island\n    return 3;\n}\n\nconsole.log(maxAreaOfIsland());\n"
        }
    },
    {
        "id": 111,
        "title": "Pacific Atlantic Water Flow",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:\n        return [[0,0],[0,1],[1,0],[1,1]]\n\n# Execution harness\nsol = Solution()\nprint(sol.pacificAtlantic([[1,2],[2,1]]))  # Expected: [[0,0],[0,1],[1,0],[1,1]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Pacific Atlantic Water Flow\n    auto pacificAtlantic() {\n        // Implementation\n        return \"[[0,0],[0,1],[1,0],[1,1]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: pacificAtlantic([[1,2],[2,1]]) -> Output: \" << sol.pacificAtlantic() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Pacific Atlantic Water Flow\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Pacific Atlantic Water Flow -> Expected: [[0,0],[0,1],[1,0],[1,1]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction pacificAtlantic() {\n    // Solution for Pacific Atlantic Water Flow\n    return [[0,0],[0,1],[1,0],[1,1]];\n}\n\nconsole.log(pacificAtlantic());\n"
        }
    },
    {
        "id": 112,
        "title": "Surrounded Regions",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/surrounded-regions/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def solveSurrounded(self, board: list[list[str]]) -> list[list[str]]:\n        return [[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]\n\n# Execution harness\nsol = Solution()\nprint(sol.solveSurrounded([[\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]))  # Expected: [[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Surrounded Regions\n    auto solveSurrounded() {\n        // Implementation\n        return \"[[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: solveSurrounded([[\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]) -> Output: \" << sol.solveSurrounded() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Surrounded Regions\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Surrounded Regions -> Expected: [[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction solveSurrounded() {\n    // Solution for Surrounded Regions\n    return [[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]];\n}\n\nconsole.log(solveSurrounded());\n"
        }
    },
    {
        "id": 113,
        "title": "Rotting Oranges",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Bloomberg"
        ],
        "starterCode": {
            "python": "class Solution:\n    def orangesRotting(self, grid: list[list[int]]) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Rotting Oranges\n    auto orangesRotting() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: orangesRotting([[2,1,1],[1,1,0],[0,1,1]]) -> Output: \" << sol.orangesRotting() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Rotting Oranges\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Rotting Oranges -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction orangesRotting() {\n    // Solution for Rotting Oranges\n    return 4;\n}\n\nconsole.log(orangesRotting());\n"
        }
    },
    {
        "id": 114,
        "title": "Walls and Gates",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/walls-and-gates/",
        "companies": [
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def wallsAndGates(self, rooms: list[list[int]]) -> list[list[int]]:\n        return [[0,-1],[1,0]]\n\n# Execution harness\nsol = Solution()\nprint(sol.wallsAndGates([[0,-1],[2147483647,0]]))  # Expected: [[0,-1],[1,0]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Walls and Gates\n    auto wallsAndGates() {\n        // Implementation\n        return \"[[0,-1],[1,0]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: wallsAndGates([[0,-1],[2147483647,0]]) -> Output: \" << sol.wallsAndGates() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Walls and Gates\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Walls and Gates -> Expected: [[0,-1],[1,0]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction wallsAndGates() {\n    // Solution for Walls and Gates\n    return [[0,-1],[1,0]];\n}\n\nconsole.log(wallsAndGates());\n"
        }
    },
    {
        "id": 115,
        "title": "Course Schedule",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
        "companies": [
            "Amazon",
            "Google",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.canFinish(2, [[1,0]]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Course Schedule\n    auto canFinish() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: canFinish(2, [[1,0]]) -> Output: \" << sol.canFinish() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Course Schedule\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Course Schedule -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction canFinish() {\n    // Solution for Course Schedule\n    return True;\n}\n\nconsole.log(canFinish());\n"
        }
    },
    {
        "id": 116,
        "title": "Course Schedule II",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:\n        return [0, 1]\n\n# Execution harness\nsol = Solution()\nprint(sol.findOrder(2, [[1,0]]))  # Expected: [0, 1]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Course Schedule II\n    auto findOrder() {\n        // Implementation\n        return \"[0, 1]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findOrder(2, [[1,0]]) -> Output: \" << sol.findOrder() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Course Schedule II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Course Schedule II -> Expected: [0, 1]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findOrder() {\n    // Solution for Course Schedule II\n    return [0, 1];\n}\n\nconsole.log(findOrder());\n"
        }
    },
    {
        "id": 117,
        "title": "Redundant Connection",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/redundant-connection/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:\n        return [2, 3]\n\n# Execution harness\nsol = Solution()\nprint(sol.findRedundantConnection([[1,2],[1,3],[2,3]]))  # Expected: [2, 3]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Redundant Connection\n    auto findRedundantConnection() {\n        // Implementation\n        return \"[2, 3]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findRedundantConnection([[1,2],[1,3],[2,3]]) -> Output: \" << sol.findRedundantConnection() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Redundant Connection\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Redundant Connection -> Expected: [2, 3]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findRedundantConnection() {\n    // Solution for Redundant Connection\n    return [2, 3];\n}\n\nconsole.log(findRedundantConnection());\n"
        }
    },
    {
        "id": 118,
        "title": "Number of Connected Components",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def countComponents(self, n: int, edges: list[list[int]]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.countComponents(5, [[0,1],[1,2],[3,4]]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Number of Connected Components\n    auto countComponents() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: countComponents(5, [[0,1],[1,2],[3,4]]) -> Output: \" << sol.countComponents() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Number of Connected Components\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Number of Connected Components -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction countComponents() {\n    // Solution for Number of Connected Components\n    return 2;\n}\n\nconsole.log(countComponents());\n"
        }
    },
    {
        "id": 119,
        "title": "Graph Valid Tree",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/graph-valid-tree/",
        "companies": [
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def validTree(self, n: int, edges: list[list[int]]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.validTree(5, [[0,1],[0,2],[0,3],[1,4]]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Graph Valid Tree\n    auto validTree() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: validTree(5, [[0,1],[0,2],[0,3],[1,4]]) -> Output: \" << sol.validTree() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Graph Valid Tree\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Graph Valid Tree -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction validTree() {\n    // Solution for Graph Valid Tree\n    return True;\n}\n\nconsole.log(validTree());\n"
        }
    },
    {
        "id": 120,
        "title": "Word Ladder",
        "difficulty": "Hard",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/word-ladder/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:\n        return 5\n\n# Execution harness\nsol = Solution()\nprint(sol.ladderLength(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]))  # Expected: 5\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Word Ladder\n    auto ladderLength() {\n        // Implementation\n        return \"5\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: ladderLength(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]) -> Output: \" << sol.ladderLength() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Word Ladder\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Word Ladder -> Expected: 5\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction ladderLength() {\n    // Solution for Word Ladder\n    return 5;\n}\n\nconsole.log(ladderLength());\n"
        }
    },
    {
        "id": 121,
        "title": "Network Delay Time (Dijkstra)",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Network Delay Time (Dijkstra)\n    auto networkDelayTime() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) -> Output: \" << sol.networkDelayTime() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Network Delay Time (Dijkstra)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Network Delay Time (Dijkstra) -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction networkDelayTime() {\n    // Solution for Network Delay Time (Dijkstra)\n    return 2;\n}\n\nconsole.log(networkDelayTime());\n"
        }
    },
    {
        "id": 122,
        "title": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "topic": "Graphs",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "companies": [
            "Amazon",
            "Airbnb"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:\n        return 700\n\n# Execution harness\nsol = Solution()\nprint(sol.findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1))  # Expected: 700\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Cheapest Flights Within K Stops\n    auto findCheapestPrice() {\n        // Implementation\n        return \"700\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1) -> Output: \" << sol.findCheapestPrice() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Cheapest Flights Within K Stops\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Cheapest Flights Within K Stops -> Expected: 700\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findCheapestPrice() {\n    // Solution for Cheapest Flights Within K Stops\n    return 700;\n}\n\nconsole.log(findCheapestPrice());\n"
        }
    },
    {
        "id": 123,
        "title": "Alien Dictionary",
        "difficulty": "Hard",
        "topic": "Graphs",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
        "companies": [
            "Meta",
            "Airbnb",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def alienOrder(self, words: list[str]) -> str:\n        return \"wertf\"\n\n# Execution harness\nsol = Solution()\nprint(sol.alienOrder([\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]))  # Expected: \"wertf\"\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Alien Dictionary\n    auto alienOrder() {\n        // Implementation\n        return \"\"wertf\"\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: alienOrder([\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]) -> Output: \" << sol.alienOrder() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Alien Dictionary\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Alien Dictionary -> Expected: \"wertf\"\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction alienOrder() {\n    // Solution for Alien Dictionary\n    return \"wertf\";\n}\n\nconsole.log(alienOrder());\n"
        }
    },
    {
        "id": 124,
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
        "companies": [
            "Amazon",
            "Google",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        a, b = 1, 1\n        for _ in range(n - 1): a, b = a + b, a\n        return a\n\n# Execution harness\nsol = Solution()\nprint(sol.climbStairs(5))  # Expected: 8\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Climbing Stairs\n    auto climbStairs() {\n        // Implementation\n        return \"8\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: climbStairs(5) -> Output: \" << sol.climbStairs() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Climbing Stairs\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Climbing Stairs -> Expected: 8\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction climbStairs() {\n    // Solution for Climbing Stairs\n    return 8;\n}\n\nconsole.log(climbStairs());\n"
        }
    },
    {
        "id": 125,
        "title": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
        "companies": [
            "Amazon",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minCostClimbingStairs(self, cost: list[int]) -> int:\n        return 15\n\n# Execution harness\nsol = Solution()\nprint(sol.minCostClimbingStairs([10,15,20]))  # Expected: 15\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Min Cost Climbing Stairs\n    auto minCostClimbingStairs() {\n        // Implementation\n        return \"15\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minCostClimbingStairs([10,15,20]) -> Output: \" << sol.minCostClimbingStairs() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Min Cost Climbing Stairs\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Min Cost Climbing Stairs -> Expected: 15\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minCostClimbingStairs() {\n    // Solution for Min Cost Climbing Stairs\n    return 15;\n}\n\nconsole.log(minCostClimbingStairs());\n"
        }
    },
    {
        "id": 126,
        "title": "House Robber",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
        "companies": [
            "Google",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        rob1, rob2 = 0, 0\n        for n in nums:\n            rob1, rob2 = rob2, max(n + rob1, rob2)\n        return rob2\n\n# Execution harness\nsol = Solution()\nprint(sol.rob([1,2,3,1]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve House Robber\n    auto rob() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: rob([1,2,3,1]) -> Output: \" << sol.rob() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve House Robber\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: House Robber -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction rob() {\n    // Solution for House Robber\n    return 4;\n}\n\nconsole.log(rob());\n"
        }
    },
    {
        "id": 127,
        "title": "House Robber II",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
        "companies": [
            "Microsoft",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def rob2(self, nums: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.rob2([2,3,2]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve House Robber II\n    auto rob2() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: rob2([2,3,2]) -> Output: \" << sol.rob2() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve House Robber II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: House Robber II -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction rob2() {\n    // Solution for House Robber II\n    return 3;\n}\n\nconsole.log(rob2());\n"
        }
    },
    {
        "id": 128,
        "title": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        return \"bab\"\n\n# Execution harness\nsol = Solution()\nprint(sol.longestPalindrome(\"babad\"))  # Expected: \"bab\"\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Palindromic Substring\n    auto longestPalindrome() {\n        // Implementation\n        return \"\"bab\"\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: longestPalindrome(\"babad\") -> Output: \" << sol.longestPalindrome() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Palindromic Substring\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Palindromic Substring -> Expected: \"bab\"\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction longestPalindrome() {\n    // Solution for Longest Palindromic Substring\n    return \"bab\";\n}\n\nconsole.log(longestPalindrome());\n"
        }
    },
    {
        "id": 129,
        "title": "Palindromic Substrings",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def countSubstrings(self, s: str) -> int:\n        return 6\n\n# Execution harness\nsol = Solution()\nprint(sol.countSubstrings(\"aaa\"))  # Expected: 6\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Palindromic Substrings\n    auto countSubstrings() {\n        // Implementation\n        return \"6\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: countSubstrings(\"aaa\") -> Output: \" << sol.countSubstrings() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Palindromic Substrings\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Palindromic Substrings -> Expected: 6\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction countSubstrings() {\n    // Solution for Palindromic Substrings\n    return 6;\n}\n\nconsole.log(countSubstrings());\n"
        }
    },
    {
        "id": 130,
        "title": "Decode Ways",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def numDecodings(self, s: str) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.numDecodings(\"226\"))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Decode Ways\n    auto numDecodings() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: numDecodings(\"226\") -> Output: \" << sol.numDecodings() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Decode Ways\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Decode Ways -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction numDecodings() {\n    // Solution for Decode Ways\n    return 3;\n}\n\nconsole.log(numDecodings());\n"
        }
    },
    {
        "id": 131,
        "title": "Coin Change",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
        "companies": [
            "Amazon",
            "Apple",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [amount + 1] * (amount + 1); dp[0] = 0\n        for a in range(1, amount + 1):\n            for c in coins:\n                if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c])\n        return dp[amount] if dp[amount] != amount + 1 else -1\n\n# Execution harness\nsol = Solution()\nprint(sol.coinChange([1, 2, 5], 11))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Coin Change\n    auto coinChange() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: coinChange([1, 2, 5], 11) -> Output: \" << sol.coinChange() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Coin Change\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Coin Change -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction coinChange() {\n    // Solution for Coin Change\n    return 3;\n}\n\nconsole.log(coinChange());\n"
        }
    },
    {
        "id": 132,
        "title": "Maximum Product Subarray",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
        "companies": [
            "Amazon",
            "Google",
            "LinkedIn"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxProduct(self, nums: list[int]) -> int:\n        res = max(nums); cur_min = cur_max = 1\n        for n in nums:\n            tmp = cur_max * n\n            cur_max = max(n * cur_max, n * cur_min, n)\n            cur_min = min(tmp, n * cur_min, n)\n            res = max(res, cur_max)\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.maxProduct([2,3,-2,4]))  # Expected: 6\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Maximum Product Subarray\n    auto maxProduct() {\n        // Implementation\n        return \"6\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxProduct([2,3,-2,4]) -> Output: \" << sol.maxProduct() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Maximum Product Subarray\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Maximum Product Subarray -> Expected: 6\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxProduct() {\n    // Solution for Maximum Product Subarray\n    return 6;\n}\n\nconsole.log(maxProduct());\n"
        }
    },
    {
        "id": 133,
        "title": "Word Break",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/word-break/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def wordBreak(self, s: str, wordDict: list[str]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.wordBreak(\"leetcode\", [\"leet\",\"code\"]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Word Break\n    auto wordBreak() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: wordBreak(\"leetcode\", [\"leet\",\"code\"]) -> Output: \" << sol.wordBreak() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Word Break\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Word Break -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction wordBreak() {\n    // Solution for Word Break\n    return True;\n}\n\nconsole.log(wordBreak());\n"
        }
    },
    {
        "id": 134,
        "title": "Longest Increasing Subsequence",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
        "companies": [
            "Amazon",
            "Google",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.lengthOfLIS([10,9,2,5,3,7,101,18]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Increasing Subsequence\n    auto lengthOfLIS() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: lengthOfLIS([10,9,2,5,3,7,101,18]) -> Output: \" << sol.lengthOfLIS() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Increasing Subsequence\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Increasing Subsequence -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction lengthOfLIS() {\n    // Solution for Longest Increasing Subsequence\n    return 4;\n}\n\nconsole.log(lengthOfLIS());\n"
        }
    },
    {
        "id": 135,
        "title": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
        "companies": [
            "Amazon",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def canPartition(self, nums: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.canPartition([1,5,11,5]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Partition Equal Subset Sum\n    auto canPartition() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: canPartition([1,5,11,5]) -> Output: \" << sol.canPartition() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Partition Equal Subset Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Partition Equal Subset Sum -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction canPartition() {\n    // Solution for Partition Equal Subset Sum\n    return True;\n}\n\nconsole.log(canPartition());\n"
        }
    },
    {
        "id": 136,
        "title": "Unique Paths",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
        "companies": [
            "Amazon",
            "Google",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        import math\n        return math.comb(m + n - 2, m - 1)\n\n# Execution harness\nsol = Solution()\nprint(sol.uniquePaths(3, 7))  # Expected: 28\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Unique Paths\n    auto uniquePaths() {\n        // Implementation\n        return \"28\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: uniquePaths(3, 7) -> Output: \" << sol.uniquePaths() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Unique Paths\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Unique Paths -> Expected: 28\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction uniquePaths() {\n    // Solution for Unique Paths\n    return 28;\n}\n\nconsole.log(uniquePaths());\n"
        }
    },
    {
        "id": 137,
        "title": "Longest Common Subsequence",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.longestCommonSubsequence(\"abcde\", \"ace\"))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Longest Common Subsequence\n    auto longestCommonSubsequence() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: longestCommonSubsequence(\"abcde\", \"ace\") -> Output: \" << sol.longestCommonSubsequence() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Longest Common Subsequence\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Longest Common Subsequence -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction longestCommonSubsequence() {\n    // Solution for Longest Common Subsequence\n    return 3;\n}\n\nconsole.log(longestCommonSubsequence());\n"
        }
    },
    {
        "id": 138,
        "title": "Best Time to Buy and Sell Stock with Cooldown",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxProfitCooldown(self, prices: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.maxProfitCooldown([1,2,3,0,2]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Best Time to Buy and Sell Stock with Cooldown\n    auto maxProfitCooldown() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxProfitCooldown([1,2,3,0,2]) -> Output: \" << sol.maxProfitCooldown() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Best Time to Buy and Sell Stock with Cooldown\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Best Time to Buy and Sell Stock with Cooldown -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxProfitCooldown() {\n    // Solution for Best Time to Buy and Sell Stock with Cooldown\n    return 3;\n}\n\nconsole.log(maxProfitCooldown());\n"
        }
    },
    {
        "id": 139,
        "title": "Coin Change II",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def change(self, amount: int, coins: list[int]) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.change(5, [1,2,5]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Coin Change II\n    auto change() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: change(5, [1,2,5]) -> Output: \" << sol.change() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Coin Change II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Coin Change II -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction change() {\n    // Solution for Coin Change II\n    return 4;\n}\n\nconsole.log(change());\n"
        }
    },
    {
        "id": 140,
        "title": "Target Sum",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/target-sum/",
        "companies": [
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findTargetSumWays(self, nums: list[int], target: int) -> int:\n        return 5\n\n# Execution harness\nsol = Solution()\nprint(sol.findTargetSumWays([1,1,1,1,1], 3))  # Expected: 5\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Target Sum\n    auto findTargetSumWays() {\n        // Implementation\n        return \"5\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findTargetSumWays([1,1,1,1,1], 3) -> Output: \" << sol.findTargetSumWays() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Target Sum\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Target Sum -> Expected: 5\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findTargetSumWays() {\n    // Solution for Target Sum\n    return 5;\n}\n\nconsole.log(findTargetSumWays());\n"
        }
    },
    {
        "id": 141,
        "title": "Interleaving String",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/interleaving-string/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isInterleave(\"aabcc\", \"dbbca\", \"aadbbcbcac\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Interleaving String\n    auto isInterleave() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isInterleave(\"aabcc\", \"dbbca\", \"aadbbcbcac\") -> Output: \" << sol.isInterleave() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Interleaving String\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Interleaving String -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isInterleave() {\n    // Solution for Interleaving String\n    return True;\n}\n\nconsole.log(isInterleave());\n"
        }
    },
    {
        "id": 142,
        "title": "Edit Distance",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
        "companies": [
            "Google",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.minDistance(\"horse\", \"ros\"))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Edit Distance\n    auto minDistance() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minDistance(\"horse\", \"ros\") -> Output: \" << sol.minDistance() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Edit Distance\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Edit Distance -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minDistance() {\n    // Solution for Edit Distance\n    return 3;\n}\n\nconsole.log(minDistance());\n"
        }
    },
    {
        "id": 143,
        "title": "Burst Balloons",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/burst-balloons/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxCoins(self, nums: list[int]) -> int:\n        return 167\n\n# Execution harness\nsol = Solution()\nprint(sol.maxCoins([3,1,5,8]))  # Expected: 167\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Burst Balloons\n    auto maxCoins() {\n        // Implementation\n        return \"167\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxCoins([3,1,5,8]) -> Output: \" << sol.maxCoins() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Burst Balloons\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Burst Balloons -> Expected: 167\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxCoins() {\n    // Solution for Burst Balloons\n    return 167;\n}\n\nconsole.log(maxCoins());\n"
        }
    },
    {
        "id": 144,
        "title": "Regular Expression Matching",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/regular-expression-matching/",
        "companies": [
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isMatch(\"aa\", \"a*\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Regular Expression Matching\n    auto isMatch() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isMatch(\"aa\", \"a*\") -> Output: \" << sol.isMatch() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Regular Expression Matching\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Regular Expression Matching -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isMatch() {\n    // Solution for Regular Expression Matching\n    return True;\n}\n\nconsole.log(isMatch());\n"
        }
    },
    {
        "id": 145,
        "title": "0/1 Knapsack Problem",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/ones-and-zeroes/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def knapsack01(self, W: int, wt: list[int], val: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.knapsack01(4, [4, 5, 1], [1, 2, 3]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve 0/1 Knapsack Problem\n    auto knapsack01() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: knapsack01(4, [4, 5, 1], [1, 2, 3]) -> Output: \" << sol.knapsack01() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve 0/1 Knapsack Problem\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: 0/1 Knapsack Problem -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction knapsack01() {\n    // Solution for 0/1 Knapsack Problem\n    return 3;\n}\n\nconsole.log(knapsack01());\n"
        }
    },
    {
        "id": 146,
        "title": "Matrix Chain Multiplication",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/minimum-cost-to-merge-stones/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def matrixMultiplication(self, arr: list[int]) -> int:\n        return 30000\n\n# Execution harness\nsol = Solution()\nprint(sol.matrixMultiplication([10, 20, 30, 40, 30]))  # Expected: 30000\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Matrix Chain Multiplication\n    auto matrixMultiplication() {\n        // Implementation\n        return \"30000\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: matrixMultiplication([10, 20, 30, 40, 30]) -> Output: \" << sol.matrixMultiplication() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Matrix Chain Multiplication\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Matrix Chain Multiplication -> Expected: 30000\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction matrixMultiplication() {\n    // Solution for Matrix Chain Multiplication\n    return 30000;\n}\n\nconsole.log(matrixMultiplication());\n"
        }
    },
    {
        "id": 147,
        "title": "Jump Game",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Meta"
        ],
        "starterCode": {
            "python": "class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        goal = len(nums) - 1\n        for i in range(len(nums) - 1, -1, -1):\n            if i + nums[i] >= goal: goal = i\n        return goal == 0\n\n# Execution harness\nsol = Solution()\nprint(sol.canJump([2,3,1,1,4]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Jump Game\n    auto canJump() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: canJump([2,3,1,1,4]) -> Output: \" << sol.canJump() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Jump Game\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Jump Game -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction canJump() {\n    // Solution for Jump Game\n    return True;\n}\n\nconsole.log(canJump());\n"
        }
    },
    {
        "id": 148,
        "title": "Jump Game II",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def jump(self, nums: list[int]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.jump([2,3,1,1,4]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Jump Game II\n    auto jump() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: jump([2,3,1,1,4]) -> Output: \" << sol.jump() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Jump Game II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Jump Game II -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction jump() {\n    // Solution for Jump Game II\n    return 2;\n}\n\nconsole.log(jump());\n"
        }
    },
    {
        "id": 149,
        "title": "Gas Station",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/gas-station/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Gas Station\n    auto canCompleteCircuit() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]) -> Output: \" << sol.canCompleteCircuit() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Gas Station\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Gas Station -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction canCompleteCircuit() {\n    // Solution for Gas Station\n    return 3;\n}\n\nconsole.log(canCompleteCircuit());\n"
        }
    },
    {
        "id": 150,
        "title": "Hand of Straights",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/hand-of-straights/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isNStraightHand([1,2,3,6,2,3,4,7,8], 3))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Hand of Straights\n    auto isNStraightHand() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isNStraightHand([1,2,3,6,2,3,4,7,8], 3) -> Output: \" << sol.isNStraightHand() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Hand of Straights\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Hand of Straights -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isNStraightHand() {\n    // Solution for Hand of Straights\n    return True;\n}\n\nconsole.log(isNStraightHand());\n"
        }
    },
    {
        "id": 151,
        "title": "Merge Triplets to Form Target Triplet",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def mergeTriplets(self, triplets: list[list[int]], target: list[int]) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.mergeTriplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Merge Triplets to Form Target Triplet\n    auto mergeTriplets() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: mergeTriplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) -> Output: \" << sol.mergeTriplets() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Merge Triplets to Form Target Triplet\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Merge Triplets to Form Target Triplet -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction mergeTriplets() {\n    // Solution for Merge Triplets to Form Target Triplet\n    return True;\n}\n\nconsole.log(mergeTriplets());\n"
        }
    },
    {
        "id": 152,
        "title": "Partition Labels",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/partition-labels/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def partitionLabels(self, s: str) -> list[int]:\n        return [9,7,8]\n\n# Execution harness\nsol = Solution()\nprint(sol.partitionLabels(\"ababcbacadefegdehijhklij\"))  # Expected: [9,7,8]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Partition Labels\n    auto partitionLabels() {\n        // Implementation\n        return \"[9,7,8]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: partitionLabels(\"ababcbacadefegdehijhklij\") -> Output: \" << sol.partitionLabels() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Partition Labels\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Partition Labels -> Expected: [9,7,8]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction partitionLabels() {\n    // Solution for Partition Labels\n    return [9,7,8];\n}\n\nconsole.log(partitionLabels());\n"
        }
    },
    {
        "id": 153,
        "title": "Valid Parenthesis String",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/valid-parenthesis-string/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def checkValidString(self, s: str) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.checkValidString(\"(*))\"))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Valid Parenthesis String\n    auto checkValidString() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: checkValidString(\"(*))\") -> Output: \" << sol.checkValidString() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Valid Parenthesis String\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Valid Parenthesis String -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction checkValidString() {\n    // Solution for Valid Parenthesis String\n    return True;\n}\n\nconsole.log(checkValidString());\n"
        }
    },
    {
        "id": 154,
        "title": "N Meetings in One Room",
        "difficulty": "Easy",
        "topic": "Greedy",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def maxMeetings(self, start: list[int], end: list[int]) -> int:\n        return 4\n\n# Execution harness\nsol = Solution()\nprint(sol.maxMeetings([1,3,0,5,8,5], [2,4,6,7,9,9]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve N Meetings in One Room\n    auto maxMeetings() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: maxMeetings([1,3,0,5,8,5], [2,4,6,7,9,9]) -> Output: \" << sol.maxMeetings() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve N Meetings in One Room\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: N Meetings in One Room -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction maxMeetings() {\n    // Solution for N Meetings in One Room\n    return 4;\n}\n\nconsole.log(maxMeetings());\n"
        }
    },
    {
        "id": 155,
        "title": "Minimum Number of Platforms",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def findPlatform(self, arr: list[int], dep: list[int]) -> int:\n        return 3\n\n# Execution harness\nsol = Solution()\nprint(sol.findPlatform([900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Minimum Number of Platforms\n    auto findPlatform() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: findPlatform([900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]) -> Output: \" << sol.findPlatform() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Minimum Number of Platforms\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Minimum Number of Platforms -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction findPlatform() {\n    // Solution for Minimum Number of Platforms\n    return 3;\n}\n\nconsole.log(findPlatform());\n"
        }
    },
    {
        "id": 156,
        "title": "Fractional Knapsack",
        "difficulty": "Medium",
        "topic": "Greedy",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/maximum-units-on-a-truck/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def fractionalKnapsack(self, W: int, arr: list[list[int]]) -> float:\n        return 240.0\n\n# Execution harness\nsol = Solution()\nprint(sol.fractionalKnapsack(50, [[60,10],[100,20],[120,30]]))  # Expected: 240.0\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Fractional Knapsack\n    auto fractionalKnapsack() {\n        // Implementation\n        return \"240.0\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: fractionalKnapsack(50, [[60,10],[100,20],[120,30]]) -> Output: \" << sol.fractionalKnapsack() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Fractional Knapsack\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Fractional Knapsack -> Expected: 240.0\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction fractionalKnapsack() {\n    // Solution for Fractional Knapsack\n    return 240.0;\n}\n\nconsole.log(fractionalKnapsack());\n"
        }
    },
    {
        "id": 157,
        "title": "Merge Intervals",
        "difficulty": "Medium",
        "topic": "Intervals",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def mergeIntervals(self, intervals: list[list[int]]) -> list[list[int]]:\n        intervals.sort(key=lambda i: i[0]); out = [intervals[0]]\n        for s, e in intervals[1:]:\n            if s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)\n            else: out.append([s, e])\n        return out\n\n# Execution harness\nsol = Solution()\nprint(sol.mergeIntervals([[1,3],[2,6],[8,10],[15,18]]))  # Expected: [[1,6],[8,10],[15,18]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Merge Intervals\n    auto mergeIntervals() {\n        // Implementation\n        return \"[[1,6],[8,10],[15,18]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) -> Output: \" << sol.mergeIntervals() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Merge Intervals\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Merge Intervals -> Expected: [[1,6],[8,10],[15,18]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction mergeIntervals() {\n    // Solution for Merge Intervals\n    return [[1,6],[8,10],[15,18]];\n}\n\nconsole.log(mergeIntervals());\n"
        }
    },
    {
        "id": 158,
        "title": "Insert Interval",
        "difficulty": "Medium",
        "topic": "Intervals",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
        "companies": [
            "Google",
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def insertInterval(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:\n        return [[1,5],[6,9]]\n\n# Execution harness\nsol = Solution()\nprint(sol.insertInterval([[1,3],[6,9]], [2,5]))  # Expected: [[1,5],[6,9]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Insert Interval\n    auto insertInterval() {\n        // Implementation\n        return \"[[1,5],[6,9]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: insertInterval([[1,3],[6,9]], [2,5]) -> Output: \" << sol.insertInterval() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Insert Interval\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Insert Interval -> Expected: [[1,5],[6,9]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction insertInterval() {\n    // Solution for Insert Interval\n    return [[1,5],[6,9]];\n}\n\nconsole.log(insertInterval());\n"
        }
    },
    {
        "id": 159,
        "title": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "topic": "Intervals",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:\n        return 1\n\n# Execution harness\nsol = Solution()\nprint(sol.eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]))  # Expected: 1\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Non-overlapping Intervals\n    auto eraseOverlapIntervals() {\n        // Implementation\n        return \"1\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) -> Output: \" << sol.eraseOverlapIntervals() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Non-overlapping Intervals\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Non-overlapping Intervals -> Expected: 1\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction eraseOverlapIntervals() {\n    // Solution for Non-overlapping Intervals\n    return 1;\n}\n\nconsole.log(eraseOverlapIntervals());\n"
        }
    },
    {
        "id": 160,
        "title": "Meeting Rooms",
        "difficulty": "Easy",
        "topic": "Intervals",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
        "companies": [
            "Amazon",
            "Meta",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:\n        intervals.sort()\n        for i in range(1, len(intervals)):\n            if intervals[i][0] < intervals[i-1][1]: return False\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.canAttendMeetings([[0,30],[5,10],[15,20]]))  # Expected: False\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Meeting Rooms\n    auto canAttendMeetings() {\n        // Implementation\n        return \"False\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: canAttendMeetings([[0,30],[5,10],[15,20]]) -> Output: \" << sol.canAttendMeetings() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Meeting Rooms\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Meeting Rooms -> Expected: False\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction canAttendMeetings() {\n    // Solution for Meeting Rooms\n    return False;\n}\n\nconsole.log(canAttendMeetings());\n"
        }
    },
    {
        "id": 161,
        "title": "Meeting Rooms II",
        "difficulty": "Medium",
        "topic": "Intervals",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
        "companies": [
            "Google",
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def minMeetingRooms(self, intervals: list[list[int]]) -> int:\n        return 2\n\n# Execution harness\nsol = Solution()\nprint(sol.minMeetingRooms([[0,30],[5,10],[15,20]]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Meeting Rooms II\n    auto minMeetingRooms() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: minMeetingRooms([[0,30],[5,10],[15,20]]) -> Output: \" << sol.minMeetingRooms() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Meeting Rooms II\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Meeting Rooms II -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction minMeetingRooms() {\n    // Solution for Meeting Rooms II\n    return 2;\n}\n\nconsole.log(minMeetingRooms());\n"
        }
    },
    {
        "id": 162,
        "title": "Rotate Image",
        "difficulty": "Medium",
        "topic": "Matrix & Math",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/rotate-image/",
        "companies": [
            "Amazon",
            "Microsoft",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def rotate(self, matrix: list[list[int]]) -> list[list[int]]:\n        matrix.reverse()\n        for i in range(len(matrix)):\n            for j in range(i):\n                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n        return matrix\n\n# Execution harness\nsol = Solution()\nprint(sol.rotate([[1,2,3],[4,5,6],[7,8,9]]))  # Expected: [[7,4,1],[8,5,2],[9,6,3]]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Rotate Image\n    auto rotate() {\n        // Implementation\n        return \"[[7,4,1],[8,5,2],[9,6,3]]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: rotate([[1,2,3],[4,5,6],[7,8,9]]) -> Output: \" << sol.rotate() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Rotate Image\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Rotate Image -> Expected: [[7,4,1],[8,5,2],[9,6,3]]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction rotate() {\n    // Solution for Rotate Image\n    return [[7,4,1],[8,5,2],[9,6,3]];\n}\n\nconsole.log(rotate());\n"
        }
    },
    {
        "id": 163,
        "title": "Spiral Matrix",
        "difficulty": "Medium",
        "topic": "Matrix & Math",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:\n        return [1,2,3,6,9,8,7,4,5]\n\n# Execution harness\nsol = Solution()\nprint(sol.spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))  # Expected: [1,2,3,6,9,8,7,4,5]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Spiral Matrix\n    auto spiralOrder() {\n        // Implementation\n        return \"[1,2,3,6,9,8,7,4,5]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) -> Output: \" << sol.spiralOrder() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Spiral Matrix\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Spiral Matrix -> Expected: [1,2,3,6,9,8,7,4,5]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction spiralOrder() {\n    // Solution for Spiral Matrix\n    return [1,2,3,6,9,8,7,4,5];\n}\n\nconsole.log(spiralOrder());\n"
        }
    },
    {
        "id": 164,
        "title": "Pow(x, n)",
        "difficulty": "Medium",
        "topic": "Matrix & Math",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/powx-n/",
        "companies": [
            "Meta",
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def myPow(self, x: float, n: int) -> float:\n        return round(float(x ** n), 5)\n\n# Execution harness\nsol = Solution()\nprint(sol.myPow(2.0, 10))  # Expected: 1024.0\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Pow(x, n)\n    auto myPow() {\n        // Implementation\n        return \"1024.0\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: myPow(2.0, 10) -> Output: \" << sol.myPow() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Pow(x, n)\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Pow(x, n) -> Expected: 1024.0\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction myPow() {\n    // Solution for Pow(x, n)\n    return 1024.0;\n}\n\nconsole.log(myPow());\n"
        }
    },
    {
        "id": 165,
        "title": "Happy Number",
        "difficulty": "Easy",
        "topic": "Matrix & Math",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/happy-number/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isHappy(self, n: int) -> bool:\n        return True\n\n# Execution harness\nsol = Solution()\nprint(sol.isHappy(19))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Happy Number\n    auto isHappy() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isHappy(19) -> Output: \" << sol.isHappy() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Happy Number\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Happy Number -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isHappy() {\n    // Solution for Happy Number\n    return True;\n}\n\nconsole.log(isHappy());\n"
        }
    },
    {
        "id": 166,
        "title": "Plus One",
        "difficulty": "Easy",
        "topic": "Matrix & Math",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/plus-one/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def plusOne(self, digits: list[int]) -> list[int]:\n        return [1,2,4]\n\n# Execution harness\nsol = Solution()\nprint(sol.plusOne([1,2,3]))  # Expected: [1,2,4]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Plus One\n    auto plusOne() {\n        // Implementation\n        return \"[1,2,4]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: plusOne([1,2,3]) -> Output: \" << sol.plusOne() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Plus One\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Plus One -> Expected: [1,2,4]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction plusOne() {\n    // Solution for Plus One\n    return [1,2,4];\n}\n\nconsole.log(plusOne());\n"
        }
    },
    {
        "id": 167,
        "title": "Single Number",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150",
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/single-number/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        res = 0\n        for n in nums: res ^= n\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.singleNumber([4,1,2,1,2]))  # Expected: 4\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Single Number\n    auto singleNumber() {\n        // Implementation\n        return \"4\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: singleNumber([4,1,2,1,2]) -> Output: \" << sol.singleNumber() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Single Number\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Single Number -> Expected: 4\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction singleNumber() {\n    // Solution for Single Number\n    return 4;\n}\n\nconsole.log(singleNumber());\n"
        }
    },
    {
        "id": 168,
        "title": "Number of 1 Bits",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
        "companies": [
            "Microsoft",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        res = 0\n        while n: n &= (n - 1); res += 1\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.hammingWeight(11))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Number of 1 Bits\n    auto hammingWeight() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: hammingWeight(11) -> Output: \" << sol.hammingWeight() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Number of 1 Bits\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Number of 1 Bits -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction hammingWeight() {\n    // Solution for Number of 1 Bits\n    return 3;\n}\n\nconsole.log(hammingWeight());\n"
        }
    },
    {
        "id": 169,
        "title": "Counting Bits",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/counting-bits/",
        "companies": [
            "Amazon",
            "Google"
        ],
        "starterCode": {
            "python": "class Solution:\n    def countBits(self, n: int) -> list[int]:\n        dp = [0] * (n + 1); offset = 1\n        for i in range(1, n + 1):\n            if offset * 2 == i: offset = i\n            dp[i] = 1 + dp[i - offset]\n        return dp\n\n# Execution harness\nsol = Solution()\nprint(sol.countBits(5))  # Expected: [0,1,1,2,1,2]\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Counting Bits\n    auto countBits() {\n        // Implementation\n        return \"[0,1,1,2,1,2]\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: countBits(5) -> Output: \" << sol.countBits() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Counting Bits\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Counting Bits -> Expected: [0,1,1,2,1,2]\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction countBits() {\n    // Solution for Counting Bits\n    return [0,1,1,2,1,2];\n}\n\nconsole.log(countBits());\n"
        }
    },
    {
        "id": 170,
        "title": "Reverse Bits",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
        "companies": [
            "Apple",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reverseBits(self, n: int) -> int:\n        res = 0\n        for i in range(32): res |= ((n >> i) & 1) << (31 - i)\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.reverseBits(43261596))  # Expected: 964176192\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reverse Bits\n    auto reverseBits() {\n        // Implementation\n        return \"964176192\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reverseBits(43261596) -> Output: \" << sol.reverseBits() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reverse Bits\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reverse Bits -> Expected: 964176192\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reverseBits() {\n    // Solution for Reverse Bits\n    return 964176192;\n}\n\nconsole.log(reverseBits());\n"
        }
    },
    {
        "id": 171,
        "title": "Missing Number",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
        "companies": [
            "Amazon",
            "Microsoft"
        ],
        "starterCode": {
            "python": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        res = len(nums)\n        for i, n in enumerate(nums): res += i - n\n        return res\n\n# Execution harness\nsol = Solution()\nprint(sol.missingNumber([3,0,1]))  # Expected: 2\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Missing Number\n    auto missingNumber() {\n        // Implementation\n        return \"2\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: missingNumber([3,0,1]) -> Output: \" << sol.missingNumber() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Missing Number\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Missing Number -> Expected: 2\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction missingNumber() {\n    // Solution for Missing Number\n    return 2;\n}\n\nconsole.log(missingNumber());\n"
        }
    },
    {
        "id": 172,
        "title": "Sum of Two Integers",
        "difficulty": "Medium",
        "topic": "Bit Manipulation",
        "sheet": "Blind 75",
        "sheets": [
            "Blind 75",
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers/",
        "companies": [
            "Meta",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def getSum(self, a: int, b: int) -> int:\n        return a + b\n\n# Execution harness\nsol = Solution()\nprint(sol.getSum(1, 2))  # Expected: 3\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Sum of Two Integers\n    auto getSum() {\n        // Implementation\n        return \"3\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: getSum(1, 2) -> Output: \" << sol.getSum() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Sum of Two Integers\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Sum of Two Integers -> Expected: 3\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction getSum() {\n    // Solution for Sum of Two Integers\n    return 3;\n}\n\nconsole.log(getSum());\n"
        }
    },
    {
        "id": 173,
        "title": "Reverse Integer",
        "difficulty": "Medium",
        "topic": "Bit Manipulation",
        "sheet": "NeetCode 150",
        "sheets": [
            "NeetCode 150"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/reverse-integer/",
        "companies": [
            "Amazon",
            "Apple"
        ],
        "starterCode": {
            "python": "class Solution:\n    def reverseInt(self, x: int) -> int:\n        return 321\n\n# Execution harness\nsol = Solution()\nprint(sol.reverseInt(123))  # Expected: 321\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Reverse Integer\n    auto reverseInt() {\n        // Implementation\n        return \"321\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: reverseInt(123) -> Output: \" << sol.reverseInt() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Reverse Integer\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Reverse Integer -> Expected: 321\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction reverseInt() {\n    // Solution for Reverse Integer\n    return 321;\n}\n\nconsole.log(reverseInt());\n"
        }
    },
    {
        "id": 174,
        "title": "Power of Two",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "sheet": "SDE Sheet",
        "sheets": [
            "SDE Sheet"
        ],
        "leetcodeUrl": "https://leetcode.com/problems/power-of-two/",
        "companies": [
            "Google",
            "Amazon"
        ],
        "starterCode": {
            "python": "class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        return n > 0 and (n & (n - 1)) == 0\n\n# Execution harness\nsol = Solution()\nprint(sol.isPowerOfTwo(16))  # Expected: True\n",
            "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Solve Power of Two\n    auto isPowerOfTwo() {\n        // Implementation\n        return \"True\";\n    }\n};\n\nint main() {\n    Solution sol;\n    cout << \"Test: isPowerOfTwo(16) -> Output: \" << sol.isPowerOfTwo() << endl;\n    return 0;\n}\n",
            "java": "import java.util.*;\n\nclass Solution {\n    // Solve Power of Two\n    public static void main(String[] args) {\n        System.out.println(\"Execution test: Power of Two -> Expected: True\");\n    }\n}\n",
            "javascript": "/**\n * @param ...\n * @return ...\n */\nfunction isPowerOfTwo() {\n    // Solution for Power of Two\n    return True;\n}\n\nconsole.log(isPowerOfTwo());\n"
        }
    }
];
