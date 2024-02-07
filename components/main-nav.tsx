'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()
  
  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Inicio',
      active: pathname === `/${params.storeId}`
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Productos',
      active: pathname === `/${params.storeId}/products`
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categorías',
      active: pathname === `/${params.storeId}/categories`
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Pedidos',
      active: pathname === `/${params.storeId}/orders`
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Portadas',
      active: pathname === `/${params.storeId}/billboards`
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Tamaños',
      active: pathname === `/${params.storeId}/sizes`
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colores',
      active: pathname === `/${params.storeId}/colors`
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Configuracion',
      active: pathname === `/${params.storeId}/settings`
    }
  ]
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
