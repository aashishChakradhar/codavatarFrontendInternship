import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AppDispatch } from "@/redux/store"
import {
  selectTable,
  cleanTable,
  availableTable,
  occupyTable,
  reserveTable,
  type TableDataInterface,
} from "@/redux/table/tableSlice"
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
  const handleClick = (table: TableDataInterface, action: string) => {
    console.log(`${table.sectionId} ${table.number}`)
    switch (action) {
      case "occupied":
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
      case "available":
        dispatch(availableTable(table))
        break

      default:
        break
    }
  }
  return (
    <DropdownMenu>
      <div className={``}>
        <DropdownMenuTrigger
          className={`flex h-20 w-20 items-center justify-center rounded-none border`}
          asChild
        >
          <Button variant="outline" className={`${buttonClass(table.state)} `}>
            Table-{table.number}
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
