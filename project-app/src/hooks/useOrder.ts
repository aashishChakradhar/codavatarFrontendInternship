import {
  clearItems,
  _createItems,
  addOptimisticItems,
} from "@/redux/items/itemsSlice"
import {
  _createOrder,
  addOptimisticOrderList,
  removeOrderById,
  replaceOrderTempId,
  addItemsToOrder,
  type OrderInterface,
  fetchAllOrders,
} from "@/redux/order/orderSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { store } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"

export default function useOrder() {
  const order = useSelector((state: RootState) => state.order.order)
  const orderList = useSelector((state: RootState) => state.order.orders)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const createItemData = useSelector(
    (state: RootState) => state.item.createItemData
  )
  const table = useSelector((state: RootState) => state.table.selectedTable)

  const dispatch = useDispatch<AppDispatch>()

  async function createOrder() {
    try {
      // check if table is selected
      if (!table || !table.id) {
        console.error("No table selected")
        return
      }

      // seleted items exists
      if (!createItemData || createItemData.length === 0) return

      // find pending order for this table(already existing order)
      const pendingOrder = orderList.find((ol) => {
        if (!ol) return false
        if (ol.status !== "pending") return false
        const olTable = (ol as any).table
        if (!olTable) return false
        return String(olTable.id) === String(table.id)
      })

      let orderId = pendingOrder?.id ?? order?.id

      // If there is an existing pending order for this table, optimistically append items to it
      if (pendingOrder?.id) {
        // create optimistic items so UI can render them immediately
        const tempItemsForPending = (createItemData || []).map((it, idx) => ({
          id: `temp-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${idx}`,
          quantity: it.quantity,
          quantity_type: it.quantity_type,
          remark: it.remark,
          status: (it.status as any) ?? "pending",
          dish: it.dish,
        }))

        dispatch(addOptimisticItems(tempItemsForPending as any))
        dispatch(
          addItemsToOrder({
            orderId: pendingOrder.id,
            items: tempItemsForPending as any,
          })
        )

        console.log(
          "[useCreateOrder] appended optimistic items to existing order:",
          pendingOrder.id
        )
      }

      // If no pending or existing order, create one
      if (!orderId) {
        // user missing
        const userForOrder = currentUser
        if (!userForOrder?.userId) {
          console.error("No user available to create order")
          return
        }

        // create optimistic order object with temporary id
        let tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        // create optimistic items so UI can render them immediately
        const tempItems = (createItemData || []).map((it, idx) => ({
          id: `temp-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${idx}`,
          quantity: it.quantity,
          quantity_type: it.quantity_type,
          remark: it.remark,
          status: (it.status as any) ?? "pending",
          dish: it.dish,
        }))

        const tempOrder: OrderInterface = {
          id: tempId,
          items: tempItems as any,
          status: "pending" as const,
          remark: "",
          table: table || null,
          user: userForOrder,
        }

        // add optimistic items to items slice so other views update immediately
        dispatch(addOptimisticItems(tempItems as any))

        console.log(
          "[useCreateOrder] after addOptimisticItems:",
          store.getState().item.items
        )
        // if there is an existing pending order for this table, append items to it
        if (pendingOrder?.id) {
          dispatch(
            addItemsToOrder({
              orderId: pendingOrder.id,
              items: tempItems as any,
            })
          )
        }
        // add optimistic order to state so UI shows it immediately
        dispatch(addOptimisticOrderList(tempOrder))
        console.log(
          "[useCreateOrder] after addOptimisticOrderList:",
          store.getState().order.orders[0]
        )

        // call backend to create real order
        const orderAction = await dispatch(
          _createOrder({
            userID: userForOrder.userId,
            tableID: table.id,
            status: "pending",
            remark: "",
          })
        )

        if (_createOrder.fulfilled.match(orderAction)) {
          orderId = orderAction.payload.id
          // replace temp with real order
          dispatch(replaceOrderTempId({ tempId, order: orderAction.payload }))
        } else {
          // remove optimistic order and abort
          dispatch(removeOrderById(tempId))
          console.error(
            "Failed to create order:",
            orderAction.payload ?? orderAction.error?.message
          )
          return
        }
      }

      if (!createItemData || createItemData.length === 0) {
        // nothing to add
        return
      }

      const itemsWithOrder = createItemData.map((it) => ({
        ...it,
        order_id: orderId,
      }))

      const resultAction = await dispatch(
        _createItems({ itemList: itemsWithOrder })
      )

      if (_createItems.fulfilled.match(resultAction)) {
        if (orderId) {
          dispatch(
            addItemsToOrder({
              orderId,
              items: resultAction.payload as any,
            })
          )
        }
        dispatch(clearItems())
        return
      }

      console.error(
        "Failed to create items:",
        resultAction.payload ?? resultAction.error?.message
      )
    } catch (err) {
      console.error("Create Order Error:", err)
    }
  }

  async function readOrder() {
    if (orderList && orderList.length > 0) return
    try {
      const result = await dispatch(fetchAllOrders())
      if (fetchAllOrders.pending.match(result)) {
        dispatch(
          activateToast({
            toastId: "load-order",
            status: "loading",
            message: "Loading Orders...",
          })
        )
      } else if (fetchAllOrders.fulfilled.match(result)) {
        dispatch(
          activateToast({
            toastId: "load-order",
            status: "success",
            message: "Orders Loaded.",
          })
        )
      } else if (fetchAllOrders.rejected.match(result)) {
        const errorMessage = result.payload || "Loading menu failed"
        dispatch(
          activateToast({
            toastId: "load-order",
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
          toastId: "load-order",
          status: "error",
          message,
        })
      )
    }
  }

  return [createOrder, readOrder]
}
