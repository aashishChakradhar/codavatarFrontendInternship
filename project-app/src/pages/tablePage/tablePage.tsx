import TableContainer from "@/components/table"
import useLoadTable from "@/hooks/use-loadTable"

export default function TablePage() {
  useLoadTable()
  return (
    <>
      <TableContainer />
    </>
  )
}
