import prismadb from "@/lib/prismadb"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export async function OPTIONS() {
    return {
        statusCode: 200,
        headers: corsHeaders
    }
}

export async function POST(
    req: Request,
    { params: { storeId } }: { params: { storeId: string } }
) {
    const { productsIds } = await req.json()

    if (!productsIds || productsIds.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing productsIds" }),
            headers: corsHeaders
        }
    }

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productsIds
            }
        }
    })
}

