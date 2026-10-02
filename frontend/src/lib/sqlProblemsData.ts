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
  COUNT(e.id) AS emp_count,
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.dept_id
GROUP BY d.dept_name
ORDER BY avg_salary DESC;`,
      postgresql: `-- Write your PostgreSQL query here
SELECT
  d.dept_name,
  COUNT(e.id) AS emp_count,
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.dept_id
GROUP BY d.dept_name
ORDER BY avg_salary DESC;`,
      sqlserver: `-- Write your SQL Server query here
SELECT
  d.dept_name,
  COUNT(e.id) AS emp_count,
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.dept_id
GROUP BY d.dept_name
ORDER BY avg_salary DESC;`
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
SELECT NULL;`,
      postgresql: `-- Write your PostgreSQL query using CTE and DENSE_RANK()
SELECT NULL;`,
      sqlserver: `-- Write your SQL Server query
SELECT NULL;`
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
SELECT name AS Customers FROM Customers;`,
      postgresql: `-- Write your query
SELECT name AS Customers FROM Customers;`,
      sqlserver: `-- Write your query
SELECT name AS Customers FROM Customers;`
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
SELECT NULL AS SecondHighestSalary;`,
      postgresql: `-- Write your query to find SecondHighestSalary
SELECT NULL AS SecondHighestSalary;`,
      sqlserver: `-- Write your query to find SecondHighestSalary
SELECT NULL AS SecondHighestSalary;`
    }
  }
];

export function getSqlProblemById(id: string): SqlProblem | undefined {
  return ALL_SQL_PROBLEMS.find(p => p.id === id);
}
