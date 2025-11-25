import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { MovimientoService } from '../../servicios/movimiento.service';

@Component({
  selector: 'app-salidas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salidas.html',
  styleUrl: './salidas.css',
})
export class Salidas {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);

  // Lista de todos los productos activos
  productos = this.productoService.obtenerProductos();
  productosActivos = computed(() => this.productos().filter(p => p.activo));

  // Historial de salidas
  movimientos = this.movimientoService.obtenerMovimientos();
  salidas = computed(() =>
    this.movimientos()
      .filter(m => m.tipo === 'SALIDA')
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
  );

  // Formulario para registrar salidas
  formulario: FormGroup;

  // Signal para mensajes
  mensaje = signal<string>('');
  error = signal<string>('');

  // Computed para obtener el stock del producto seleccionado
  stockDisponible = computed(() => {
    const productoId = this.formulario?.value.productoId;
    if (productoId) {
      const producto = this.productos().find(p => p.id === Number(productoId));
      return producto ? producto.stock : 0;
    }
    return 0;
  });

  constructor() {
    this.formulario = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['', Validators.required]
    });
  }

  registrarSalida() {
    if (this.formulario.valid) {
      const productoId = Number(this.formulario.value.productoId);
      const cantidad = this.formulario.value.cantidad;
      const producto = this.productos().find(p => p.id === productoId);

      if (producto) {
        // Verificar que hay suficiente stock
        if (producto.stock < cantidad) {
          this.error.set(`✗ Error: Stock insuficiente. Disponible: ${producto.stock} unidades`);
          setTimeout(() => this.error.set(''), 3000);
          return;
        }

        this.movimientoService.registrarSalida(
          productoId,
          producto.nombre,
          cantidad,
          this.formulario.value.motivo
        );

        this.mensaje.set(`✓ Salida registrada: -${cantidad} unidades de ${producto.nombre}`);
        this.error.set('');
        this.formulario.reset({ productoId: '', cantidad: 1, motivo: '' });

        setTimeout(() => this.mensaje.set(''), 3000);
      }
    }
  }

  get productoId() { return this.formulario.get('productoId'); }
  get cantidad() { return this.formulario.get('cantidad'); }
  get motivo() { return this.formulario.get('motivo'); }
}
