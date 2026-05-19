import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { orderStateColor } from "@/constants/constants"
import { type OrderInterface } from "@/redux/order/orderSlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useUpdateItem from "@/hooks/use-updateItem"
import { useState } from "react"
import { ConfirmAlert } from "../../alert/confirmAlert"
import {
  itemStatus,
  updateOptimisticItemStatus,
  type ItemInterface,
  type ItemStatusType,
} from "@/redux/items/itemsSlice"
import type { AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux"
import { SortSelect, type SortByType } from "./sortSelect"

export function ViewOrderComponent({
  orders,
  disabledStatus,
  inactiveStatus,
}: {
  orders?: OrderInterface[]
  disabledStatus: ItemStatusType[]
  inactiveStatus: ItemStatusType[]
}) {
  const dispatch = useDispatch<AppDispatch>()
  const { updateItem } = useUpdateItem()

  const [pendingUpdate, setPendingUpdate] = useState<{
    item: ItemInterface
    status: ItemStatusType
  } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

  const handleStatusSelect = (item: ItemInterface, status: ItemStatusType) => {
    console.log(`item:${item.dish.name} status:${status}`)
    setPendingUpdate({ item, status })
    setConfirmOpen(true)
  }

  const handleConfirmChange = () => {
    if (pendingUpdate) {
      //backend
      updateItem(pendingUpdate.item, pendingUpdate.status)

      // ui
      dispatch(
        updateOptimisticItemStatus({
          item: pendingUpdate.item,
          status: pendingUpdate.status,
        })
      )
      setConfirmOpen(false)
      setPendingUpdate(null)
    }
  }

  // Base flattened rows (order + item)
  const baseRows: { order: OrderInterface; item: ItemInterface }[] = (
    orders ?? []
  ).flatMap((order) => (order?.items ?? []).map((item) => ({ order, item })))

  // Sorting state
  const [sortBy, setSortBy] = useState<SortByType>("status")
  const [sortDesc, setSortDesc] = useState<boolean>(true)

  function getRowsAscending(by: SortByType) {
    return baseRows.slice().sort((a, b) => {
      if (by === "status") {
        const idxA = itemStatus.indexOf(a.item.status)
        const idxB = itemStatus.indexOf(b.item.status)
        return idxA - idxB
      }

      if (by === "location") {
        const secA = a.order.table?.section?.name ?? ""
        const secB = b.order.table?.section?.name ?? ""
        const cmp = secA.localeCompare(secB)
        if (cmp !== 0) return cmp
        const numA = Number(a.order.table?.number) || 0
        const numB = Number(b.order.table?.number) || 0
        return numA - numB
      }

      // dishname
      const nameA = a.item.dish?.name ?? ""
      const nameB = b.item.dish?.name ?? ""
      return nameA.localeCompare(nameB)
    })
  }

  function getRowsDescending(by: SortByType) {
    return getRowsAscending(by).slice().reverse()
  }

  const rows = sortDesc ? getRowsDescending(sortBy) : getRowsAscending(sortBy)

  return (
    <>
      <ConfirmAlert
        alertTitle="Change Status?"
        alertMessage={`Are you sure you want to update status to "${pendingUpdate?.status}"?`}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmChange}
      />

      {/* Sort controls */}
      <SortSelect
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
      />

      <Table className="mx-auto justify-center text-center md:w-9/10 lg:w-7/10">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">S.N</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-center">Location</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ order, item }, rowIndex) => (
            <TableRow
              key={`${order.table?.number ?? "x"}-${item.id}-${rowIndex}`}
            >
              <TableCell className="font-medium">{rowIndex + 1}</TableCell>
              <TableCell>{item.dish?.name ?? ""}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {`${order.table?.section?.name} - ${order.table?.number}`}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={orderStateColor(item.status)}
                      disabled={inactiveStatus.includes(item.status)}
                    >
                      {item.status}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {itemStatus.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusSelect(item, status)}
                        disabled={disabledStatus.includes(status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
