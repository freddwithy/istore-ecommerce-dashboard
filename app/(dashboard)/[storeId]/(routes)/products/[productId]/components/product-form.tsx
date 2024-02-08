'use client'

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
    nombre: z.string().min(1),
    photo: z.object({ url: z.string() }).array(),
    precio_total: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    cantidad: z.coerce.number().min(1),
    descripcion: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isDeleted: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        photo: Image[]
    } | null
    categories: Category[]
    colors: Color[]
    sizes: Size[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    const params = useParams()
    const router = useRouter()

    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const title = initialData ? "Editar producto" : "Crear un nuevo producto"
    const description = initialData ? "Editar un producto" : "Agregar un producto"
    const toastMessage = initialData ? "Producto actualizado." : "Producto creado."
    const action = initialData ? "Guardar cambios" : "Crear"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            precio_total: parseFloat(String(initialData?.precio_total)),
            cantidad: parseFloat(String(initialData?.cantidad)),
        } : {
            nombre: '',
            photo: [],
            precio_total: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            descripcion: '',
            isFeatured: false,
            isDeleted: false,
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.push(`/${params.storeId}/products`)
            router.refresh()
            toast.success(toastMessage)
        } catch {
            toast.error('Ups! Algo salió mal.')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success('Producto eliminado.')
        } catch {
            toast.error('Ups! Algo salió mal.')
        } finally  {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant='destructive'
                        size='icon'
                        onClick={() => setOpen(true)}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form
                {...form}
            >
                <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-8 w-full"
                >
                    <FormField 
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>
                                        Imagenes
                                    </FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            value={field.value.map((image) => image.url)}
                                            disabled={loading}
                                            onChange={(url) => field.onChange([...field.value, {url}])}
                                            onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del Producto" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="precio_total"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Precio
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="1.000.000" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Categoría
                                    </FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Selecciona una categoría"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tamaño
                                    </FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Selecciona un tamaño"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Color
                                    </FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Selecciona un color"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Destacado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto aparecera en el inicio.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isDeleted"
                            render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archivado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto estara archivado. No sera visible.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Descripción
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea  placeholder="Agrega una descripción" className="resize-none" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="cantidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Precio
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="1000" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}