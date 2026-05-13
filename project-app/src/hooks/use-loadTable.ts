import type { AppDispatch, RootState } from "@/redux/store"
import { fetchTable } from "@/redux/table/tableSlice"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.table.status)

  useEffect(() => {
    if (status !== "idle") return

    dispatch(
      activateToast({
        toastId: "load-table",
        status: "loading",
        message: "Loading Tables...",
      })
    )
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchTable())
        if (fetchTable.fulfilled.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-table",
              status: "success",
              message: "Tables Loaded.",
            })
          )
        } else if (fetchTable.rejected.match(result)) {
          const errorMessage =
            typeof result.payload === "string"
              ? result.payload
              : "Loading Table failed"
          dispatch(
            activateToast({
              toastId: "load-table",
              status: "error",
              message: errorMessage,
            })
          )
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occured"
        dispatch(
          activateToast({
            toastId: "load-table",
            status: "error",
            message,
          })
        )
      }
    }

    fetchData()
  }, [dispatch, status])
}

export default useLoadTable
