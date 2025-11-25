import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule, NgIf } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { NavigationService } from '../../services/navigation.service';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tags.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription, Observable } from 'rxjs';
import { AddDialogComponent } from '../shared/add-dialog/add-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component';
import { AddTaskDialogComponent } from '../shared/add-task-dialog/add-task-dialog.component';

// NGXS Imports for Tasks
import { Store, Select } from '@ngxs/store';
import { TaskState } from '../../store/states/tasks.state';
import { LoadTasks, AddTask, UpdateTask } from '../../store/actions/tasks.actions';
import { Task } from '../../interfaces/task.interface';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'todo-list-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [
    NavigationService,
    ConfirmationService,
    MessageService,
    CategoryService,
    TagService,
    DialogService,
  ],
  standalone: true,
  imports: [
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    NgIf,
    TagModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    AddDialogComponent,
    CalendarModule,
    DialogModule,
    DynamicDialogModule,
    AddTaskDialogComponent,
  ],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @ViewChild('editInput') editInput: ElementRef | undefined;
  @ViewChild(AddTaskDialogComponent) addTaskDialogComponent!: AddTaskDialogComponent;

  ref: DynamicDialogRef | undefined;

  items: MenuItem[] | undefined;
  selectedDate: Date | null = null;

  calendarDialogVisible: boolean = false;
  categoryDialogVisible: boolean = false;
  tagDialogVisible: boolean = false;
  taskDialogVisible: boolean = false;
  categoryDialogHeader: string = '';
  tagDialogHeader: string = '';
  taskDialogHeader: string = 'Add New Task';


  private categorySubscription!: Subscription;
  private tagSubscription!: Subscription;
  private taskSubscription!: Subscription;

  constructor(
    private navigationService: NavigationService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.buildMenuItems(this.categoryService.getCategories(), this.tagService.getTags());

    this.categorySubscription = this.categoryService.categories$.subscribe(
      (categories) => {
        this.buildMenuItems(categories, this.tagService.getTags());
      }
    );
    this.tagSubscription = this.tagService.tags$.subscribe((tags) => {
      this.buildMenuItems(this.categoryService.getCategories(), tags);
      this.cdRef.detectChanges();
    });

    this.store.dispatch(new LoadTasks());

    this.taskSubscription = this.store.select(TaskState.getTasks).subscribe(() => {
      this.buildMenuItems(this.categoryService.getCategories(), this.tagService.getTags());
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.tagSubscription) {
      this.tagSubscription.unsubscribe();
    }
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    if (this.ref) {
      this.ref.close();
    }
  }

  /**
   * Initializes the side menu items.
   */
  private buildMenuItems(categories: Category[], tags: string[]): void {
    const nonStartedCount = this.store.selectSnapshot(TaskState.nonStartedTasks).length;
    const inProgressCount = this.store.selectSnapshot(TaskState.inProgressTasks).length;
    const pausedCount = this.store.selectSnapshot(TaskState.pausedTasks).length;
    const lateCount = this.store.selectSnapshot(TaskState.lateTasks).length;
    const finishedCount = this.store.selectSnapshot(TaskState.finishedTasks).length;

    this.items = [
      { separator: true },
      {
        label: 'Tasks',
        items: [
          {
            label: 'Add New Task',
            icon: 'pi pi-plus',
            command: () => this.openAddTaskDialog(),
          },
          {
            label: 'Non started',
            icon: 'pi pi-stopwatch',
            badge: nonStartedCount.toString(),
            command: () =>
              this.navigationService.gotoRoute([
                '/dashboard/tasks',
                'non-started-tasks',
              ]),
          },
          {
            label: 'In progress',
            icon: 'pi pi-play-circle',
            badge: inProgressCount.toString(),
            command: () =>
              this.navigationService.gotoRoute([
                '/dashboard/tasks',
                'in-progress-tasks',
              ]),
          },
          {
            label: 'Paused',
            icon: 'pi pi-pause-circle',
            badge: pausedCount.toString(),
            command: () =>
              this.navigationService.gotoRoute([
                '/dashboard/tasks',
                'paused-tasks',
              ]),
          },
          {
            label: 'Late',
            icon: 'pi pi-undo',
            badge: lateCount.toString(),
            command: () =>
              this.navigationService.gotoRoute([
                '/dashboard/tasks',
                'late-tasks',
              ]),
          },
          {
            label: 'Finished',
            icon: 'pi pi-thumbs-up',
            badge: finishedCount.toString(),
            command: () =>
              this.navigationService.gotoRoute([
                '/dashboard/tasks',
                'finished-tasks',
              ]),
          },
        ],
      },
      { separator: true },
      {
        label: 'Categories',
        items: [
          {
            label: 'Add New Category',
            icon: 'pi pi-plus',
            command: () => this.openAddCategoryDialog(),
          },
        ],
      },
      {
        label: 'Tags',
        items: [
          {
            label: 'Add New Tag',
            icon: 'pi pi-plus',
            command: () => this.openAddTagDialog(),
          },
        ],
      },
      { separator: true },
      {
        items: [
          {
            label: 'Calendar',
            icon: 'pi pi-calendar',
            command: () => this.openCalendarDialog()
          },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => this.navigationService.gotoLogin(),
          },
        ],
      },
    ];
    this.updateCategoryItems(categories);
    this.updateTagItems(this.tagService.getTags());
    this.cdRef.detectChanges();
  }

  openAddCategoryDialog(): void {
    this.categoryDialogVisible = true;
    this.categoryDialogHeader = 'Add New Category';
  }


  openCalendarDialog(): void {
    this.ref = this.dialogService.open(CalendarDialogComponent, {
      header: 'Select a date',
      width: '350px',
      height: '450px',
      modal: true,
      data: { initialDate: this.selectedDate },
    });

    this.ref.onClose.subscribe((date: Date | undefined) => {
      if (date) {
        this.selectedDate = date;
        console.log('Selected Date:', this.selectedDate);
      }
    });
  }


  openAddTagDialog(): void {
  this.tagDialogVisible = true;
  this.tagDialogHeader = 'Add New Tag';
}

  openAddTaskDialog(): void {
    if (this.addTaskDialogComponent) {
      this.addTaskDialogComponent.resetForm();
    }
    this.taskDialogVisible = true;
  }

  addNewTask(newTask: Task): void {
    this.store.dispatch(new AddTask(newTask));
    this.messageService.add({
      severity: 'success',
      summary: 'Task Added',
      detail: `Task "${newTask.title}" added with status "${newTask.status}"`,
    });

    this.navigationService.gotoRoute(['/dashboard/tasks', newTask.status]);
  }


  addNewCategory(newName: string): void {
    if (newName && newName.trim()) {
      const newCategory: Category = {
        id: Date.now(),
        name: newName.trim(),
        color: '#2196f3', // Default color, or let user pick
      };
      this.categoryService.addCategory(newCategory);
      this.messageService.add({
        severity: 'success',
        summary: 'Category Added',
        detail: `Category ${newName.trim()} added`,
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Category name cannot be empty',
      });
    }
  }

  /**
   * Adds a new tag.
   * @param newName The name of the new tag.
   */
  addNewTag(newName: string): void {
    if (newName && newName.trim()) {
      this.tagService.addTag(newName.trim());
      this.messageService.add({
        severity: 'success',
        summary: 'Tag Added',
        detail: `Tag ${newName.trim()} added`,
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tag name cannot be empty',
      });
    }
  }


  editCategory(categoryId: number, newName: string, newColor: string): void {
    this.categoryService.editCategory(categoryId, newName, newColor);
    this.messageService.add({
      severity: 'success',
      summary: 'Category Updated',
      detail: `Category updated to "${newName}"`,
    });
  }

  editTag(oldName: string, newName: string): void {
    this.tagService.editTag(oldName, newName);
    this.messageService.add({
      severity: 'success',
      summary: 'Tag Updated',
      detail: `Tag "${oldName}" updated to "${newName}"`,
    });
  }


  async deleteCategory(categoryId: number): Promise<void> {
    const cat = this.categoryService.getCategories().find(c => c.id === categoryId);
    const categoryName = cat ? cat.name : undefined;
    this.categoryService.removeCategory(categoryId);
    if (categoryName) {
      const allTasks: Task[] = this.store.selectSnapshot(TaskState.getTasks);
      const affectedTasks = allTasks.filter(task => task.category === categoryName);
      for (const task of affectedTasks) {
        await this.store.dispatch(new UpdateTask({ ...task, category: undefined })).toPromise();
      }
      await this.store.dispatch(new LoadTasks()).toPromise();
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Category Deleted',
      detail: `Category deleted`,
    });
  }


  async deleteTag(tag: string): Promise<void> {
    this.tagService.removeTag(tag);
    const allTasks: Task[] = this.store.selectSnapshot(TaskState.getTasks);
    const affectedTasks = allTasks.filter(task => task.tag === tag);
    for (const task of affectedTasks) {
      await this.store.dispatch(new UpdateTask({ ...task, tag: undefined })).toPromise();
    }
    await this.store.dispatch(new LoadTasks()).toPromise();
    this.messageService.add({
      severity: 'success',
      summary: 'Tag Deleted',
      detail: `Tag ${tag} deleted`,
    });
  }

  updateCategoryItems(categories: Category[]): void {
    const categoryItems = categories.map((category) => ({
      label: category.name,
      id: String(category.id),
      icon: 'pi pi-tag',
      isDynamic: true,
      command: () => this.startEditCategoryItem(category.name)
    }));
    if (this.items) {
      let categoriesMenu = this.items.find(
        (item) => item.label === 'Categories'
      );
      if (categoriesMenu && categoriesMenu.items) {
        categoriesMenu.items = [categoriesMenu.items[0], ...categoryItems];
      }
    }
  }


  updateTagItems(tags: string[]): void {
    const tagItems = tags.map((tag) => ({
      label: tag,
      icon: 'pi pi-hashtag',
      isDynamic: true,
      command: () => this.startEditTagItem(tag)
    }));
    if (this.items) {
      let tagsMenu = this.items.find((item) => item.label === 'Tags');
      if (tagsMenu && tagsMenu.items) {
        tagsMenu.items = [tagsMenu.items[0], ...tagItems];
      }
    }
  }


  startEditCategoryItem(categoryName: string): void {
    // Find the category by name and get its id
    const category = this.categoryService.getCategories().find(cat => cat.name === categoryName);
    if (category) {
      // Open your edit dialog or logic here, passing category.id, category.name, category.color
      // Example: this.editCategory(category.id, 'New Name', 'New Color');
      // For now, just log:
      console.log('Edit Category clicked for:', category);
    }
  }


  startEditTagItem(tagLabel: string): void {
    console.log('Edit Tag clicked for (no action defined):', tagLabel);
  }

 
  confirmDeleteCategory(categoryId: number): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this category?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategory(categoryId),
    });
  }

 
  confirmDeleteTag(tag: string): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${tag}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteTag(tag),
    });
  }
}