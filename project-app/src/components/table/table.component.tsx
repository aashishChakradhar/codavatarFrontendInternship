import type { TableDataInterface } from "@/redux/table/tableSlice"
import { type TableComponentProps } from "./table.container"
import { TableDrop } from "./tableDrop"

function TableComponent(props: TableComponentProps) {
  const { tableData } = props

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(tableData).map(([section, sectionTables], index) => (
        <div key={`${section}-${index}`}>
          <h2 className="text-lg font-bold capitalize">{section}</h2>
          <div className="m-auto flex flex-wrap gap-3">
            {sectionTables.map((table: TableDataInterface) => (
              <div key={table.id}>
                <TableDrop table={table} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TableComponent
