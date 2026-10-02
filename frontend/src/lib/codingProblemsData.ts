export interface CodingTestCase {
  id: number;
  input: any[];
  expected: any;
  description: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  roleIds: string[]; // e.g. ["software-engineer", "frontend-developer"]
  topics: string[];
  companyTags: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    python: string;
    c: string;
    cpp: string;
    java: string;
  };
  functionName: string;
  testCases: CodingTestCase[];
}

export interface CodingSubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  language: "python" | "c" | "cpp" | "java";
  code: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded";
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs: number;
  submittedAt: string;
}

export const ALL_CODING_PROBLEMS: CodingProblem[] = [
  // Problem 1: Two Sum (Classic LeetCode #1)
  {
    id: "prob-two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    roleIds: ["software-engineer", "frontend-developer", "data-scientist"],
    topics: ["Arrays", "Hash Table"],
    companyTags: ["Google", "Amazon", "Meta", "Microsoft", "Adobe"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Return the answer with the indices in ascending order.`,
    inputFormat: "An array of integers `nums` and an integer `target`.",
    outputFormat: "An array containing two integer indices `[i, j]`.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    // Write your solution here
    return result;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
    },
    functionName: "twoSum",
    testCases: [
      {
        id: 1,
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        description: "Standard positive array",
        isHidden: false
      },
      {
        id: 2,
        input: [[3, 2, 4], 6],
        expected: [1, 2],
        description: "Target with non-adjacent elements",
        isHidden: false
      },
      {
        id: 3,
        input: [[3, 3], 6],
        expected: [0, 1],
        description: "Array with duplicate values",
        isHidden: false
      },
      {
        id: 4,
        input: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
        description: "Negative numbers array",
        isHidden: true
      },
      {
        id: 5,
        input: [[0, 4, 3, 0], 0],
        expected: [0, 3],
        description: "Zeros sum target",
        isHidden: true
      }
    ]
  },

  // Problem 2: Valid Parentheses (LeetCode #20)
  {
    id: "prob-valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    roleIds: ["software-engineer", "frontend-developer"],
    topics: ["Strings", "Stack"],
    companyTags: ["Amazon", "Microsoft", "Meta", "Google"],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: "A single string `s` of bracket characters.",
    outputFormat: "A boolean `true` if valid, otherwise `false`.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      {
        input: "s = '()[]{}'",
        output: "true",
        explanation: "All brackets close correctly in order."
      },
      {
        input: "s = '(]'",
        output: "false",
        explanation: "Parenthesis is closed with a square bracket."
      }
    ],
    starterCode: {
      python: `def isValid(s):
    # Write your solution here
    pass`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

bool isValid(char* s) {
    // Write your solution here
    return false;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    functionName: "isValid",
    testCases: [
      {
        id: 1,
        input: ["()[]{}"],
        expected: true,
        description: "Consecutive valid brackets",
        isHidden: false
      },
      {
        id: 2,
        input: ["([{}])"],
        expected: true,
        description: "Nested balanced brackets",
        isHidden: false
      },
      {
        id: 3,
        input: ["(]"],
        expected: false,
        description: "Mismatched closing bracket",
        isHidden: false
      },
      {
        id: 4,
        input: ["["],
        expected: false,
        description: "Single unclosed opening bracket",
        isHidden: true
      },
      {
        id: 5,
        input: [")("],
        expected: false,
        description: "Closing bracket before opening",
        isHidden: true
      }
    ]
  },

  // Problem 3: Maximum Subarray (Kadane's Algorithm)
  {
    id: "prob-max-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    roleIds: ["software-engineer", "data-scientist", "data-engineer"],
    topics: ["Arrays", "Dynamic Programming", "Divide and Conquer"],
    companyTags: ["Google", "Amazon", "Microsoft", "Netflix"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: "An array of integers `nums`.",
    outputFormat: "An integer representing the maximum subarray sum.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23."
      }
    ],
    starterCode: {
      python: `def maxSubArray(nums):
    # Write your solution here using Kadane's Algorithm
    pass`,
      c: `#include <stdio.h>

int maxSubArray(int* nums, int numsSize) {
    // Write your solution here using Kadane's Algorithm
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here using Kadane's Algorithm
        return 0;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here using Kadane's Algorithm
        return 0;
    }
}`
    },
    functionName: "maxSubArray",
    testCases: [
      {
        id: 1,
        input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        expected: 6,
        description: "Mixed positive and negative array",
        isHidden: false
      },
      {
        id: 2,
        input: [[1]],
        expected: 1,
        description: "Single element array",
        isHidden: false
      },
      {
        id: 3,
        input: [[5, 4, -1, 7, 8]],
        expected: 23,
        description: "Mostly positive array",
        isHidden: false
      },
      {
        id: 4,
        input: [[-5, -3, -8, -1, -4]],
        expected: -1,
        description: "All negative numbers (max should be largest negative)",
        isHidden: true
      }
    ]
  },

  // Problem 4: Group By & Aggregate Metrics (Data Analyst & Scientist Challenge)
  {
    id: "prob-aggregate-metrics",
    slug: "aggregate-category-revenue",
    title: "Aggregate Department Revenue & AOV",
    difficulty: "Medium",
    roleIds: ["data-analyst", "data-scientist", "data-engineer"],
    topics: ["Data Wrangling", "Aggregations", "Business Analytics"],
    companyTags: ["Amazon", "Uber", "Flipkart"],
    description: `Given an array of order objects containing \`department\`, \`revenue\`, and \`orderId\`, write a function to calculate:
1. Total revenue per department
2. Average Order Value (AOV = totalRevenue / orderCount) rounded to 2 decimal places.

Return an object mapping department names to \`{ totalRevenue, orderCount, aov }\`.`,
    inputFormat: "An array of order objects: `[{ department: string, revenue: number, orderId: string }]`.",
    outputFormat: "An object with department keys and aggregated metric values.",
    constraints: [
      "1 <= orders.length <= 10^4",
      "revenue > 0"
    ],
    examples: [
      {
        input: `orders = [
  { department: "Electronics", revenue: 200, orderId: "1" },
  { department: "Electronics", revenue: 100, orderId: "2" },
  { department: "Apparel", revenue: 50, orderId: "3" }
]`,
        output: `{ "Electronics": { "totalRevenue": 300, "orderCount": 2, "aov": 150 }, "Apparel": { "totalRevenue": 50, "orderCount": 1, "aov": 50 } }`
      }
    ],
    starterCode: {
      python: `def aggregateDepartmentMetrics(orders):
    # Write your solution here
    pass`,
      c: `// This problem is best solved in Python due to its data-wrangling nature.
// A full C implementation requires manual hash map management.
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Write your solution here
// Tip: Use Python for a cleaner solution.
void aggregateDepartmentMetrics(/* orders array */ void* orders, int size) {
    // Write your solution here
}`,
      cpp: `// This problem is best solved in Python due to its data-wrangling nature.
// A C++ implementation can use std::unordered_map for grouping.
#include <bits/stdc++.h>
using namespace std;

struct Order {
    string department;
    double revenue;
    string orderId;
};

struct Metrics {
    double totalRevenue;
    int orderCount;
    double aov;
};

map<string, Metrics> aggregateDepartmentMetrics(vector<Order>& orders) {
    // Write your solution here
    return {};
}`,
      java: `// This problem is best solved in Python due to its data-wrangling nature.
// A Java implementation can use HashMap for grouping.
import java.util.*;

class Solution {
    public Map<String, Map<String, Object>> aggregateDepartmentMetrics(List<Map<String, Object>> orders) {
        // Write your solution here
        return new HashMap<>();
    }
}`
    },
    functionName: "aggregateDepartmentMetrics",
    testCases: [
      {
        id: 1,
        input: [[
          { department: "Electronics", revenue: 200, orderId: "1" },
          { department: "Electronics", revenue: 100, orderId: "2" },
          { department: "Apparel", revenue: 50, orderId: "3" }
        ]],
        expected: {
          Electronics: { totalRevenue: 300, orderCount: 2, aov: 150 },
          Apparel: { totalRevenue: 50, orderCount: 1, aov: 50 }
        },
        description: "Two departments multiple orders",
        isHidden: false
      },
      {
        id: 2,
        input: [[
          { department: "Books", revenue: 19.99, orderId: "b1" },
          { department: "Books", revenue: 29.99, orderId: "b2" }
        ]],
        expected: {
          Books: { totalRevenue: 49.98, orderCount: 2, aov: 24.99 }
        },
        description: "Floating point rounding verification",
        isHidden: true
      }
    ]
  },

  // Problem 5: Binary Search (LeetCode #704)
  {
    id: "prob-binary-search",
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    roleIds: ["software-engineer", "frontend-developer", "data-scientist"],
    topics: ["Binary Search", "Arrays"],
    companyTags: ["Google", "Amazon", "Microsoft", "Apple"],
    description: `Given an array of integers \`nums\` which is sorted in **ascending order**, and an integer \`target\`, write a function to search \`target\` in \`nums\`.

If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: "A sorted array of integers `nums` and an integer `target`.",
    outputFormat: "The integer index of `target`, or `-1` if not found.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4."
      },
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1."
      }
    ],
    starterCode: {
      python: `def search(nums, target):
    # Write your solution here
    pass`,
      c: `#include <stdio.h>

int search(int* nums, int numsSize, int target) {
    // Write your solution here
    return -1;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`
    },
    functionName: "search",
    testCases: [
      {
        id: 1,
        input: [[-1, 0, 3, 5, 9, 12], 9],
        expected: 4,
        description: "Target present in right half",
        isHidden: false
      },
      {
        id: 2,
        input: [[-1, 0, 3, 5, 9, 12], 2],
        expected: -1,
        description: "Target not present",
        isHidden: false
      },
      {
        id: 3,
        input: [[5], 5],
        expected: 0,
        description: "Single element present",
        isHidden: true
      },
      {
        id: 4,
        input: [[2, 5], 5],
        expected: 1,
        description: "Two elements target right",
        isHidden: true
      }
    ]
  },

  // Problem 6: Best Time to Buy and Sell Stock (LeetCode #121)
  {
    id: "prob-buy-sell-stock",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    roleIds: ["software-engineer", "frontend-developer", "data-analyst", "data-scientist"],
    topics: ["Arrays", "Dynamic Programming", "Greedy"],
    companyTags: ["Amazon", "Meta", "Google", "Goldman Sachs"],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    inputFormat: "An array of numbers `prices`.",
    outputFormat: "An integer representing maximum achievable profit.",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    examples: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    starterCode: {
      python: `def maxProfit(prices):
    # Write your solution here
    pass`,
      c: `#include <stdio.h>

int maxProfit(int* prices, int pricesSize) {
    // Write your solution here
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}`
    },
    functionName: "maxProfit",
    testCases: [
      {
        id: 1,
        input: [[7, 1, 5, 3, 6, 4]],
        expected: 5,
        description: "Standard ascending valley to peak",
        isHidden: false
      },
      {
        id: 2,
        input: [[7, 6, 4, 3, 1]],
        expected: 0,
        description: "Monotonically decreasing prices",
        isHidden: false
      },
      {
        id: 3,
        input: [[1, 2]],
        expected: 1,
        description: "Two prices with profit",
        isHidden: true
      },
      {
        id: 4,
        input: [[2, 4, 1]],
        expected: 2,
        description: "Lowest price at end cannot be sold",
        isHidden: true
      }
    ]
  }
];

export function getCodingProblemsForRole(roleId: string): CodingProblem[] {
  return ALL_CODING_PROBLEMS.filter(p => p.roleIds.includes(roleId) || p.roleIds.includes("all"));
}

export function getCodingProblemBySlug(slug: string): CodingProblem | undefined {
  return ALL_CODING_PROBLEMS.find(p => p.slug === slug || p.id === slug);
}
