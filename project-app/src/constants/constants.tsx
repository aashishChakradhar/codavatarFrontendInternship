export const orderState = [
  "pending",
  "preparing",
  "completed",
  "delivered",
  "cancelled",
] as const
export type OrderStateType = (typeof orderState)[number]

export const status = ["idle", "pending", "succeeded", "failed"] as const
export type StatusType = (typeof status)[number]

export const tableState = ["empty", "occupied", "cleaning", "reserved"]
export type TableStateType = (typeof tableState)[number]
