import { type RootState } from "@/redux/store"
import { type TableDataInterface } from "@/redux/table/tableSlice"

import { useSelector } from "react-redux"
import TableComponent from "@/components/table/table.component"

export interface TableComponentProps {
  tableData: Record<string, TableDataInterface[]>
}

function groupTablesBySection(
  tables: TableDataInterface[]
): Record<string, TableDataInterface[]> {
  return tables.reduce(
    (acc, table) => {
      const section = table.section.name
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(table)
      return acc
    },
    {} as Record<string, TableDataInterface[]>
  )
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
