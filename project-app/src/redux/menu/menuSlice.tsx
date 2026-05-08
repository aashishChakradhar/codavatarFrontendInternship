import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { MenuType as MenuItemType } from "@/data/menuData"

interface MenuState {
  menus: MenuItemType[]
  status: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
}

const initialState: MenuState = {
  menus: [],
  status: "idle",
  error: null,
}

// Load the local menu data asynchronously using dynamic import
export const fetchMenu = createAsyncThunk<MenuItemType[]>(
  "menu/fetchMenu",
  async (_, thunkAPI) => {
    try {
      const mod = await import("@/data/menuData")
      // module exports `menuData`
      return mod.menuData as MenuItemType[]
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load menu data")
    }
  }
)

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.menus = action.payload
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export default menuSlice.reducer
