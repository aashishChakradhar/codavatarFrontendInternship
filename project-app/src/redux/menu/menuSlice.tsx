import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { VITE_API_URL } from "@/constants/url"
import fetchJson from "@/lib/fetchClient"
import { activateToast } from "@/redux/toast/toastSlice"

export interface DishDBInterface {
  id: string
  name: string
  price: number
  description: string
  category: string
  dish_type: string
}

interface DishStateInterface {
  menus: DishDBInterface[]
  loading: boolean
  error: string | null
}

const initialState: DishStateInterface = {
  menus: [],
  loading: false,
  error: null,
}

// Load the local menu data asynchronously using dynamic import
export const fetchMenu = createAsyncThunk<
  DishDBInterface[],
  void,
  { rejectValue: string }
>("dishes/fetchMenu", async (_, thunkAPI) => {
  try {
    const data = await fetchJson<DishDBInterface[]>(`${VITE_API_URL}/dishes`, {
      method: "GET",
      headers: {},
    })
    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    // show toast via thunk dispatch for visibility in UI
    try {
      thunkAPI.dispatch(
        activateToast({
          toastId: `menu-fetch-${Date.now()}`,
          status: "error",
          message,
        })
      )
    } catch (e) {
      // ignore
    }
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
