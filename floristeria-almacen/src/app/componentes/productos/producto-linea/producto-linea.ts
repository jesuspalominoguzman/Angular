import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../modelos/producto';
import { ProductoService } from '../../../servicios/producto.service';

@Component({
  selector: 'tr[app-producto-linea]',
  imports: [CommonModule],
  templateUrl: './producto-linea.html',
  styleUrl: './producto-linea.css',
  host: {
    '[class.producto-row]': 'true'
  }
})
export class ProductoLinea {
  // Input signal para recibir el producto
  producto = input.required<Producto>();

  // Output para emitir evento de edición
  onEditar = output<Producto>();

  // Inyectar el servicio
  private productoService = inject(ProductoService);

  editar() {
    this.onEditar.emit(this.producto());
  }

  borrar() {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${this.producto().nombre}"?`)) {
      this.productoService.borrarProducto(this.producto().id);
    }
  }
}
