import { type TableComponentProps } from "./table.container"
import { type TableDataProp } from "@/data/table"
import { TableDrop } from "./tableDrop"

// export function DrawerWithSides() {
function TableComponent(props: TableComponentProps) {
  const { tableData } = props

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(tableData).map(([section, sectionTables]) => (
        <div key={section}>
          <h2 className="text-lg font-bold capitalize">{section}</h2>
          <div className="m-auto flex flex-wrap gap-3">
            {sectionTables.map((table: TableDataProp) => (
              <div key={table.number}>
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
