import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { ItemInterface } from "../items/itemsSlice"
import type { TableDataInterface } from "../table/tableSlice"
import type { UserDBInterface } from "../user/userSlice"
import { VITE_API_URL } from "@/constants/url"

export interface BillInterface {
  customer_name: string
  customer_phone: string
  payment_method: string
  id: string
  table: TableDataInterface
  items: ItemInterface[]
  total_amount: number
  user: UserDBInterface
  billed_at: string
}

export interface CreateBillInterface {
  customer_name: string
  customer_contact: string
  payment_method: string
  order_id: string
  table_id: string
  user_id: string
}

interface BillDataInterface {
  bills: BillInterface[]
  loading: boolean
  error: string | null
}

export const _createBill = createAsyncThunk<
  BillInterface,
  CreateBillInterface,
  { rejectValue: string }
>(
  "bill/fetchById",
  async (
    {
      customer_name,
      customer_contact,
      payment_method,
      order_id,
      table_id,
      user_id,
    },
    thunkAPI
  ) => {
    try {
      const response = await fetch(`${VITE_API_URL}/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customer_name,
          customer_contact: customer_contact,
          payment_method: payment_method,
          order_id: order_id,
          table_id: table_id,
          user_id: user_id,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Backend error response:", errorData)
        throw new Error(JSON.stringify(errorData) || "Failed to create bill")
      }

      const data = await response.json()
      return data as BillInterface
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const fetchBills = createAsyncThunk<
  BillInterface[],
  void,
  { rejectValue: string }
>("bill/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/bills`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Backend error response:", errorData)
      throw new Error(JSON.stringify(errorData) || "Failed to fetch bills")
    }

    const data = await response.json()
    // support both: array of bills or { bills: BillInterface[] }
    const bills: BillInterface[] = Array.isArray(data)
      ? data
      : (data?.bills ?? [])
    return bills
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const initialState: BillDataInterface = {
  bills: [],
  loading: false,
  error: null,
}

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(_createBill.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(_createBill.fulfilled, (state, action) => {
        // Support APIs that return either the created bill directly or an object { bill }
        const payload: any = action.payload
        const createdBill: BillInterface =
          payload && payload.bill ? payload.bill : payload
        state.loading = false
        state.error = null
        // Prepend created bill to bills array
        state.bills = [createdBill, ...(state.bills ?? [])]
      })
      .addCase(_createBill.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(fetchBills.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        // action.payload is BillInterface[]
        const payload: any = action.payload
        const bills: BillInterface[] = Array.isArray(payload)
          ? payload
          : (payload?.bills ?? [])
        state.loading = false
        state.error = null
        state.bills = bills
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export const {} = billSlice.actions

export default billSlice.reducer
