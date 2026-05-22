import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { itemStateColor } from "@/constants/constants"

import {
  itemStatus,
  type ItemInterface,
  type ItemStatusType,
} from "@/redux/items/itemsSlice"

type ItemRowProps = {
  item: ItemInterface
  hiddenItemStatus: string[]
  onStatusChange: (payload: {
    item: ItemInterface
    statusUpdate: ItemStatusType
  }) => void
}

export function ItemRow({
  item,
  hiddenItemStatus,
  onStatusChange,
}: ItemRowProps) {
  const handleClick = (stat: ItemStatusType) => {
    onStatusChange({ item, statusUpdate: stat })
  }

  return (
    <div
      key={item.id}
      className="mb-3 flex items-center justify-between text-sm"
    >
      <span>{item.dish.name}</span>
      <span className="">x{item.quantity}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={itemStateColor(item.status)} size="sm">
            {item.status}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Item Status</DropdownMenuLabel>
            {itemStatus.map((stat, index) => (
              <DropdownMenuItem
                key={`${stat}-${index}`}
                onClick={() => handleClick(stat)}
                hidden={hiddenItemStatus?.includes(stat)}
              >
                {stat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
