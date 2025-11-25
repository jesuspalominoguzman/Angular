// src/app/servicios/movimiento.service.ts
import { Injectable, signal, Signal } from '@angular/core';
import { Movimiento } from '../modelos/movimiento';
import { ProductoService } from './producto.service';
import { inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MovimientoService {
    private productoService = inject(ProductoService);

    /* Signal que almacena el historial de movimientos */
    private movimientosSignal = signal<Movimiento[]>([]);

    /* Devuelve el Signal completo para la reactividad */
    obtenerMovimientos(): Signal<Movimiento[]> {
        return this.movimientosSignal;
    }

    /* Registra una entrada de stock */
    registrarEntrada(productoId: number, productoNombre: string, cantidad: number, motivo: string) {
        const nuevoId = this.movimientosSignal().length > 0
            ? Math.max(...this.movimientosSignal().map(m => m.id)) + 1
            : 1;

        const nuevoMovimiento: Movimiento = {
            id: nuevoId,
            productoId,
            productoNombre,
            tipo: 'ENTRADA',
            cantidad,
            fecha: new Date(),
            motivo
        };

        this.movimientosSignal.update(movimientos => [...movimientos, nuevoMovimiento]);

        // Actualizar stock del producto
        this.actualizarStockProducto(productoId, cantidad);
    }

    /* Registra una salida de stock */
    registrarSalida(productoId: number, productoNombre: string, cantidad: number, motivo: string) {
        const nuevoId = this.movimientosSignal().length > 0
            ? Math.max(...this.movimientosSignal().map(m => m.id)) + 1
            : 1;

        const nuevoMovimiento: Movimiento = {
            id: nuevoId,
            productoId,
            productoNombre,
            tipo: 'SALIDA',
            cantidad,
            fecha: new Date(),
            motivo
        };

        this.movimientosSignal.update(movimientos => [...movimientos, nuevoMovimiento]);

        // Actualizar stock del producto (restar)
        this.actualizarStockProducto(productoId, -cantidad);
    }

    /* Actualiza el stock de un producto */
    private actualizarStockProducto(productoId: number, cambio: number) {
        const productos = this.productoService.obtenerProductos()();
        const producto = productos.find(p => p.id === productoId);

        if (producto) {
            const productoActualizado = {
                ...producto,
                stock: producto.stock + cambio
            };
            this.productoService.editarProducto(productoActualizado);
        }
    }
}
