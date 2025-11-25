import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Task } from '../../interfaces/task.interface';

/**
 * Component that provides a dropdown filter for task statuses
 * Allows users to filter tasks by their current status
 */
@Component({
  selector: 'todo-list-status-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  template: `
    <div class="status-filter">
      <label for="statusFilter">Filter by Status:</label>
      <p-dropdown
        id="statusFilter"
        [options]="statusOptions"
        [(ngModel)]="selectedStatus"
        (onChange)="onStatusChange()"
        placeholder="Select Status"
        [showClear]="true"
      ></p-dropdown>
    </div>
  `,
  styles: [`
    .status-filter {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    label {
      font-weight: 500;
      color: #666;
    }
  `]
})
export class StatusFilterComponent {
  @Input() currentStatus: Task['status'] | null = null;
  @Output() statusChange = new EventEmitter<Task['status'] | null>();

  selectedStatus: Task['status'] | null = null;

  /**
   * Available status options for the dropdown filter
   */
  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Not Started', value: 'non-started-tasks' },
    { label: 'In Progress', value: 'in-progress-tasks' },
    { label: 'Paused', value: 'paused-tasks' },
    { label: 'Late', value: 'late-tasks' },
    { label: 'Finished', value: 'finished-tasks' }
  ];

  /**
   * Handles status change events from the dropdown
   * Emits the new status value to parent components
   */
  onStatusChange(): void {
    this.statusChange.emit(this.selectedStatus);
  }

  /**
   * Lifecycle hook that runs after the component is initialized
   * Sets the initial selected status based on input
   */
  ngOnInit(): void {
    this.selectedStatus = this.currentStatus;
  }
} 