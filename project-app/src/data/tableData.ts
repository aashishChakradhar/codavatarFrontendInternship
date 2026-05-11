import type { TableStateType } from "@/constants/constants"

export interface TableDataProp {
  section: string
  number: number
  capacity: number
  state: TableStateType
}

interface TablesType {
  tables: TableDataProp[]
}

export const tableData: TablesType = {
  tables: [
    {
      section: "rooftop",
      number: 1,
      capacity: 4,
      state: "empty",
    },
    {
      section: "rooftop",
      number: 2,
      capacity: 4,
      state: "cleaning",
    },
    {
      section: "rooftop",
      number: 3,
      capacity: 6,
      state: "empty",
    },
    {
      section: "rooftop",
      number: 4,
      capacity: 4,
      state: "occupied",
    },
    {
      section: "rooftop",
      number: 5,
      capacity: 8,
      state: "empty",
    },
    {
      section: "garden",
      number: 1,
      capacity: 4,
      state: "cleaning",
    },
    {
      section: "garden",
      number: 2,
      capacity: 4,
      state: "empty",
    },
    {
      section: "garden",
      number: 3,
      capacity: 6,
      state: "occupied",
    },
    {
      section: "garden",
      number: 4,
      capacity: 4,
      state: "cleaning",
    },
    {
      section: "garden",
      number: 5,
      capacity: 8,
      state: "empty",
    },
  ],
}
