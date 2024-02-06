"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "size",
    header: "Tamaño",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="rounded-full size-6" style={{ backgroundColor: row.original.color }}/>
      </div>
    }
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
