import { RouterProvider } from "react-router-dom";
import mainRouter from "./routes/main.routes";
export default function App() {
  return <RouterProvider router={mainRouter} />;
}
