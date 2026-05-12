import type { RoleDBType } from "@/redux/user/userSlice"

export function changeRole(role: RoleDBType) {
  switch (role) {
    case "waiter":
      return "restro"
    case "chef":
      return "kitchen"
    case "receptionist":
      return "reception"
    default:
      return "restro"
  }
}
