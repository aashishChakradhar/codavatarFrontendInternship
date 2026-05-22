import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import { VITE_API_URL } from "@/constants/url"
import type { UserDataInterface, UserDBInterface } from "../user/userSlice"
import type { ItemInterface, ItemStatusType } from "../items/itemsSlice"
import type { TableDataInterface } from "../table/tableSlice"

export const orderStatus = [
  "idle",
  "pending",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
  "open",
  "closed",
]
export type OrderStatusType = (typeof orderStatus)[number]

export interface OrderInterface {
  id: string
  items: ItemInterface[]
  status: OrderStatusType
  remark: string
  table: TableDataInterface | null
  user: UserDBInterface | UserDataInterface | null
}

//redux data
export interface OrderDataInterface {
  orders: OrderInterface[]
  order: OrderInterface | null
  orderTemp: OrderInterface[] | null
  pendingItems: ItemInterface[]
  items: ItemInterface[]
  item: ItemInterface | null
  loading: boolean
  error: string | null
}
const initialState: OrderDataInterface = {
  orders: [],
  order: null,
  orderTemp: null,
  items: [],
  item: null,
  pendingItems: [],
  loading: false,
  error: null,
}

export const fetchAllOrders = createAsyncThunk<
  OrderInterface[],
  void,
  { rejectValue: string }
