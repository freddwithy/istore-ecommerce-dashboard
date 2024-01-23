'use client'

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"

export const StoreModal = () => {
    const storeModal = useStoreModal();
    return (
        <Modal 
            title="Crear Tienda"
            description="Agregar una nueva tienda para manejar los productos, categorías, ventas, etc."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}    
            >
            Futuro form de creacion de tienda
        </Modal>
    )
}