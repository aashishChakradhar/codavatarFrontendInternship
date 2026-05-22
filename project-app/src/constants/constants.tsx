import type { ItemStatusType } from "@/redux/items/itemsSlice"

export const status = ["idle", "pending", "succeeded", "failed"] as const
export type StatusType = (typeof status)[number]

export const tableState = ["available", "occupied", "cleaning", "reserved"]
export type TableStateType = (typeof tableState)[number]

export function itemStateColor(state: ItemStatusType) {
  switch (state) {
    case "pending":
      return `bg-gray-700 `
    case "in_progress":
      return `bg-blue-700 `
    case "ready":
      return `bg-yellow-400 `
    case "delivered":
      return `bg-green-400 `
    case "cancelled":
      return `bg-red-400 `
  }
}
