import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { selectTable, type TableDataInterface } from "@/redux/table/tableSlice"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectOrderTable({ tables }: { tables: TableDataInterface[] }) {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedTable } = useSelector((state: RootState) => state.table)
  const [selectedSection, setSelectedSection] = useState<string | null>(
    selectedTable.sectionId ?? null
  )
  const [selectedTableId, setSelectedTableId] = useState<string | null>(
    selectedTable?.section && selectedTable.number
      ? `${selectedTable.section}-${selectedTable.number}`
      : null
  )

  // Group tables by section
  const sections = useMemo(() => {
    const grouped = new Map<string, typeof tables>()
    tables.forEach((table) => {
      if (!grouped.has(table.section.name)) {
        grouped.set(table.section.name, [])
      }
      grouped.get(table.section.name)!.push(table)
    })
    return Array.from(grouped.entries())
  }, [tables])

  // Get tables for selected section
  const tablesInSection = useMemo(() => {
    if (!selectedSection) return []
    return tables.filter((t) => t.section.name === selectedSection)
  }, [selectedSection, tables])

  const handleTableChange = (tableId: string) => {
    setSelectedTableId(tableId)

    const nextSelectedTable = tables.find(
      (table) => `${table.section}-${table.number}` === tableId
    )

    if (!nextSelectedTable || !selectedSection) return

    dispatch(
      selectTable({
        ...nextSelectedTable,
      })
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Section Selector */}
      <Select value={selectedSection || ""} onValueChange={setSelectedSection}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select section" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sections</SelectLabel>
            {sections.length > 0 ? (
              sections.map(([section]) => (
                <SelectItem key={section} value={section}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">
                No sections available
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Table Selector (disabled if no section selected) */}
      <Select
        value={selectedTableId || ""}
        onValueChange={handleTableChange}
        disabled={!selectedSection}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select table" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tables</SelectLabel>
            {tablesInSection.length > 0 ? (
              tablesInSection.map((table) => (
                <SelectItem
                  key={`${table.section}-${table.number}`}
                  value={`${table.section}-${table.number}`}
                >
                  Table {table.number} ({table.capacity} seats, {table.state})
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">
                No tables available
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
