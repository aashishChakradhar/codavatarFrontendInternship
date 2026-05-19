import type { AppDispatch, RootState } from "@/redux/store"
import { fetchTable } from "@/redux/table/tableSlice"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const tables = useSelector((state: RootState) => state.table.tables)

  useEffect(() => {
    if (tables && tables.length > 0) return

    const fetchData = async () => {
      try {
        const result = await dispatch(fetchTable())
        if (fetchTable.pending.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-table",
              status: "loading",
              message: "Loading Tables...",
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
        } else if (fetchTable.fulfilled.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-table",
              status: "success",
              message: "Tables Loaded.",
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
  }, [dispatch, tables])
}

export default useLoadTable
