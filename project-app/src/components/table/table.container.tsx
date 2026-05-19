import { type RootState } from "@/redux/store"
import type { TableDataInterface } from "@/redux/table/tableSlice"
import { useSelector } from "react-redux"
import TableComponent from "@/components/table/table.component"

export interface TableComponentProps {
  tableData: Record<string, TableDataInterface[]>
}

function groupTablesBySection(
  tables: TableDataInterface[]
): Record<string, TableDataInterface[]> {
  const grouped = tables.reduce(
    (acc, table) => {
      const section = table.section.name
      if (!acc[section]) acc[section] = []
      acc[section].push(table)
      return acc
    },
    {} as Record<string, TableDataInterface[]>
  )

  // Sort section keys alphabetically and sort tables inside each section by number
  const sorted = Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc, key) => {
        acc[key] = grouped[key].slice().sort((t1, t2) => {
          const n1 = Number(t1.number) || 0
          const n2 = Number(t2.number) || 0
          return n1 - n2
        })
        return acc
      },
      {} as Record<string, TableDataInterface[]>
    )

  return sorted
}

function TableContainer() {
  const { tables } = useSelector((state: RootState) => state.table)

  // Get grouped tables
  const groupedTables = groupTablesBySection(tables)

  return (
    <div className="flex flex-col gap-4">
      <TableComponent tableData={groupedTables} />
    </div>
  )
}

export default TableContainer
