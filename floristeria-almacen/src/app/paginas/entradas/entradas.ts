import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { MovimientoService } from '../../servicios/movimiento.service';

@Component({
  selector: 'app-entradas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entradas.html',
  styleUrl: './entradas.css',
})
export class Entradas {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);

  // Lista de todos los productos activos
  productos = this.productoService.obtenerProductos();
  productosActivos = computed(() => this.productos().filter(p => p.activo));

  // Historial de entradas
  movimientos = this.movimientoService.obtenerMovimientos();
  entradas = computed(() =>
    this.movimientos()
      .filter(m => m.tipo === 'ENTRADA')
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
  );

  // Formulario para registrar entradas
  formulario: FormGroup;

  // Signal para mensajes
  mensaje = signal<string>('');

  constructor() {
    this.formulario = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['', Validators.required]
    });
  }

  registrarEntrada() {
    if (this.formulario.valid) {
      const productoId = Number(this.formulario.value.productoId);
      const producto = this.productos().find(p => p.id === productoId);

      if (producto) {
        this.movimientoService.registrarEntrada(
          productoId,
          producto.nombre,
          this.formulario.value.cantidad,
          this.formulario.value.motivo
        );

        this.mensaje.set(`✓ Entrada registrada: +${this.formulario.value.cantidad} unidades de ${producto.nombre}`);
        this.formulario.reset({ productoId: '', cantidad: 1, motivo: '' });

        setTimeout(() => this.mensaje.set(''), 3000);
      }
    }
  }

  get productoId() { return this.formulario.get('productoId'); }
  get cantidad() { return this.formulario.get('cantidad'); }
  get motivo() { return this.formulario.get('motivo'); }
}
