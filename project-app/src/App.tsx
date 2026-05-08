import { RouterProvider } from "react-router-dom"
import allRouter from "./routes/allRoutes"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import ErrorBoundary from "@/components/errorBoundary/errorBoundary"
import { PersistGate } from "redux-persist/integration/react"
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <RouterProvider router={allRouter} />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  )
}
