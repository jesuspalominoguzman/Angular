import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../servicios/producto.service';
import { MovimientoService } from '../../servicios/movimiento.service';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);

  productos = this.productoService.obtenerProductos();
  movimientos = this.movimientoService.obtenerMovimientos();

  // Estadísticas calculadas en tiempo real con computed signals
  totalProductos = computed(() =>
    this.productos().filter(p => p.activo).length
  );

  valorTotalInventario = computed(() =>
    this.productos()
      .filter(p => p.activo)
      .reduce((total, p) => total + (p.precioVenta * p.stock), 0)
  );

  totalStock = computed(() =>
    this.productos()
      .filter(p => p.activo)
      .reduce((total, p) => total + p.stock, 0)
  );

  productosStockBajo = computed(() =>
    this.productos().filter(p => p.activo && p.stock < 50).length
  );

  totalEntradas = computed(() =>
    this.movimientos().filter(m => m.tipo === 'ENTRADA').length
  );

  totalSalidas = computed(() =>
    this.movimientos().filter(m => m.tipo === 'SALIDA').length
  );

  categoriasStats = computed(() => {
    const prodActivos = this.productos().filter(p => p.activo);
    const categorias = new Map<string, number>();

    prodActivos.forEach(p => {
      categorias.set(p.categoria, (categorias.get(p.categoria) || 0) + 1);
    });

    return Array.from(categorias.entries()).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  });

  productosTopStock = computed(() =>
    this.productos()
      .filter(p => p.activo)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5)
  );
}
