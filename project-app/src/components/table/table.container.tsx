import { type AppDispatch, type RootState } from "@/redux/store"
import { fetchTable } from "@/redux/table/tableSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { TableDataProp } from "@/data/table"
import TableComponent from "@/components/table/table.component"

export interface TableComponentProps {
  tableData: Record<string, TableDataProp[]>
}

function groupTablesBySection(
  tables: TableDataProp[]
): Record<string, TableDataProp[]> {
  return tables.reduce(
    (acc, table) => {
      const section = table.section
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(table)
      return acc
    },
    {} as Record<string, TableDataProp[]>
  )
}

// export function DrawerWithSides() {
function TableContainer() {
  const dispatch = useDispatch<AppDispatch>()
  const { tables, status } = useSelector((state: RootState) => state.table)

  useEffect(() => {
    if (status === "idle") dispatch(fetchTable())
  }, [dispatch, status])

  // Get grouped tables
  const groupedTables = groupTablesBySection(tables)

  if (status === "pending") {
    return <div className="text-sm">Loading tables...</div>
  }

  if (status === "failed") {
    return <div className="text-sm text-red-500">Error loading tables</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <TableComponent tableData={groupedTables} />
    </div>
  )
}

export default TableContainer
