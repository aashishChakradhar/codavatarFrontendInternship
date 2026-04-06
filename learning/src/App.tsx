import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/main.routes";
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
