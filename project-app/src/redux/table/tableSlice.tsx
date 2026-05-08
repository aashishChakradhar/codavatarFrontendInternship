import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { TableDataProp } from "@/data/table"
import type { statusProp } from "../constants/constants"

interface TablesType {
  tables: TableDataProp[]
}
export interface TableSliceProp {
  tables: TableDataProp[]
  selectedTable: TableDataProp
  status: statusProp
  error: string | null
}

const initialState: TableSliceProp = {
  tables: [],
  selectedTable: {
    section: "unknown",
    number: 0,
    capacity: 0,
    state: "empty",
  },
  status: "idle",
  error: null,
}

// Load the local table data asynchronously using dynamic import
export const fetchTable = createAsyncThunk<TablesType["tables"][number][]>(
  "table/fetchTable",
  async (_, thunkAPI) => {
    try {
      const mod = await import("@/data/table")
      // tableData is { tables: [...] }, so return the inner array
      return mod.tableData.tables
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load table data")
    }
  }
)

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    //payload section number capacity status
    occupyTable: (state, action: PayloadAction<TableDataProp>) => {
      state.tables = state.tables.map((table) =>
        table.section === action.payload.section &&
        table.number === action.payload.number
          ? { ...table, state: "occupied" }
          : table
      )
    },
    reserveTable: (state, action: PayloadAction<TableDataProp>) => {
      state.tables = state.tables.map((table) =>
        table.section === action.payload.section &&
        table.number === action.payload.number
          ? { ...table, state: "reserved" }
          : table
      )
    },
    cleanTable: (state, action: PayloadAction<TableDataProp>) => {
      state.tables = state.tables.map((table) =>
        table.section === action.payload.section &&
        table.number === action.payload.number
          ? { ...table, state: "cleaning" }
          : table
      )
    },
    emptyTable: (state, action: PayloadAction<TableDataProp>) => {
      state.tables = state.tables.map((table) =>
        table.section === action.payload.section &&
        table.number === action.payload.number
          ? { ...table, state: "empty" }
          : table
      )
    },
    selectTable: (state, action: PayloadAction<TableDataProp>) => {
      state.selectedTable = action.payload
    },
    resetTableData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.status = "pending"
        state.error = null
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tables = action.payload
      })
      .addCase(fetchTable.rejected, (state, action) => {
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
  emptyTable,
  resetTableData,
  selectTable,
} = tableSlice.actions
export default tableSlice.reducer
