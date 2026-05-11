import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface UserSliceInterface {
  isAuthenticated: boolean
  isAdmin: boolean
  role: string
  name: string
  email: string
  avatar: string
}

const roles = ["kitchen", "restro", "reception"]

const initialState: UserSliceInterface = {
  isAuthenticated: true,
  isAdmin: false,
  role: roles[1],
  name: "initial",
  email: "myinitial@mail.com",
  avatar: "/avatars/shadcn.jpg",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true
      state.isAdmin = false
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload
    },

    user: (state) => {
      state.role = roles[1]
      state.name = "login"
      state.email = "myLogin@mail.com"
      state.avatar = "/avatars/shadcn.jpg"
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.role = "none"
      state.name = "null"
      state.email = "null"
      state.avatar = "null"
    },
  },
})

export const { login, logout, user, setRole } = userSlice.actions

export default userSlice.reducer
