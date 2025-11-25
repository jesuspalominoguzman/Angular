// src/app/servicios/producto.service.ts
import { Injectable, signal, Signal } from '@angular/core';
import { Producto } from '../modelos/producto'; // Importar la interfaz

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    /* Signal que almacena un array de productos (Mock Data) */
    private productosSignal = signal<Producto[]>([
        { id: 1, nombre: 'Rosa Roja', categoria: 'Flores', precioCompra: 1.00, precioVenta: 2.50, stock: 120, activo: true },
        { id: 2, nombre: 'Tulipán Amarillo', categoria: 'Flores', precioCompra: 0.80, precioVenta: 2.00, stock: 85, activo: true },
        { id: 3, nombre: 'Maceta Cerámica', categoria: 'Macetas', precioCompra: 3.00, precioVenta: 6.50, stock: 40, activo: true },
        { id: 4, nombre: 'Abono Universal 1kg', categoria: 'Abonos', precioCompra: 2.20, precioVenta: 5.00, stock: 60, activo: true }
    ]);

    /* Devuelve el Signal completo para la reactividad */
    obtenerProductos(): Signal<Producto[]> {
        return this.productosSignal;
    }

    /* Borra lógicamente el producto (lo marca como inactivo)  */
    borrarProducto(id: number) {
        this.productosSignal.update(productos =>
            productos.map(p => p.id === id ? { ...p, activo: false } : p)
        );
    }

    /* Agrega un nuevo producto (simulando un nuevo ID) */
    agregarProducto(producto: Producto) {
        const nuevoId = Math.max(...this.productosSignal().map(p => p.id)) + 1;
        this.productosSignal.update(productos => [...productos, { ...producto, id: nuevoId, activo: true }]);
    }

    /* Edita un producto existente */
    editarProducto(productoEditado: Producto) {
        this.productosSignal.update(productos =>
            productos.map(p => p.id === productoEditado.id ? productoEditado : p)
        );
    }
}
