import type { ToastStatusType } from "@/components/toast/toast"
import { createSlice } from "@reduxjs/toolkit"

interface ToastInterface {
  toastStatus: ToastStatusType
  toastMessage: string
  toastId: string
}

const initialState: ToastInterface = {
  toastStatus: null,
  toastMessage: "unknown",
  toastId: "taost-table",
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    activateToast: (state, action) => {
      const payload = action.payload
      state.toastId = payload.toastId
      state.toastStatus = payload.status
      state.toastMessage = payload.message
    },
    deactivateToast: () => initialState,
  },
})

export const { activateToast, deactivateToast } = toastSlice.actions
export default toastSlice.reducer
