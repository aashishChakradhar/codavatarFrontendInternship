import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TableDataInterface } from "@/data/tableData"
import type { AppDispatch } from "@/redux/store"
import {
  selectTable,
  cleanTable,
  emptyTable,
  occupyTable,
  reserveTable,
} from "@/redux/table/tableSlice"
import { useDispatch } from "react-redux"

const buttonClass = (status: string) => {
  switch (status) {
    case "empty":
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
  const handleClick = (table: TableDataInterface, action: string) => {
    console.log(`${table.section} ${table.number}`)
    switch (action) {
      case "occupy":
        dispatch(occupyTable(table))
        dispatch(
          selectTable({
            ...table,
            state: "occupied",
          })
        )
        break
      case "cleaning":
        dispatch(cleanTable(table))
        break
      case "reserved":
        dispatch(reserveTable(table))
        break
      case "empty":
        dispatch(emptyTable(table))
        break

      default:
        break
    }
  }
  return (
    <DropdownMenu>
      <div className={`${buttonClass(table.state)}`}>
        <DropdownMenuTrigger
          className={`flex h-20 w-20 items-center justify-center rounded-none border`}
          asChild
        >
          <Button variant="outline">Table-{table.number}</Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Set Table</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => handleClick(table, "empty")}>
            Empty
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleClick(table, "occupy")}>
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
