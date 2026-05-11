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

export function orderStateColor(state: OrderStateType) {
  switch (state) {
    case "pending":
      return `bg-gray-700 `
    case "preparing":
      return `bg-blue-400 `
    case "completed":
      return `bg-yellow-400 `
    case "delivered":
      return `bg-green-400 `
    case "cancelled":
      return `bg-red-400 `
  }
}
