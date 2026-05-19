import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TableStateType } from "@/constants/constants"
import type { AppDispatch } from "@/redux/store"
import {
  selectTable,
  type TableDataInterface,
  updateOptimisticTableStatus,
  updateTableStatus,
} from "@/redux/table/tableSlice"
import {} from "react"
import { useDispatch } from "react-redux"

const buttonClass = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-400"
    case "occupied":
      return "bg-red-400"
    case "cleaning":
      return "bg-yellow-400"
    case "reserved":
      return "bg-blue-400"
    default:
      return "bg-gray-400"
  }
}

export function TableDrop({ table }: { table: TableDataInterface }) {
  const dispatch = useDispatch<AppDispatch>()
  const handleClick = async (table: TableDataInterface, action: string) => {
    console.log(`section:${table.section.name}- table:${table.number}`)
    const map: Record<string, TableStateType> = {
      occupied: "occupied",
      cleaning: "cleaning",
      reserved: "reserved",
      available: "available",
    }
    const newStatus = map[action]
    if (!newStatus) return

    // optimistic update
    dispatch(
      updateOptimisticTableStatus({
        table,
        status: newStatus,
      })
    )
    dispatch(selectTable({ ...table, status: newStatus }))

    // persist
    const res = await dispatch(
      updateTableStatus({ id: table.id, status: newStatus })
    )
    if (updateTableStatus.rejected.match(res)) {
      console.error("Failed to persist status:", res)
    }
  }

  return (
    <DropdownMenu>
      <div className={``}>
        <DropdownMenuTrigger
          className={`flex h-22 w-24 items-center justify-center rounded-none border`}
          asChild
        >
          <Button
            className={`${buttonClass(table.status)} flex flex-col rounded-sm`}
          >
            <span>Table-{table.number}</span>
            <span>{table.status.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Set Table</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => handleClick(table, "available")}>
            Available
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleClick(table, "occupied")}>
            Occupy
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleClick(table, "reserved")}>
            Reserved
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleClick(table, "cleaning")}>
            Cleaning
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
