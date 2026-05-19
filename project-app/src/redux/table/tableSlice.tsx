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
  section: SectionDataInterface
  status: TableStateType
}

export interface TableSliceInterface {
  tables: TableDataInterface[]
  selectedTable: TableDataInterface
  loading: boolean
  error: string | null
}

// Load tables from backend
export const fetchTable = createAsyncThunk<
  TableDataInterface[],
  void,
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
    const data = (await response.json()) as TableDataInterface[]
    // Normalize incoming data
    return data.map((table) => ({
      ...table,
      status: table.status ?? (table as any).state ?? "empty",
      section:
        typeof (table as any).section === "string"
          ? { id: (table as any).section, name: (table as any).section }
          : (table as any).section,
    }))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateTableStatus = createAsyncThunk<
  TableDataInterface,
  { id: string; status: TableStateType },
  AsyncThunkConfig
>("table/updateTableStatus", async ({ id, status }, thunkAPI) => {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) {
      return thunkAPI.rejectWithValue("Missing access token")
    }

    const url = `${VITE_API_URL}/tables/${id}`
    // debug: log the outgoing request URL and payload
    // remove or lower verbosity in production
    // eslint-disable-next-line no-console
    console.debug("updateTableStatus: PATCH", url, { status })

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      // eslint-disable-next-line no-console
      console.error(
        "updateTableStatus: server returned non-OK",
        response.status,
        text
      )
      return thunkAPI.rejectWithValue(`HTTP ${response.status}: ${text}`)
    }

    const data = await response.json()

    // Normalize server response: ensure `status` exists and `section` is an object
    const normalized = {
      ...data,
      status:
        (data && (data as any).status) ??
        (data && (data as any).state) ??
        status,
      section:
        data && typeof (data as any).section === "string"
          ? { id: (data as any).section, name: (data as any).section }
          : (data as any).section,
    }

    return normalized as TableDataInterface
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("updateTableStatus: fetch error", err)
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message || "Network error")
  }
})

const initialState: TableSliceInterface = {
  tables: [],
  selectedTable: {
    id: "",
    section: {
      id: "",
      name: "unknown",
    },
    number: 0,
    capacity: 0,
    status: "empty",
  },
  loading: false,
  error: null,
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updateOptimisticTableStatus: (
      state,
      action: PayloadAction<{
        table: TableDataInterface
        status: TableStateType
      }>
    ) => {
      const payload = action.payload
      state.tables = state.tables.map((t) => {
        // Prefer matching by unique `id` when available (coerce to string)
        if (t.id !== undefined && payload.table.id !== undefined) {
          return String(t.id) === String(payload.table.id)
            ? { ...t, status: payload.status }
            : t
        }

        // Fallback to matching by section id + number (coerce to string)
        const tSectionId = (t.section as any)?.id
        const pSectionId = (payload.table.section as any)?.id
        if (tSectionId !== undefined && pSectionId !== undefined) {
          return String(tSectionId) === String(pSectionId) &&
            t.number === payload.table.number
            ? { ...t, status: payload.status }
            : t
        }

        // Final fallback: match by section name + number
        const tSectionName = (t.section as any).name ?? (t.section as any)
        const pSectionName =
          (payload.table.section as any).name ?? (payload.table.section as any)
        return String(tSectionName) === String(pSectionName) &&
          t.number === payload.table.number
          ? { ...t, status: payload.status }
          : t
      })
    },
    selectTable: (state, action: PayloadAction<TableDataInterface>) => {
      state.selectedTable = action.payload
    },
    clearTable: (state) => {
      state.selectedTable = {
        id: "",
        section: {
          id: "",
          name: "unknown",
        },
        number: 0,
        capacity: 0,
        status: "empty",
      }
    },
    resetTableData: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.loading = false
        state.tables = action.payload
      })
      .addCase(fetchTable.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown error"
      })

      .addCase(updateTableStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || "Unknown Error"
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        const updated = action.payload
        state.tables = state.tables.map((t) =>
          String(t.id) === String(updated.id) ? { ...t, ...updated } : t
        )
        if (String(state.selectedTable.id) === String(updated.id)) {
          state.selectedTable = { ...state.selectedTable, ...updated }
        }
      })
  },
})

export const {
  updateOptimisticTableStatus,
  resetTableData,
  selectTable,
  clearTable,
} = tableSlice.actions
export default tableSlice.reducer
