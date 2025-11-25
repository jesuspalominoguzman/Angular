import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'todo-list-add-dialog',
  templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, DialogModule, CommonModule]
})
export class AddDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  


  name: string = '';
  @Input() header: string = '';

  

  save(): void {
    this.valueChange.emit(this.name);
    this.closeDialog();
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}