import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Component that displays a message when there is no content to show
 * Can include an optional action button
 */
@Component({
  selector: 'todo-list-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="pi pi-inbox"></i>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <button
        *ngIf="actionLabel"
        pButton
        [label]="actionLabel"
        [icon]="actionIcon"
        (click)="onAction()"
        class="p-button-outlined"
      ></button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 1rem;
    }

    .empty-title {
      color: #495057;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .empty-message {
      color: #6c757d;
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No Items Found';
  @Input() message: string = 'There are no items to display at this time.';
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = '';

  /**
   * Handles action button click
   * Emits an event that can be handled by the parent component
   */
  onAction(): void {
    // This method can be extended to emit an event if needed
  }
} 