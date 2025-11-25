import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar'; 
import { DropdownModule } from 'primeng/dropdown';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Task } from '../../interfaces/task.interface';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tags.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'todo-list-right-menu',
    templateUrl: './right-menu.component.html',
    styleUrls: ['./right-menu.component.css'],
    standalone: true,
    imports: [Menu, ToastModule, InputTextModule, FloatLabel , CalendarModule, DropdownModule, Select, TagModule, CommonModule, ButtonModule, FormsModule]
})
export class RightMenuComponent implements OnInit, OnChanges, OnDestroy {
  @Input() task: Task | null = null;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() saveTaskEvent = new EventEmitter<Partial<Task>>();

  // Editable fields
  title: string = '';
  description: string = '';
  status: Task['status'] = 'non-started-tasks';
  category: string = '';
  tag: string = '';
  date: Date | null = null;

  categories: Category[] = [];
  tags: string[] = [];
  items: MenuItem[] | undefined;

  private categorySub!: Subscription;
  private tagSub!: Subscription;

  constructor(private categoryService: CategoryService, private tagService: TagService) {}

  ngOnInit() {
    this.items = [
      { separator: true },
      {
        label: 'Subtasks',
        items: [
          { label: 'Add New Subtask', icon: 'pi pi-plus' },
          { label: 'Subtask 1' },
          { label: 'Subtask 2' },
          { label: 'Subtask 3' },
        ]
      },
      {
        items: [ { sublabel: 'Save Changes' } ]
      }
    ];
    this.categorySub = this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
    this.tagSub = this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  ngOnDestroy() {
    if (this.categorySub) this.categorySub.unsubscribe();
    if (this.tagSub) this.tagSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.title = this.task.title;
      this.description = this.task.description || '';
      this.status = this.task.status;
      this.category = this.task.category || '';
      this.tag = this.task.tag || '';
    }
  }

  saveTask() {
    if (!this.task) return;
    this.saveTaskEvent.emit({
      ...this.task,
      title: this.title,
      description: this.description,
      status: this.status,
      category: this.category,
      tag: this.tag,
    });
  }
}