import { useState, useMemo, useEffect } from "react"
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
import useLoadTable from "@/hooks/use-loadTable"

export function SelectOrderTable({ tables }: { tables: TableDataInterface[] }) {
  useLoadTable()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedTable } = useSelector((state: RootState) => state.table)
  const [selectedSection, setSelectedSection] = useState<string | null>(
    selectedTable.section.name ?? null
  )
  const [selectedTableId, setSelectedTableId] = useState<string | null>(
    selectedTable?.section?.id && selectedTable.number
      ? `${selectedTable.section.id}-${selectedTable.number}`
      : null
  )

  // Keep local select state in sync when selectedTable in Redux changes
  useEffect(() => {
    setSelectedSection(selectedTable.section.name ?? null)
    setSelectedTableId(
      selectedTable?.section?.id && selectedTable.number
        ? `${selectedTable.section.id}-${selectedTable.number}`
        : null
    )
  }, [selectedTable])

  console.log(`selected: ${selectedTable.number}-${selectedTable.section.name}`)

  // Group tables by section and sort sections/tables ascending
  const sections = useMemo(() => {
    const grouped = new Map<string, typeof tables>()
    tables.forEach((table) => {
      if (!grouped.has(table.section.name)) {
        grouped.set(table.section.name, [])
      }
      grouped.get(table.section.name)!.push(table)
    })

    // Sort tables inside each section numerically ascending
    for (const [, arr] of grouped) {
      arr.sort((t1, t2) => (Number(t1.number) || 0) - (Number(t2.number) || 0))
    }

    // Return sections sorted by section name ascending
    return Array.from(grouped.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    )
  }, [tables])

  // Get tables for selected section (sorted ascending)
  const tablesInSection = useMemo(() => {
    if (!selectedSection) return []
    return tables
      .filter((t) => t.section.name === selectedSection)
      .slice()
      .sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  }, [selectedSection, tables])

  const handleTableChange = (tableId: string) => {
    setSelectedTableId(tableId)

    const nextSelectedTable = tables.find(
      (table) => `${table.section.id}-${table.number}` === tableId
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
                  key={`${table.section.id}-${table.number}`}
                  value={`${table.section.id}-${table.number}`}
                >
                  Table {table.number} ({table.capacity} seats, {table.status})
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
