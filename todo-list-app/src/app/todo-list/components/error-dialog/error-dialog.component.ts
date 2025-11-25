import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

/**
 * Reusable error dialog component
 * Displays error messages in a modal dialog with a close button
 */
@Component({
  selector: 'todo-list-error-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '450px' }"
      [header]="header"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onHide()"
    >
      <div class="dialog-content">
        <div class="error-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <p class="error-message">{{ message }}</p>
      </div>
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button
            pButton
            label="Close"
            icon="pi pi-times"
            class="p-button-text"
            (click)="onClose()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .dialog-content {
      padding: 1rem 0;
      text-align: center;
    }

    .error-icon {
      font-size: 3rem;
      color: #f44336;
      margin-bottom: 1rem;
    }

    .error-message {
      color: #666;
      margin: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  `]
})
export class ErrorDialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Error';
  @Input() message: string = 'An error has occurred.';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  /**
   * Handles dialog hide event
   * Emits visibility change to parent component
   */
  onHide(): void {
    this.visibleChange.emit(false);
  }

  /**
   * Handles close button click
   * Emits close event and closes dialog
   */
  onClose(): void {
    this.close.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }
} 