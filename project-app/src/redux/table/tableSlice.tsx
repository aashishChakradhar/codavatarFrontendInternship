import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type AsyncThunkConfig,
} from "@reduxjs/toolkit"

import type { TableStateType } from "../../constants/constants"
import { VITE_API_URL } from "@/constants/url"

interface SectionDataInterface {
  id: string
  name: string
}

export interface TableDataInterface {
  id: string
  number: number
  capacity: number
  sectionId: string
  section: SectionDataInterface
  state: TableStateType
}

export interface TableDBInterface {
  id: string
  number: number
  capacity: number
  section_id: string
  section: SectionDataInterface
  status: TableStateType
}

export interface TableSliceInterface {
  tables: TableDataInterface[]
  selectedTable: TableDataInterface
  status: "idle" | "pending" | "succeeded" | "failed"
  loading: boolean
  error: string | null
}

const initialState: TableSliceInterface = {
  tables: [],
  selectedTable: {
    id: "",
    sectionId: "",
    section: {
      id: "",
      name: "unknown",
    },
    number: 0,
    capacity: 0,
    state: "empty",
  },
  status: "idle",
  loading: false,
  error: null,
}

// Load the local table data asynchronously using dynamic import
export const fetchTable = createAsyncThunk<
  TableDataInterface[], // ReturnType (what resolves with)
  void, // Argument type
  AsyncThunkConfig
>("table/fetchTable", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${VITE_API_URL}/tables`, {
      method: "GET",
      headers: {},
    })
    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      return thunkAPI.rejectWithValue(
        text || `HTTP error! status: ${response.status}`
      )
    }
    const data = (await response.json()) as TableDBInterface[]
    // Transform TableDBInterface[] to TableDataInterface[]
    return data.map((table) => ({
      ...table,
      sectionId: table.section_id ?? "unknown",
      state: table.status ?? "empty",
    }))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    //payload section number capacity status
    occupyTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.tables = state.tables.map((table) =>
        table.sectionId === action.payload.sectionId &&
        table.number === action.payload.number
          ? { ...table, state: "occupied" }
          : table
      )
    },
    reserveTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.tables = state.tables.map((table) =>
        table.sectionId === action.payload.sectionId &&
        table.number === action.payload.number
          ? { ...table, state: "reserved" }
          : table
      )
    },
    cleanTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.tables = state.tables.map((table) =>
        table.sectionId === action.payload.sectionId &&
        table.number === action.payload.number
          ? { ...table, state: "cleaning" }
          : table
      )
    },
    availableTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.tables = state.tables.map((table) =>
        table.sectionId === action.payload.sectionId &&
        table.number === action.payload.number
          ? { ...table, state: "available" }
          : table
      )
    },
    selectTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.selectedTable = action.payload
    },
    resetTableData: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.loading = true
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.loading = false
        state.status = "succeeded"
        state.tables = action.payload
      })
      .addCase(fetchTable.rejected, (state, action) => {
        state.loading = false
        state.status = "failed"
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })
  },
})

export const {
  occupyTable,
  cleanTable,
  reserveTable,
  availableTable,
  resetTableData,
  selectTable,
} = tableSlice.actions
export default tableSlice.reducer