>("items/fetchAllOrders", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/orders/`, {
      method: "GET",
      headers: {},
    })
    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      return thunkAPI.rejectWithValue(
        text || `HTTP error! status: ${response.status}`
      )
    }
    const data = (await response.json()) as unknown

    if (Array.isArray(data)) {
      return data as OrderInterface[]
    }

    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { orders?: unknown }).orders)
    ) {
      return (data as { orders: OrderInterface[] }).orders
    }

    return thunkAPI.rejectWithValue("Invalid orders response format")
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const _createOrder = createAsyncThunk<
  OrderInterface,
  { tableID: string; userID: string; status: string; remark: string },
  { rejectValue: string }
>(
  "order/createOrder",
  async ({ tableID, userID, status, remark }, thunkAPI) => {
    try {
      const response = await fetch(`${VITE_API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id: tableID,
          user_id: userID,
          status: status,
          remark: remark,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Backend error response:", errorData)
        throw new Error(JSON.stringify(errorData) || "Failed to create order")
      }

      const data = await response.json()
      return data as OrderInterface
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const fetchOrder = createAsyncThunk<
  OrderInterface,
  { orderID: string },
  { rejectValue: string }
>("order/fetchOrder", async ({ orderID }, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/orders/${orderID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) {
      throw new Error("Failed to update status")
    }
    const data = await response.json()
    return data as OrderInterface
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateOrderStatus = createAsyncThunk<
  OrderInterface,
  { orderId: string; updateStatus: OrderStatusType },
  { rejectValue: string }
>("orders/updateStatus", async ({ orderId, updateStatus }, thunkAPI) => {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) {
      return thunkAPI.rejectWithValue("Missing access token")
    }

    const url = `${VITE_API_URL}/orders/${orderId}`
    console.debug("updateOrderStatus: PATCH", url, { status: updateStatus })

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: updateStatus }),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => "")
      // eslint-disable-next-line no-console
      console.error(
        "updateOrderStatus: server returned non-OK",
        response.status,
        text
      )
      return thunkAPI.rejectWithValue(`HTTP ${response.status}: ${text}`)
    }
    const data = await response.json().catch(() => null)
    console.debug("gotIt", data)
    return (data as OrderInterface) ?? ({} as OrderInterface)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOptimisticOrderList: (state, action: PayloadAction<OrderInterface>) => {
      state.orders = [action.payload, ...state.orders]
    },

    removeOrderById: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (o) => String(o.id) !== String(action.payload)
      )
      if (state.order && String(state.order.id) === String(action.payload)) {
        state.order = null
      }
    },

    replaceOrderTempId: (
      state,
      action: PayloadAction<{ tempId: string; order: OrderInterface }>
    ) => {
      const { tempId, order } = action.payload
      state.orders = state.orders.map((o) =>
        String(o.id) === String(tempId) ? order : o
      )
      if (state.order && String(state.order.id) === String(tempId)) {
        state.order = order
      }
    },

    addItemsToOrder: (
      state,
      action: PayloadAction<{ orderId: string; items: ItemInterface[] }>
    ) => {
      const { orderId, items } = action.payload
      const mergeItems = (
        existing: ItemInterface[] | undefined,
        incoming: ItemInterface[]
      ) => {
        const merged = [...(existing ?? [])]
        for (const s of incoming) {
          const byId = merged.findIndex((it) => String(it.id) === String(s.id))
          if (byId !== -1) {
            merged[byId] = s
            continue
          }
          const byDish = merged.findIndex(
            (it) =>
              (it.dish as any)?.id === (s.dish as any)?.id &&
              it.status === "pending"
          )
          if (byDish !== -1) {
            merged[byDish] = s
            continue
          }
          merged.push(s)
        }
        return merged
      }

      state.orders = state.orders.map((o) =>
        String(o.id) === String(orderId)
          ? { ...o, items: mergeItems(o.items, items) }
          : o
      )
      if (state.order && String(state.order.id) === String(orderId)) {
        state.order = {
          ...state.order,
          items: mergeItems(state.order.items, items),
        }
      }
    },

    updateOrderItemStatus: (
      state,
      action: PayloadAction<{ itemID: string; status: ItemStatusType }>
    ) => {
      const { itemID, status } = action.payload
      // update all orders lists
      state.orders = state.orders.map((o) => ({
        ...o,
        items: o.items.map((it) =>
          String(it.id) === String(itemID) ? { ...it, status } : it
        ),
      }))

      // update currently selected order if present
      if (state.order) {
        state.order = {
          ...state.order,
          items: state.order.items.map((it) =>
            String(it.id) === String(itemID) ? { ...it, status } : it
          ),
        }
      }
    },

    selectOrder: (
      state,
      action: PayloadAction<OrderInterface | { order: OrderInterface }>
    ) => {
      state.order =
        "order" in action.payload ? action.payload.order : action.payload
    },

    clearOrder: (state) => {
      state.order = null
    },

    selectTempOrder: (
      state,
      action: PayloadAction<
        | OrderInterface
        | OrderInterface[]
        | { order: OrderInterface }
        | Record<string, ItemInterface[]>
        | any
      >
    ) => {
      const payload = action.payload

      // If payload is already an array of orders, store directly
      if (Array.isArray(payload)) {
        state.orderTemp = payload as OrderInterface[]
        return
      }

      // If payload is a map of orderId -> items (grouped), convert to OrderInterface[]
      if (
        payload &&
        typeof payload === "object" &&
        !("id" in payload) &&
        Object.values(payload).every((v) => Array.isArray(v))
      ) {
        const orders = Object.entries(payload).map(([orderId, items]) => {
          // try to find an existing order to copy table/user info
          const existing = state.orders.find(
            (o) => String(o.id) === String(orderId)
          )
          return {
            id: orderId,
            items: items as ItemInterface[],
            status: (existing?.status as OrderStatusType) ?? "pending",
            remark: existing?.remark ?? "",
            table: existing?.table ?? null,
            user: existing?.user ?? null,
          }
        })
        state.orderTemp = orders
        return
      }

      // If payload is a wrapped { order } or single OrderInterface
      if (payload && typeof payload === "object") {
        if ("order" in payload && payload.order) {
          state.orderTemp = [payload.order as OrderInterface]
          return
        }
        if ("id" in payload) {
          state.orderTemp = [payload as OrderInterface]
          return
        }
      }

      // Fallback: clear temp
      state.orderTemp = null
    },

    clearTempOrder: (state) => {
      state.orderTemp = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        // Ensure items inside each order are sorted alphabetically by dish name (fallback to id)
        const sortedOrders = (action.payload ?? []).map((o) => ({
          ...o,
          items: [...o.items]
            .slice()
            .sort((a, b) =>
              String((a as any)?.dish?.name ?? a.id).localeCompare(
                String((b as any)?.dish?.name ?? b.id)
              )
            ),
        }))
        state.orders = sortedOrders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(_createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(_createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.order = action.payload
      })
      .addCase(_createOrder.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(fetchOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false
        state.order = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const payload = action.payload
        state.loading = false
        state.error = null
        // replace existing order if present, otherwise prepend
        const idx = state.orders.findIndex(
          (o) => String(o.id) === String(payload.id)
        )
        if (idx !== -1) {
          state.orders[idx] = payload
        } else {
          state.orders = [payload, ...state.orders]
        }
        // update currently selected order if it matches
        if (state.order && String(state.order.id) === String(payload.id)) {
          state.order = payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export const {
  addOptimisticOrderList,
  removeOrderById,
  replaceOrderTempId,
  addItemsToOrder,
  updateOrderItemStatus,
  selectOrder,
  selectTempOrder,
} = orderSlice.actions

export default orderSlice.reducer
