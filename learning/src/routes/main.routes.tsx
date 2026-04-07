import { Routes, Route } from "react-router-dom";
import Layout from "../layout/layout";
import { lazy, Suspense } from "react";

const Form = lazy(() => import("../pages/form/form.pages"));
const Submit = lazy(() => import("../pages/submit.page"));
const TodoList = lazy(() => import("../pages/todo/todo.page"));
const JunkApp = lazy(() => import("../pages/junk/junk.page"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<h2>Loading Page...</h2>}>
      <Routes>
        <Route element={<Layout />}>
          <Route key="home" path="/" element={<Form />} />
          <Route key="home" path="form" element={<Form />} />
          <Route key="submit" path="/submit" element={<Submit />} />
          <Route key="to" path="/todo" element={<TodoList />} />
          <Route key="junk" path="/junk" element={<JunkApp />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
