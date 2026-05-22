import {
  fetchItems,
  _updateItemStatus,
  type ItemInterface,
  type ItemStatusType,
} from "@/redux/items/itemsSlice"
import type { AppDispatch } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useDispatch } from "react-redux"

export default function useItem() {
  const dispatch = useDispatch<AppDispatch>()

  async function updateItemStatus(item: ItemInterface, status: ItemStatusType) {
    try {
      const itemIDs = item.backendIds?.length ? item.backendIds : [item.id]
      const results = await Promise.all(
        itemIDs.map((itemID) => dispatch(_updateItemStatus({ itemID, status })))
      )

      const hasRejected = results.some((result) =>
        _updateItemStatus.rejected.match(result)
      )

      if (hasRejected) {
        const errorMessage = "Update status failed"
        dispatch(
          activateToast({
            toastId: "update-status",
            status: "error",
            message: errorMessage,
          })
        )
      } else {
        dispatch(
          activateToast({
            toastId: "update-status",
            status: "success",
            message: "Item Status Updated",
          })
        )
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occured"
      dispatch(
        activateToast({
          toastId: "update-status",
          status: "error",
          message,
        })
      )
    }
  }

  async function readItem() {
    try {
      const result = await dispatch(fetchItems())
      if (fetchItems.pending.match(result)) {
        dispatch(
          activateToast({
            toastId: "load-items",
            status: "loading",
            message: "Loading Items...",
          })
        )
      } else if (fetchItems.rejected.match(result)) {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : "Loading Items failed"
        dispatch(
          activateToast({
            toastId: "load-items",
            status: "error",
            message: errorMessage,
          })
        )
      } else if (fetchItems.fulfilled.match(result)) {
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

  return { updateItemStatus, readItem }
}
