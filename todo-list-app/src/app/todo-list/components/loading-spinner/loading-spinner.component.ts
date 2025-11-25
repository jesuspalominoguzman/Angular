import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Reusable loading spinner component
 * Displays a centered loading spinner with optional overlay
 */
@Component({
  selector: 'todo-list-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <p-progressSpinner
        [style]="{ width: '50px', height: '50px' }"
        strokeWidth="4"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      ></p-progressSpinner>
      <span *ngIf="message" class="spinner-message">{{ message }}</span>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }

    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }

    .spinner-message {
      color: #666;
      font-size: 0.875rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() overlay: boolean = false;
} 