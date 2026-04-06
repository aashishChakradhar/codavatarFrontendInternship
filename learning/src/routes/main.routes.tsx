import { Routes, Route } from "react-router-dom";
import Layout from "../layout/layout";

import Form from "../pages/form/form.pages";
import Submit from "../pages/submit.page";
import TodoList from "../pages/todo/todo.page";
import JunkApp from "../pages/junk/junk.page";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route key="home" path="/" element={<Form />} />
        <Route key="home" path="form" element={<Form />} />
        <Route key="submit" path="/submit" element={<Submit />} />
        <Route key="to" path="/todo" element={<TodoList />} />
        <Route key="junk" path="/junk" element={<JunkApp />} />
      </Route>
    </Routes>
  );
}
