import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id_producto: params.productId,
            },
            include: {
                photo: true, 
                category: true, 
                color: true,
                size: true
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {
        const { userId } = auth()
        const body =  await req.json()

        const { 
            nombre, 
            precio_total,
            descripcion,
            categoryId,
            cantidad,
            colorId, 
            sizeId, 
            isDeleted,
            isFeatured,
            photo
        } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401})
        }
        if (!nombre) {
            return new NextResponse('Nombre is required', { status: 400})
        }

        if (!precio_total) {
            return new NextResponse('precio_total is required', { status: 400})
        }
        
        if (!descripcion) {
            return new NextResponse('descripcion is required', { status: 400})
        }

        if (!categoryId) {
            return new NextResponse('Category ID is required', { status: 400})
        }

        if (!colorId) {
            return new NextResponse('Color ID is required', { status: 400})
        }

        if (!sizeId) {
            return new NextResponse('Size ID is required', { status: 400})
        }

        if (!photo || !photo.length) {
            return new NextResponse('Photos are required', { status: 400})
        }

        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }

        const storeByUserId = await  prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403})
        }

        await prismadb.product.update({
            where: {
                id_producto: params.productId
            }, 
            data: {
                nombre,
                precio_total,
                categoryId,
                colorId,
                sizeId,
                photo: {
                    deleteMany: {}
                },
                isFeatured,
                isDeleted
            }
        })

        const product = await prismadb.product.update({
            where: {
                id_producto: params.productId
            },
            data: {
                photo: {
                    createMany: {
                        data: [
                            ...photo.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401})
        }

        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }

        const storeByUserId = await  prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403})
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id_producto: params.productId,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}