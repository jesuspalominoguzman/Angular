// src/app/modelos/producto.ts
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stock: number; // Stock actual (resultado de Entradas - Salidas)
  activo: boolean; // Para el borrado lógico 
}
