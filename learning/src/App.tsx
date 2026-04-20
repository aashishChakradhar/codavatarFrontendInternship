import { RouterProvider } from "react-router-dom";
import router from "./routes/main.routes";
export default function App() {
  return <RouterProvider router={router} />;
}
