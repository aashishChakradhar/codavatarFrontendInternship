import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit"
import { fetchTable } from "../table/tableSlice"

import { type OrderStateType, type StatusType } from "../../constants/constants"
import type { OrderDataInterface } from "@/data/orderData"

export interface OrderTempInterface {
  itemId: number
  name: string
  quantity: number
  price: number
}

export interface OrderSliceInterface {
  orderTemp: OrderTempInterface[]
  orders: OrderDataInterface[]
  status: StatusType
  error: string | null
}

interface ConfirmOrderPayloadInterface {
  orderList: OrderTempInterface[]
  table: number
  section: string
}
interface AcceptOrderPayloadInterface {
  orderList: OrderDataInterface
}
interface ChangeOrderPayloadInterface {
  order: OrderDataInterface
  orderState: OrderStateType
}

const initialState: OrderSliceInterface = {
  orderTemp: [],
  orders: [],
  status: "idle",
  error: null,
}

export const fetchOrder = createAsyncThunk<OrderDataInterface[]>(
  "order/fetchOrder",
  async (_, thunkAPI) => {
    try {
      const mod = await import("@/data/orderData")
      return mod.orderData
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load order data")
    }
  }
)

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // payload=allValues
    addItem: (state, action) => {
      const newItem = action.payload

      //   check if item already exists
      const existingItem = state.orderTemp.find(
        (order) => order.itemId === newItem.itemId
      )

      if (!existingItem) {
        //if no add the order
        state.orderTemp.push({
          ...newItem,
        })
      } else {
        // if yes update the value
        existingItem.quantity += newItem.quantity
      }
    },

    removeItem: (state, action) => {
      const removeItem = action.payload

      // check if item exist
      const existingItem = state.orderTemp.find(
        (order) => order.itemId === removeItem.itemId
      )

      if (!existingItem) return
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1
      } else if (existingItem.quantity === 1) {
        const index = state.orderTemp.findIndex(
          (order) => order.itemId === existingItem.itemId
        )
        // If found, remove it using splice
        if (index !== -1) {
          state.orderTemp.splice(index, 1)
        }
      }
    },

    confirmOrder: (
      state,
      action: PayloadAction<ConfirmOrderPayloadInterface>
    ) => {
      const { orderList, table, section } = action.payload

      orderList.forEach((order: OrderTempInterface) => {
        state.orders.push({
          orderId: 1001,
          ...order,
          table,
          section,
          state: "pending",
        })
      })
    },
    acceptOrder: (
      state,
      action: PayloadAction<AcceptOrderPayloadInterface>
    ) => {
      const { orderList } = action.payload

      state.orders.forEach((order) => {
        if (order.itemId === orderList.itemId) {
          state.orders.push({ ...order, state: "preparing" })
        }
      })
    },

    changeOrderState: (
      state,
      action: PayloadAction<ChangeOrderPayloadInterface>
    ) => {
      const { order, orderState } = action.payload

      const targetOrder = state.orders.find(
        (orderItem) =>
          orderItem.itemId === order.itemId &&
          orderItem.table === order.table &&
          orderItem.section === order.section
      )

      if (targetOrder) {
        targetOrder.state = orderState
      }
    },

    clearOrder: () => initialState,
    clearOrderTemp: (state) => {
      state.orderTemp = []
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export const {
  addItem,
  removeItem,
  confirmOrder,
  changeOrderState,
  clearOrder,
  clearOrderTemp,
} = orderSlice.actions
export default orderSlice.reducer
