export interface SqlTableColumn {
  name: string;
  type: string;
  description?: string;
}

export interface SqlTableSchema {
  tableName: string;
  columns: SqlTableColumn[];
  sampleRows: Record<string, any>[];
}

export interface SqlProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Aggregations" | "Joins" | "Window Functions" | "Subqueries" | "CTEs";
  roleIds: string[]; // ["data-analyst", "data-scientist", "data-engineer", "software-engineer"]
  companyTags: string[];
  description: string;
  schemas: SqlTableSchema[];
  createTableSql: string;
  seedDataSql: string;
  solutionQuery: string;
  starterCode: {
    mysql: string;
    postgresql: string;
    sqlserver: string;
  };
}

export const ALL_SQL_PROBLEMS: SqlProblem[] = [
  // Problem 1: Department Average Salary & Headcount
  {
    id: "sql-dept-avg-salary",
    title: "Department Average Salary & Headcount",
    difficulty: "Easy",
    category: "Aggregations",
    roleIds: ["data-analyst", "data-scientist", "data-engineer", "software-engineer"],
    companyTags: ["Amazon", "Google", "Microsoft"],
    description: `Write a SQL query to find the **department name**, **total number of employees**, and **average salary** for each department.

- Round the average salary to **2 decimal places**.
- Rename the average column as \`avg_salary\` and employee count as \`emp_count\`.
- Order the results by \`avg_salary\` descending.`,
    schemas: [
      {
        tableName: "departments",
        columns: [
          { name: "id", type: "INT", description: "Department primary key" },
          { name: "dept_name", type: "VARCHAR", description: "Name of the department" }
        ],
        sampleRows: [
          { id: 1, dept_name: "Engineering" },
          { id: 2, dept_name: "Analytics" },
          { id: 3, dept_name: "Product" }
        ]
      },
      {
        tableName: "employees",
        columns: [
          { name: "id", type: "INT", description: "Employee ID" },
          { name: "name", type: "VARCHAR", description: "Employee Name" },
          { name: "salary", type: "INT", description: "Monthly salary" },
          { name: "dept_id", type: "INT", description: "Foreign key to departments.id" }
        ],
        sampleRows: [
          { id: 101, name: "Alice", salary: 95000, dept_id: 1 },
          { id: 102, name: "Bob", salary: 88000, dept_id: 1 },
          { id: 103, name: "Charlie", salary: 72000, dept_id: 2 },
          { id: 104, name: "Diana", salary: 85000, dept_id: 2 },
          { id: 105, name: "Evan", salary: 91000, dept_id: 3 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT);
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL, dept_id INTEGER);
    `,
    seedDataSql: `
      INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Analytics'), (3, 'Product');
      INSERT INTO employees VALUES
        (101, 'Alice', 95000, 1),
        (102, 'Bob', 88000, 1),
        (103, 'Charlie', 72000, 2),
        (104, 'Diana', 85000, 2),
        (105, 'Evan', 91000, 3);
    `,
    solutionQuery: `
      SELECT d.dept_name, COUNT(e.id) AS emp_count, ROUND(AVG(e.salary), 2) AS avg_salary
      FROM departments d
      JOIN employees e ON d.id = e.dept_id
      GROUP BY d.dept_name
      ORDER BY avg_salary DESC;
    `,
    starterCode: {
      mysql: `-- Write your MySQL query here
SELECT
  d.dept_name,
  -- TODO: Calculate emp_count and avg_salary
FROM departments d
-- TODO: Join with employees and group by department
;`,
      postgresql: `-- Write your PostgreSQL query here
SELECT
  d.dept_name,
  -- TODO: Calculate emp_count and avg_salary
FROM departments d
-- TODO: Join with employees and group by department
;`,
      sqlserver: `-- Write your SQL Server query here
SELECT
  d.dept_name,
  -- TODO: Calculate emp_count and avg_salary
FROM departments d
-- TODO: Join with employees and group by department
;`
    }
  },

  // Problem 2: Top Earner in Each Department (Window Function)
  {
    id: "sql-top-earner-dept",
    title: "Top Earners in Each Department",
    difficulty: "Medium",
    category: "Window Functions",
    roleIds: ["data-analyst", "data-scientist", "data-engineer", "software-engineer"],
    companyTags: ["Meta", "Amazon", "Netflix"],
    description: `Find the employee(s) who earn the highest salary in each department. If there are ties, return all employees with that top salary.

Return columns:
- \`dept_name\`
- \`employee_name\`
- \`salary\`

Order by \`dept_name\` ascending, then \`salary\` descending.`,
    schemas: [
      {
        tableName: "departments",
        columns: [
          { name: "id", type: "INT" },
          { name: "dept_name", type: "VARCHAR" }
        ],
        sampleRows: [
          { id: 1, dept_name: "Engineering" },
          { id: 2, dept_name: "Sales" }
        ]
      },
      {
        tableName: "employees",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR" },
          { name: "salary", type: "INT" },
          { name: "dept_id", type: "INT" }
        ],
        sampleRows: [
          { id: 1, name: "Joe", salary: 85000, dept_id: 1 },
          { id: 2, name: "Henry", salary: 80000, dept_id: 2 },
          { id: 3, name: "Sam", salary: 60000, dept_id: 2 },
          { id: 4, name: "Max", salary: 90000, dept_id: 1 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT);
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL, dept_id INTEGER);
    `,
    seedDataSql: `
      INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales');
      INSERT INTO employees VALUES
        (1, 'Joe', 85000, 1),
        (2, 'Henry', 80000, 2),
        (3, 'Sam', 60000, 2),
        (4, 'Max', 90000, 1);
    `,
    solutionQuery: `
      WITH Ranked AS (
        SELECT
          d.dept_name,
          e.name AS employee_name,
          e.salary,
          DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rnk
        FROM employees e
        JOIN departments d ON e.dept_id = d.id
      )
      SELECT dept_name, employee_name, salary
      FROM Ranked
      WHERE rnk = 1
      ORDER BY dept_name ASC, salary DESC;
    `,
    starterCode: {
      mysql: `-- Write your MySQL query using DENSE_RANK()
WITH RankedEmployees AS (
  -- TODO: Partition by department and rank by salary
)
SELECT dept_name, employee_name, salary
FROM RankedEmployees
WHERE rnk = 1;`,
      postgresql: `-- Write your PostgreSQL query using CTE and DENSE_RANK()
WITH RankedEmployees AS (
  -- TODO: Partition by department and rank by salary
)
SELECT dept_name, employee_name, salary
FROM RankedEmployees
WHERE rnk = 1;`,
      sqlserver: `-- Write your SQL Server query
WITH RankedEmployees AS (
  -- TODO: Partition by department and rank by salary
)
SELECT dept_name, employee_name, salary
FROM RankedEmployees
WHERE rnk = 1;`
    }
  },

  // Problem 3: Customers Who Never Ordered
  {
    id: "sql-customers-no-orders",
    title: "Customers Who Never Placed Orders",
    difficulty: "Easy",
    category: "Joins",
    roleIds: ["data-analyst", "business-analyst", "software-engineer"],
    companyTags: ["Uber", "Apple", "Shopify"],
    description: `Find all customers who have **never placed any order**.

Return column:
- \`Customers\` (the name of the customer)

Order alphabetically by customer name.`,
    schemas: [
      {
        tableName: "Customers",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR" }
        ],
        sampleRows: [
          { id: 1, name: "Joe" },
          { id: 2, name: "Henry" },
          { id: 3, name: "Sam" },
          { id: 4, name: "Max" }
        ]
      },
      {
        tableName: "Orders",
        columns: [
          { name: "id", type: "INT" },
          { name: "customerId", type: "INT" }
        ],
        sampleRows: [
          { id: 1, customerId: 3 },
          { id: 2, customerId: 1 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE Customers (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE Orders (id INTEGER PRIMARY KEY, customerId INTEGER);
    `,
    seedDataSql: `
      INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');
      INSERT INTO Orders VALUES (1, 3), (2, 1);
    `,
    solutionQuery: `
      SELECT c.name AS Customers
      FROM Customers c
      LEFT JOIN Orders o ON c.id = o.customerId
      WHERE o.id IS NULL
      ORDER BY c.name ASC;
    `,
    starterCode: {
      mysql: `-- Write your query using LEFT JOIN or NOT EXISTS
SELECT c.name AS Customers
FROM Customers c
-- TODO: Filter out customers with existing orders
;`,
      postgresql: `-- Write your query using LEFT JOIN or NOT EXISTS
SELECT c.name AS Customers
FROM Customers c
-- TODO: Filter out customers with existing orders
;`,
      sqlserver: `-- Write your query using LEFT JOIN or NOT EXISTS
SELECT c.name AS Customers
FROM Customers c
-- TODO: Filter out customers with existing orders
;`
    }
  },

  // Problem 4: Second Highest Salary
  {
    id: "sql-second-highest-salary",
    title: "Second Highest Salary",
    difficulty: "Medium",
    category: "Subqueries",
    roleIds: ["data-analyst", "data-engineer", "software-engineer"],
    companyTags: ["Google", "Amazon", "Adobe"],
    description: `Find the second highest distinct salary from the \`Employee\` table.
If there is no second highest salary, return \`NULL\`.

Return column:
- \`SecondHighestSalary\``,
    schemas: [
      {
        tableName: "Employee",
        columns: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" }
        ],
        sampleRows: [
          { id: 1, salary: 100 },
          { id: 2, salary: 200 },
          { id: 3, salary: 300 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE Employee (id INTEGER PRIMARY KEY, salary REAL);
    `,
    seedDataSql: `
      INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);
    `,
    solutionQuery: `
      SELECT MAX(salary) AS SecondHighestSalary
      FROM Employee
      WHERE salary < (SELECT MAX(salary) FROM Employee);
    `,
    starterCode: {
      mysql: `-- Write your query to find SecondHighestSalary
SELECT
  -- TODO: Query the second distinct highest salary
  MAX(salary) AS SecondHighestSalary
FROM Employee;`,
      postgresql: `-- Write your query to find SecondHighestSalary
SELECT
  -- TODO: Query the second distinct highest salary
  MAX(salary) AS SecondHighestSalary
FROM Employee;`,
      sqlserver: `-- Write your query to find SecondHighestSalary
SELECT
  -- TODO: Query the second distinct highest salary
  MAX(salary) AS SecondHighestSalary
FROM Employee;`
    }
  },

  // Problem 5: Employees Earning More Than Their Managers (Self Join)
  {
    id: "sql-more-than-manager",
    title: "Employees Earning More Than Their Managers",
    difficulty: "Easy",
    category: "Joins",
    roleIds: ["data-analyst", "software-engineer", "data-engineer"],
    companyTags: ["Facebook", "Microsoft", "Amazon"],
    description: `Write a SQL query to find the employees who earn **more than their direct managers**.

Return column:
- \`Employee\` (the name of the employee)

Order alphabetically by employee name.`,
    schemas: [
      {
        tableName: "Employee",
        columns: [
          { name: "id", type: "INT", description: "Employee ID" },
          { name: "name", type: "VARCHAR", description: "Employee Name" },
          { name: "salary", type: "INT", description: "Monthly salary" },
          { name: "managerId", type: "INT", description: "Manager's employee ID" }
        ],
        sampleRows: [
          { id: 1, name: "Joe", salary: 70000, managerId: 3 },
          { id: 2, name: "Henry", salary: 80000, managerId: 4 },
          { id: 3, name: "Sam", salary: 60000, managerId: null },
          { id: 4, name: "Max", salary: 90000, managerId: null }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE Employee (id INTEGER PRIMARY KEY, name TEXT, salary REAL, managerId INTEGER);
    `,
    seedDataSql: `
      INSERT INTO Employee VALUES
        (1, 'Joe', 70000, 3),
        (2, 'Henry', 80000, 4),
        (3, 'Sam', 60000, NULL),
        (4, 'Max', 90000, NULL);
    `,
    solutionQuery: `
      SELECT e.name AS Employee
      FROM Employee e
      JOIN Employee m ON e.managerId = m.id
      WHERE e.salary > m.salary
      ORDER BY e.name ASC;
    `,
    starterCode: {
      mysql: `-- Perform a Self Join between Employee as employee and manager
SELECT e.name AS Employee
FROM Employee e
-- TODO: Join with manager and compare salaries
;`,
      postgresql: `-- Perform a Self Join between Employee as employee and manager
SELECT e.name AS Employee
FROM Employee e
-- TODO: Join with manager and compare salaries
;`,
      sqlserver: `-- Perform a Self Join between Employee as employee and manager
SELECT e.name AS Employee
FROM Employee e
-- TODO: Join with manager and compare salaries
;`
    }
  },

  // Problem 6: Consecutive Active Logins (Window Functions & LEAD/LAG)
  {
    id: "sql-consecutive-logins",
    title: "Active Users with Consecutive Logins",
    difficulty: "Hard",
    category: "Window Functions",
    roleIds: ["data-analyst", "data-scientist", "data-engineer"],
    companyTags: ["Netflix", "Spotify", "Meta"],
    description: `Find all users who logged in at least **3 consecutive times** with the same active status.

Return column:
- \`user_id\`

Deduplicate results and order by \`user_id\` ascending.`,
    schemas: [
      {
        tableName: "Logins",
        columns: [
          { name: "id", type: "INT" },
          { name: "user_id", type: "INT" },
          { name: "login_date", type: "DATE" }
        ],
        sampleRows: [
          { id: 1, user_id: 101, login_date: "2026-03-01" },
          { id: 2, user_id: 101, login_date: "2026-03-02" },
          { id: 3, user_id: 101, login_date: "2026-03-03" },
          { id: 4, user_id: 102, login_date: "2026-03-01" },
          { id: 5, user_id: 102, login_date: "2026-03-04" }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE Logins (id INTEGER PRIMARY KEY, user_id INTEGER, login_date TEXT);
    `,
    seedDataSql: `
      INSERT INTO Logins VALUES
        (1, 101, '2026-03-01'),
        (2, 101, '2026-03-02'),
        (3, 101, '2026-03-03'),
        (4, 102, '2026-03-01'),
        (5, 102, '2026-03-04');
    `,
    solutionQuery: `
      SELECT DISTINCT l1.user_id
      FROM Logins l1
      JOIN Logins l2 ON l1.user_id = l2.user_id AND l2.id = l1.id + 1
      JOIN Logins l3 ON l1.user_id = l3.user_id AND l3.id = l1.id + 2
      ORDER BY l1.user_id ASC;
    `,
    starterCode: {
      mysql: `-- Write your query to find users with at least 3 consecutive records
SELECT DISTINCT user_id
FROM Logins;`,
      postgresql: `-- Write your query to find users with at least 3 consecutive records
SELECT DISTINCT user_id
FROM Logins;`,
      sqlserver: `-- Write your query to find users with at least 3 consecutive records
SELECT DISTINCT user_id
FROM Logins;`
    }
  },

  // Problem 7: High Volume Departments (HAVING & Aggregations)
  {
    id: "sql-high-volume-dept",
    title: "High Headcount Departments",
    difficulty: "Easy",
    category: "Aggregations",
    roleIds: ["data-analyst", "business-analyst"],
    companyTags: ["Salesforce", "Atlassian", "LinkedIn"],
    description: `Find all department names that have **at least 2 employees** and an average salary strictly greater than **$80,000**.

Return columns:
- \`dept_name\`
- \`total_staff\`
- \`avg_sal\` (rounded to 2 decimal places)

Order by \`avg_sal\` descending.`,
    schemas: [
      {
        tableName: "departments",
        columns: [
          { name: "id", type: "INT" },
          { name: "dept_name", type: "VARCHAR" }
        ],
        sampleRows: [
          { id: 1, dept_name: "Engineering" },
          { id: 2, dept_name: "Analytics" },
          { id: 3, dept_name: "Operations" }
        ]
      },
      {
        tableName: "staff",
        columns: [
          { name: "id", type: "INT" },
          { name: "dept_id", type: "INT" },
          { name: "salary", type: "INT" }
        ],
        sampleRows: [
          { id: 1, dept_id: 1, salary: 95000 },
          { id: 2, dept_id: 1, salary: 90000 },
          { id: 3, dept_id: 2, salary: 82000 },
          { id: 4, dept_id: 2, salary: 84000 },
          { id: 5, dept_id: 3, salary: 60000 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT);
      CREATE TABLE staff (id INTEGER PRIMARY KEY, dept_id INTEGER, salary REAL);
    `,
    seedDataSql: `
      INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Analytics'), (3, 'Operations');
      INSERT INTO staff VALUES
        (1, 1, 95000), (2, 1, 90000),
        (3, 2, 82000), (4, 2, 84000),
        (5, 3, 60000);
    `,
    solutionQuery: `
      SELECT d.dept_name, COUNT(s.id) AS total_staff, ROUND(AVG(s.salary), 2) AS avg_sal
      FROM departments d
      JOIN staff s ON d.id = s.dept_id
      GROUP BY d.dept_name
      HAVING COUNT(s.id) >= 2 AND AVG(s.salary) > 80000
      ORDER BY avg_sal DESC;
    `,
    starterCode: {
      mysql: `-- Write your query using GROUP BY and HAVING clauses
SELECT d.dept_name
FROM departments d
-- TODO: Join and filter using HAVING
;`,
      postgresql: `-- Write your query using GROUP BY and HAVING clauses
SELECT d.dept_name
FROM departments d
-- TODO: Join and filter using HAVING
;`,
      sqlserver: `-- Write your query using GROUP BY and HAVING clauses
SELECT d.dept_name
FROM departments d
-- TODO: Join and filter using HAVING
;`
    }
  },

  // Problem 8: Department Highest and Lowest Salary Gap (CTEs)
  {
    id: "sql-salary-gap",
    title: "Department Salary Spread & Gap",
    difficulty: "Medium",
    category: "CTEs",
    roleIds: ["data-analyst", "data-engineer", "data-scientist"],
    companyTags: ["Airbnb", "Goldman Sachs", "Morgan Stanley"],
    description: `Write a SQL query using a CTE to calculate the **salary spread** (difference between maximum salary and minimum salary) for each department.

Return columns:
- \`dept_name\`
- \`max_salary\`
- \`min_salary\`
- \`salary_gap\`

Order by \`salary_gap\` descending.`,
    schemas: [
      {
        tableName: "dept",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR" }
        ],
        sampleRows: [
          { id: 1, name: "Engineering" },
          { id: 2, name: "Marketing" }
        ]
      },
      {
        tableName: "salaries",
        columns: [
          { name: "id", type: "INT" },
          { name: "dept_id", type: "INT" },
          { name: "amount", type: "INT" }
        ],
        sampleRows: [
          { id: 1, dept_id: 1, amount: 120000 },
          { id: 2, dept_id: 1, amount: 80000 },
          { id: 3, dept_id: 2, amount: 75000 },
          { id: 4, dept_id: 2, amount: 65000 }
        ]
      }
    ],
    createTableSql: `
      CREATE TABLE dept (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE salaries (id INTEGER PRIMARY KEY, dept_id INTEGER, amount REAL);
    `,
    seedDataSql: `
      INSERT INTO dept VALUES (1, 'Engineering'), (2, 'Marketing');
      INSERT INTO salaries VALUES
        (1, 1, 120000), (2, 1, 80000),
        (3, 2, 75000), (4, 2, 65000);
    `,
    solutionQuery: `
      WITH DeptAgg AS (
        SELECT dept_id, MAX(amount) AS max_salary, MIN(amount) AS min_salary
        FROM salaries
        GROUP BY dept_id
      )
      SELECT d.name AS dept_name, a.max_salary, a.min_salary, (a.max_salary - a.min_salary) AS salary_gap
      FROM DeptAgg a
      JOIN dept d ON a.dept_id = d.id
      ORDER BY salary_gap DESC;
    `,
    starterCode: {
      mysql: `-- Write your CTE query to find the salary gap
WITH DeptAgg AS (
  SELECT dept_id, MAX(amount) AS max_salary, MIN(amount) AS min_salary
  FROM salaries
  GROUP BY dept_id
)
SELECT * FROM DeptAgg;`,
      postgresql: `-- Write your CTE query to find the salary gap
WITH DeptAgg AS (
  SELECT dept_id, MAX(amount) AS max_salary, MIN(amount) AS min_salary
  FROM salaries
  GROUP BY dept_id
)
SELECT * FROM DeptAgg;`,
      sqlserver: `-- Write your CTE query to find the salary gap
WITH DeptAgg AS (
  SELECT dept_id, MAX(amount) AS max_salary, MIN(amount) AS min_salary
  FROM salaries
  GROUP BY dept_id
)
SELECT * FROM DeptAgg;`
    }
  }
];

export function getSqlProblemById(id: string): SqlProblem | undefined {
  return ALL_SQL_PROBLEMS.find((p) => p.id === id);
}
