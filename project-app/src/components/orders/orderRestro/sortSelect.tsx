import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SortByType = "status" | "location" | "dishname"

export function SortSelect({
  sortBy,
  setSortBy,
  sortDesc,
  setSortDesc,
}: {
  sortBy: SortByType
  setSortBy: (v: SortByType) => void
  sortDesc: boolean
  setSortDesc: (b: boolean) => void
}) {
  return (
    <div className="ml-auto flex flex-1 gap-5">
      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortByType)}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            <SelectItem value="dishname">Dish</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={sortDesc ? "desc" : "asc"}
        onValueChange={(v) => setSortDesc(v === "desc")}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order</SelectLabel>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
