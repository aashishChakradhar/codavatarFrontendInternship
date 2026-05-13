import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { MenuDBInterface } from "../menu/menuSlice"
import { VITE_API_URL } from "@/constants/url"
import type { TableDBInterface } from "../table/tableSlice"
import type { UserDBInterface } from "../user/userSlice"

export interface ItemsListInterface {
  quantity: number
  quantity_type: string
  remark: string | null
  status: "in-progress" | "ready" | "pending" | "delivered" | "cancelled"
  dish: MenuDBInterface
  id: string
}
export interface OrderListInterface {
  items: ItemsListInterface[]
  status: "in-progress" | "ready" | "pending" | "delivered" | "cancelled"
  remark: string
  table: TableDBInterface | null
  user: UserDBInterface | null
}

export interface OrderInterface {
  orders: OrderListInterface[]
  status: "idle" | "pending" | "succeeded" | "failed"
  loading: boolean
  error: string | null
}

const initialState: OrderInterface = {
  orders: [],
  status: "idle",
  loading: false,
  error: null,
}

export const fetchItems = createAsyncThunk<
  OrderListInterface[],
  void,
  { rejectValue: string }
>("items/fetchItems", async (_, thunkAPI) => {
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
      return data as OrderListInterface[]
    }

    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { orders?: unknown }).orders)
    ) {
      return (data as { orders: OrderListInterface[] }).orders
    }

    return thunkAPI.rejectWithValue("Invalid orders response format")
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.status = "succeeded"
        state.orders = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.status = "failed"
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export default itemSlice.reducer
