import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import { VITE_API_URL } from "@/constants/url"
import type { UserDataInterface, UserDBInterface } from "../user/userSlice"
import type { ItemInterface } from "../items/itemsSlice"
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
  pendingItems: ItemInterface[]
  items: ItemInterface[]
  item: ItemInterface | null
  loading: boolean
  error: string | null
}
const initialState: OrderDataInterface = {
  orders: [],
  order: null,
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

export const createOrder = createAsyncThunk<
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

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOptimisticOrder: (state, action: PayloadAction<OrderInterface>) => {
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
      state.orders = state.orders.map((o) =>
        String(o.id) === String(orderId)
          ? { ...o, items: [...(o.items ?? []), ...items] }
          : o
      )
      if (state.order && String(state.order.id) === String(orderId)) {
        state.order = {
          ...state.order,
          items: [...(state.order.items ?? []), ...items],
        }
      }
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
        state.orders = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.order = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
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
  },
})

export const {
  addOptimisticOrder,
  removeOrderById,
  replaceOrderTempId,
  addItemsToOrder,
} = orderSlice.actions

export default orderSlice.reducer
