"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { OrdersColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface OrderClientProps {
    data: OrdersColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Ordenes (${data.length})`}
                    description="Maneja los pedidos."
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Agregar nuevo
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title="API" description="Llamadas API para los pedidos."/>
            <Separator />
            <ApiList entityName="orders" entityIdName="OrdersId"/>
        </>
    )
}