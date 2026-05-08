export const orderState = [
  "pending",
  "preparing",
  "completed",
  "delivered",
  "cancelled",
] as const
export type OrderStateProp = (typeof orderState)[number]

export const status = ["idle", "pending", "succeeded", "failed"] as const
export type statusProp = (typeof status)[number]
