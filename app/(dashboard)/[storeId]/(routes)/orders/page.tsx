import { format } from 'date-fns'

import prismadb from "@/lib/prismadb"
import { OrderClient } from "./components/client"
import { OrdersColumn } from "./components/columns"
import { formatter } from '@/lib/utils'

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const orders = await prismadb.orden.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            compras_items: {
                include: {
                    product: true,
                    comprador: true
                }
            },
        }
    })

    const formattedBillboard: OrdersColumn[] = orders.map((item) => ({
        id: item.id,
        desc: item.descripcion_resumen,
        montoTotal: formatter.format(item.compras_items.reduce((total, item) => {
            return total + Number(item.product.precio_total)
        }, 0)),
        tipoPedido: item.tipo_pedido,
        cancelado: item.cancelado,
        pagado: item.pagado,
        formaPagoId: item.forma_pago_identificador,
        formaPago: item.forma_pago,
        fechaPago: item.fecha_pago,
        fechaMax: item.fecha_maxima_pago,
        idPedido: item.id_pedido_comercio,
        publicKey: item.public_key,
        token: item.token,
        hashPedido: item.hash_pedido,
        isDeleted: item.isDeleted,
        producto: item.compras_items.map((item) => item.product.nombre).join(', '),
        comprador: item.compras_items.map((item) => item.comprador.nombre).join(', '),
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedBillboard} />
            </div>
        </div>
    )
}

export default OrdersPage