import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

/**
 * Reusable confirmation dialog component
 * Displays a modal dialog with customizable message and action buttons
 */
@Component({
  selector: 'todo-list-confirm-dialog',
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
        <p>{{ message }}</p>
      </div>
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button
            pButton
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            (click)="onCancel()"
          ></button>
          <button
            pButton
            label="Confirm"
            icon="pi pi-check"
            class="p-button-text p-button-danger"
            (click)="onConfirm()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .dialog-content {
      padding: 1rem 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * Handles dialog hide event
   * Emits visibility change to parent component
   */
  onHide(): void {
    this.visibleChange.emit(false);
  }

  /**
   * Handles confirmation action
   * Emits confirm event and closes dialog
   */
  onConfirm(): void {
    this.confirm.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /**
   * Handles cancellation action
   * Emits cancel event and closes dialog
   */
  onCancel(): void {
    this.cancel.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }
} 