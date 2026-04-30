import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./state/store";
import mainRouter from "./routes/main.routes";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={mainRouter} />
    </Provider>
  );
}
