import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';

/**
 * Component that displays a badge indicating the status of a task
 * Uses different colors and icons based on the task status
 */
@Component({
  selector: 'todo-list-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'status-badge ' + status">
      <i [class]="statusIcon"></i>
      {{ statusLabel }}
    </span>
  `,
  styles: [`
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .non-started-tasks {
      background-color: #e3e3e3;
      color: #666;
    }

    .in-progress-tasks {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .paused-tasks {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .late-tasks {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .finished-tasks {
      background-color: #e8f5e9;
      color: #388e3c;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: Task['status'] = 'non-started-tasks';

  /**
   * Returns the appropriate icon class based on the task status
   */
  get statusIcon(): string {
    const icons = {
      'non-started-tasks': 'pi pi-stopwatch',
      'in-progress-tasks': 'pi pi-play-circle',
      'paused-tasks': 'pi pi-pause-circle',
      'late-tasks': 'pi pi-exclamation-circle',
      'finished-tasks': 'pi pi-check-circle'
    };
    return icons[this.status];
  }

  /**
   * Returns the formatted label for the task status
   */
  get statusLabel(): string {
    const labels = {
      'non-started-tasks': 'Not Started',
      'in-progress-tasks': 'In Progress',
      'paused-tasks': 'Paused',
      'late-tasks': 'Late',
      'finished-tasks': 'Finished'
    };
    return labels[this.status];
  }
} 