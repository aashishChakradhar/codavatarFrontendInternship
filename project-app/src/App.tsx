import { RouterProvider } from "react-router-dom"
import allRouter from "./routes/allRoutes"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import ErrorBoundary from "@/components/errorBoundary/errorBoundary"
import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchCurrentUser } from "@/redux/user/userSlice"
import { type AppDispatch, type RootState } from "./redux/store"

function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const loading = useSelector((state: RootState) => state.user.loading)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token || currentUser || loading) return

    void dispatch(fetchCurrentUser())
  }, [dispatch, currentUser, loading])

  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <Toaster position="top-right" richColors closeButton />
          <AuthBootstrap />
          <RouterProvider router={allRouter} />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  )
}
