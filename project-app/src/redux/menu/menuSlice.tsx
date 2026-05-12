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

interface MenuStateInterface {
  menus: MenuDataInterface[]
  loading: boolean
  error: string | null
}

const initialState: MenuStateInterface = {
  menus: [],
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
    const data = (await response.json()) as MenuDataInterface[]
    return data
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
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false
        state.menus = action.payload
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export default menuSlice.reducer
