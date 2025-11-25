import { Component, inject, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../modelos/producto';
import { ProductoService } from '../../../servicios/producto.service';

@Component({
  selector: 'app-producto-formulario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-formulario.html',
  styleUrl: './producto-formulario.css',
})
export class ProductoFormulario {
  // Input para recibir el producto a editar (null si es nuevo)
  producto = input<Producto | null>(null);

  // Output para notificar cierre del modal
  onCerrar = output<void>();

  // Inyectar servicios
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  // Formulario reactivo
  formulario: FormGroup;

  // Título del modal
  titulo = signal<string>('Añadir Producto');

  constructor() {
    // Inicializar formulario
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });

    // Effect para cargar datos cuando cambia el producto
    effect(() => {
      const prod = this.producto();
      if (prod) {
        this.titulo.set('Editar Producto');
        this.formulario.patchValue({
          nombre: prod.nombre,
          categoria: prod.categoria,
          precioCompra: prod.precioCompra,
          precioVenta: prod.precioVenta,
          stock: prod.stock
        });
      } else {
        this.titulo.set('Añadir Producto');
        this.formulario.reset({
          nombre: '',
          categoria: '',
          precioCompra: 0,
          precioVenta: 0,
          stock: 0
        });
      }
    });
  }

  guardar() {
    if (this.formulario.valid) {
      const datosFormulario = this.formulario.value;
      const prod = this.producto();

      if (prod) {
        // Editar producto existente
        const productoEditado: Producto = {
          ...prod,
          ...datosFormulario
        };
        this.productoService.editarProducto(productoEditado);
      } else {
        // Crear nuevo producto
        const nuevoProducto: Producto = {
          id: 0, // Se generará automáticamente en el servicio
          ...datosFormulario,
          activo: true
        };
        this.productoService.agregarProducto(nuevoProducto);
      }

      this.cerrar();
    }
  }

  cerrar() {
    this.formulario.reset();
    this.onCerrar.emit();
  }

  // Helper para validación en template
  get nombre() { return this.formulario.get('nombre'); }
  get categoria() { return this.formulario.get('categoria'); }
  get precioCompra() { return this.formulario.get('precioCompra'); }
  get precioVenta() { return this.formulario.get('precioVenta'); }
  get stock() { return this.formulario.get('stock'); }
}
