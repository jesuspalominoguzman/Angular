import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

/**
 * Component that provides a search and filter interface for tasks
 * Includes a search input and filter controls
 */
@Component({
  selector: 'todo-list-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  template: `
    <div class="filter-bar">
      <div class="search-container">
        <input
          pInputText
          type="text"
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          placeholder="Search tasks..."
          class="search-input"
        />
        <button
          pButton
          icon="pi pi-search"
          class="p-button-rounded p-button-text"
          (click)="onSearch()"
        ></button>
      </div>
      <div class="filter-controls">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-input {
      min-width: 300px;
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  `]
})
export class FilterBarComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  /**
   * Handles search input changes
   * Emits the current search term to parent components
   */
  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
} 