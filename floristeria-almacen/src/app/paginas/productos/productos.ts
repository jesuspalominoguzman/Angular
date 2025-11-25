import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../servicios/producto.service';
import { Producto } from '../../modelos/producto';
import { ProductoLinea } from '../../componentes/productos/producto-linea/producto-linea';
import { ProductoFormulario } from '../../componentes/productos/producto-formulario/producto-formulario';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ProductoLinea, ProductoFormulario],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  private productoService = inject(ProductoService);

  // Signal con todos los productos
  productos = this.productoService.obtenerProductos();

  // Computed signal para filtrar solo productos activos
  productosActivos = computed(() =>
    this.productos().filter(p => p.activo)
  );

  // Signal para controlar la visibilidad del modal
  mostrarModal = signal(false);

  // Signal para almacenar el producto seleccionado (null para nuevo producto)
  productoSeleccionado = signal<Producto | null>(null);

  abrirModalNuevo() {
    this.productoSeleccionado.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(producto: Producto) {
    this.productoSeleccionado.set(producto);
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.productoSeleccionado.set(null);
  }
}
