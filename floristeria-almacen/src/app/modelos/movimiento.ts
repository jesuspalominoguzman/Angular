// src/app/modelos/movimiento.ts
export interface Movimiento {
    id: number;
    productoId: number;
    productoNombre: string;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    fecha: Date;
    motivo: string;
}
