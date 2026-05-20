import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { DishDBInterface } from "../menu/menuSlice"
import { VITE_API_URL } from "@/constants/url"

export const itemStatus = [
  "pending",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
]
export type ItemStatusType = (typeof itemStatus)[number]

export interface ItemInterface {
  quantity: number
  quantity_type: string
  remark: string | null
  status: ItemStatusType
  dish: DishDBInterface
  id: string
  backendIds?: string[]
}
export interface CreateItemInterface {
  quantity: number
  quantity_type: string
  remark: string
  status: string
  order_id: string
  dish_id: string
  dish: DishDBInterface
}

interface ItemDataInterface {
  items: ItemInterface[]
  createItemData: CreateItemInterface[]
  loading: boolean
  error: string | null
}
const initialState: ItemDataInterface = {
  items: [],
  createItemData: [],
  loading: false,
  error: null,
}

export const createItems = createAsyncThunk<
  ItemInterface[],
  { itemList: CreateItemInterface[] },
  { rejectValue: string }
>("items/create", async ({ itemList }, thunkAPI) => {
  try {
    if (!Array.isArray(itemList) || itemList.length === 0) {
      return thunkAPI.rejectWithValue("No items to create")
    }

    // ensure each item has an order_id
    const missingOrder = itemList.find((it) => !it.order_id)
    if (missingOrder) {
      return thunkAPI.rejectWithValue("Missing order_id on one or more items")
    }

    // strip `dish` and send only API fields
    const payloadItems = itemList.map(
      ({ quantity, quantity_type, remark, status, order_id, dish_id }) => ({
        quantity,
        quantity_type,
        remark,
        status,
        order_id,
        dish_id,
      })
    )

    // Some backends expect a single item object per POST. Send items individually.
    if (payloadItems.length === 1) {
      const response = await fetch(`${VITE_API_URL}/items/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadItems[0]),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        const message =
          (errData && (errData.message || JSON.stringify(errData))) ||
          `HTTP ${response.status}`
        return thunkAPI.rejectWithValue(message)
      }

      const data = await response.json()
      return [data] as ItemInterface[]
    }

    const responses = await Promise.all(
      payloadItems.map((it) =>
        fetch(`${VITE_API_URL}/items/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(it),
        })
      )
    )

    for (const res of responses) {
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        const message =
          (errData && (errData.message || JSON.stringify(errData))) ||
          `HTTP ${res.status}`
        return thunkAPI.rejectWithValue(message)
      }
    }

    const datas = await Promise.all(responses.map((r) => r.json()))
    return datas as ItemInterface[]
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateItemStatus = createAsyncThunk<
  ItemInterface,
  { itemID: string; status: string },
  { rejectValue: string }
>("items/updateStatus", async ({ itemID, status }, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/items/${itemID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error("Failed to update status")
    }

    const data = await response.json()
    return data as ItemInterface
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const fetchItems = createAsyncThunk<
  ItemInterface[],
  void,
  { rejectValue: string }
>("items/fetch", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/ items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Backend error response:", errorData)
      throw new Error(JSON.stringify(errorData) || "Failed to create order")
    }
    const data = await response.json()
    return data as ItemInterface[]
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload

      //   check if item already exists
      const existingItem = state.createItemData.find(
        (entry) => entry.dish_id === newItem.dish_id
      )

      if (!existingItem) {
        //if no add the item
        state.createItemData.push({
          quantity: 1,
          quantity_type: newItem.quantity_type,
          remark: "",
          status: "pending",
          order_id: newItem.order_id,
          dish_id: newItem.dish_id,
          dish: newItem.dish,
        })
      } else {
        // if yes update the value
        existingItem.quantity += newItem.quantity
      }
    },

    addOptimisticItems: (state, action: PayloadAction<ItemInterface[]>) => {
      // prepend optimistic items so UI shows them immediately
      state.items = [...action.payload, ...state.items]
    },

    removeItem: (state, action) => {
      const removeItem = action.payload

      // check if item exist
      const existingItem = state.createItemData.find(
        (item) => item.dish_id === removeItem.dish_id
      )

      if (!existingItem) return
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1
      } else if (existingItem.quantity === 1) {
        const index = state.createItemData.findIndex(
          (item) => item.dish_id === existingItem.dish_id
        )
        // If found, remove it using splice
        if (index !== -1) {
          state.createItemData.splice(index, 1)
        }
      }
    },

    updateOptimisticItemStatus: (
      state,
      action: PayloadAction<{
        item: ItemInterface
        status: ItemStatusType
      }>
    ) => {
      const { item, status } = action.payload
      state.items = state.items.map((it) =>
        it.id === item.id ? { ...it, status } : it
      )
    },

    clearItems: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createItems.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        const serverItems = action.payload || []
        // merge server-confirmed items into current list, replacing optimistic ones
        const merged = [...state.items]
        for (const s of serverItems) {
          const byId = merged.findIndex((it) => it.id === s.id)
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
        state.items = merged
      })
      .addCase(createItems.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(updateItemStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        state.loading = false
        // merge server-confirmed item into items list
        const updated = action.payload
        state.items = state.items.map((it) =>
          it.id === updated.id ? updated : it
        )
        // if item wasn't previously in the list, append it
        if (!state.items.find((it) => it.id === updated.id)) {
          state.items.push(updated)
        }
        state.error = null
      })
      .addCase(updateItemStatus.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const payload = action.payload
        state.loading = false
        state.items = payload
        state.error = null
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export const {
  addItem,
  addOptimisticItems,
  removeItem,
  clearItems,
  updateOptimisticItemStatus,
} = itemSlice.actions
export default itemSlice.reducer
