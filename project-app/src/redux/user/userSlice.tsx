import { VITE_API_URL } from "@/constants/url"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export type RoleDBType = "chef" | "waiter" | "receptionist" | null

interface UserDataInterface {
  firstName: string
  middleName: string
  lastName: string
  isAdmin: boolean
  phone: string
  role: RoleDBType
  userId: string
  createdAt: string
  updatedAt: string
}

interface UserDBInterface {
  first_name: string
  middle_name: string
  last_name: string
  contact_number: string
  is_admin: boolean
  role: RoleDBType
  id: string
  created_at: string
  updated_at: string
}

interface UserFetchInterface {
  currentUser: UserDataInterface | null
  loading: boolean
  error: string | null
}

interface LoginResponseInterface {
  access_token: string
  token_type?: string
}

const initialState: UserFetchInterface = {
  currentUser: null,
  error: null,
  loading: false,
}

function mapUserDbToUserData(payload: UserDBInterface): UserDataInterface {
  return {
    firstName: payload.first_name,
    middleName: payload.middle_name,
    lastName: payload.last_name,
    isAdmin: payload.is_admin,
    phone: payload.contact_number,
    role: payload.role,
    userId: payload.id,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  }
}

export const login = createAsyncThunk<
  LoginResponseInterface,
  { username: string; password: string },
  { rejectValue: string }
>("login/users", async (credentials, thunkAPI) => {
  try {
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)
    formData.append("scope", "")

    const response = await fetch(`${VITE_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`

      try {
        const errorData = (await response.json()) as {
          detail?: string | { msg?: string }
        }

        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail
        } else if (typeof errorData.detail?.msg === "string") {
          errorMessage = errorData.detail.msg
        }
      } catch {
        const text = await response.text().catch(() => response.statusText)
        if (text) {
          errorMessage = text
        }
      }

      return thunkAPI.rejectWithValue(errorMessage)
    }

    const data = (await response.json()) as LoginResponseInterface
    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

export const fetchCurrentUser = createAsyncThunk<
  UserDataInterface,
  void,
  { rejectValue: string }
>("users/me", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("access_token")

    if (!token) {
      return thunkAPI.rejectWithValue("Missing access token")
    }

    const response = await fetch(`${VITE_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      return thunkAPI.rejectWithValue(
        text || `HTTP error! status: ${response.status}`
      )
    }
    const data = (await response.json()) as UserDBInterface
    return mapUserDbToUserData(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return thunkAPI.rejectWithValue(message)
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      if (!state.currentUser) return
      state.currentUser.role = action.payload
    },
    logout: () => {
      localStorage.removeItem("access_token")
      return initialState
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        localStorage.setItem("access_token", action.payload.access_token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || action.error?.message || "Login failed"
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.currentUser = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        localStorage.removeItem("access_token")
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          "Failed to fetch user"
      })
  },
})

export const { logout, setRole } = userSlice.actions

export default userSlice.reducer
