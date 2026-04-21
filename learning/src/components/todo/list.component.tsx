import List, { type ListProp } from "./todo.component";
const todoItems: ListProp[] = [
  {
    status: "completed",
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables",
  },
  {
    status: "pending",
    title: "Finish project report",
    description: "Complete quarterly sales analysis",
  },
  {
    status: "completed",
    title: "Call dentist",
    description: "Schedule teeth cleaning appointment",
  },
  {
    status: "in-progress",
    title: "Learn React hooks",
    description: "Study useState, useEffect, and custom hooks",
  },
  {
    status: "pending",
    title: "Fix bug in login",
    description: "Email validation not working on form",
  },
  {
    status: "completed",
    title: "Review pull requests",
    description: "Check team members' code changes",
  },
  {
    status: "in-progress",
    title: "Design database schema",
    description: "Create tables for new user features",
  },
  {
    status: "pending",
    title: "Write unit tests",
    description: "Test payment processing module",
  },
  {
    status: "completed",
    title: "Deploy to staging",
    description: "Push version 2.1.0 to staging environment",
  },
  {
    status: "in-progress",
    title: "Update documentation",
    description: "Add API endpoint examples to README",
  },
];

export default function RenderList() {
  return (
    <table>
      <thead>
        <tr>
          <td>Title</td>
          <td>Task</td>
          <td>status</td>
        </tr>
      </thead>
      <tbody>
        {todoItems.map((item) => (
          <List {...item} />
        ))}
      </tbody>
    </table>
  );
}
