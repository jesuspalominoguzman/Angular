import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Productos } from './paginas/productos/productos';
import { Entradas } from './paginas/entradas/entradas';
import { Salidas } from './paginas/salidas/salidas';
import { Estadisticas } from './paginas/estadisticas/estadisticas';

export const routes: Routes = [
    { path: '', component: Home, title: 'FloriDAM - Inicio' },
    { path: 'productos', component: Productos, title: 'FloriDAM - Gestión de Productos' },
    { path: 'entradas', component: Entradas, title: 'FloriDAM - Registro de Entradas' },
    { path: 'salidas', component: Salidas, title: 'FloriDAM - Registro de Salidas' },
    { path: 'estadisticas', component: Estadisticas, title: 'FloriDAM - Estadísticas' },
    { path: '**', redirectTo: '' } // Redirigir cualquier otra ruta a Home
];
