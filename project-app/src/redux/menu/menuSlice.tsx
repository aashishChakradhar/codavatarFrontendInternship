import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { VITE_API_URL } from "@/constants/url"

export interface MenuDataInterface {
  id: number
  name: string
  price: number
  description: string
  category: string
  dishType: string
}
export interface MenuDBInterface {
  id: number
  name: string
  price: number
  description: string
  category: string
  dish_type: string
}

interface MenuStateInterface {
  menus: MenuDataInterface[]
  status: "idle" | "pending" | "succeeded" | "failed"
  loading: boolean
  error: string | null
}

const initialState: MenuStateInterface = {
  menus: [],
  status: "idle",
  loading: false,
  error: null,
}

// Load the local menu data asynchronously using dynamic import
export const fetchMenu = createAsyncThunk<
  MenuDataInterface[],
  void,
  { rejectValue: string }
>("dishes/fetchMenu", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/dishes`, {
      method: "GET",
      headers: {},
    })
    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      return thunkAPI.rejectWithValue(
        text || `HTTP error! status: ${response.status}`
      )
    }
    const data = (await response.json()) as MenuDBInterface[]
    return data.map((dish) => ({
      ...dish,
      dishType: dish.dish_type ?? "unknown",
      // add any other missing required fields here
    }))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false
        state.status = "succeeded"
        state.menus = action.payload
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false
        state.status = "failed"
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export default menuSlice.reducer
