"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  nombre: string
  precio: string
  size: string
  category: string
  color: string
  cantidad: number
  isFeatured: boolean
  isDeleted: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "size",
    header: "Tamaño",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "precio",
    header: "Precio",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "isDeleted",
    header: "Fuera de Stock",
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado",
  },
  {
    accessorKey: "cantidad",
    header: "En Stock",
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
