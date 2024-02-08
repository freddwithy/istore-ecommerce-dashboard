"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type OrdersColumn = {
    id: string,
    desc: string,
    montoTotal:  string,
    cancelado: boolean,
    pagado: boolean,
    formaPago:  string,
    fechaPago:  string,
    producto: string,
    comprador: string,
    isDeleted: boolean,
}
export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "desc",
    header: "Descripcion",
  },
  {
    accessorKey: "comprador",
    header: "Comprador",
  },
  {
    accessorKey: "producto",
    header: "Producto",
  },
  {
    accessorKey: "montoTotal",
    header: "Monto Total",
  },
  {
    accessorKey: "pagado",
    header: "Pagado",
  },
  {
    accessorKey: "fechaPago",
    header: "Fecha de Pago",
  },
  {
    accessorKey: "formaPago",
    header: "Forma de Pago",
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
