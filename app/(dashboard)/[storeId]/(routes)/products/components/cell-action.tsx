"use client"

import React, { useState } from "react"
import { ProductColumn } from "./columns"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps {
    data: ProductColumn
}


export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter()
    const params = useParams()

    const [ loading, setLoading ] = useState(false)
    const [ open, setOpen ] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('API del producto copiado.')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${data.id}`)
            router.refresh()
            toast.success('Producto eliminado.')
        } catch {
            toast.error('Ups! Algo salió mal.')
        } finally  {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <div>
            <AlertModal 
                isOpen={open} 
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Abrir Menu</span>
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Opciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 size-4" />
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
                        <Edit className="mr-2 size-4" />
                        Actualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 size-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
           </DropdownMenu>
        </div>
    )
}