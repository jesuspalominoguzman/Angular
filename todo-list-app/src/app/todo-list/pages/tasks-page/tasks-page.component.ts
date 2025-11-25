import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common'; 
import { ButtonModule } from 'primeng/button';
import { RightMenuComponent } from '../../components/right-menu/right-menu.component';

// NGXS Imports
import { Store } from '@ngxs/store';
import { TaskState } from '../../store/states/tasks.state'; 
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../interfaces/task.interface'; 
import { LoadTasks, UpdateTask } from '../../store/actions/tasks.actions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'todo-list-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ButtonModule, CommonModule, RightMenuComponent],
})
export default class TasksPageComponent implements OnInit, OnDestroy {
  taskIdentifier: 'non-started-tasks' | 'in-progress-tasks' | 'paused-tasks' | 'late-tasks' | 'finished-tasks' | null = null;
  pageTitle: string = 'Tasks';
  allTasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  private tasksSubscription!: Subscription;
  expandedIndex: number = -1;
  showRightMenu: boolean = false;
  selectedTask: Task | null = null;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.allTasks$ = this.store.select(TaskState.getTasks);
    this.filteredTasks$ = combineLatest([
      this.allTasks$,
      this.route.paramMap
    ]).pipe(
      map(([allTasks, params]) => {
        const taskIdentifier = params.get('id');
        this.setPageTitle(taskIdentifier);
        if (taskIdentifier) {
          return allTasks.filter(task => task.status === taskIdentifier);
        }
        return allTasks;
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadTasks());
  }

  ngOnDestroy(): void {
    // Ya no es necesario desuscribirse manualmente
  }

  setPageTitle(id: string | null): void {
    switch (id) {
      case 'non-started-tasks':
        this.pageTitle = 'Non Started Tasks';
        break;
      case 'in-progress-tasks':
        this.pageTitle = 'In Progress Tasks';
        break;
      case 'paused-tasks':
        this.pageTitle = 'Paused Tasks';
        break;
      case 'late-tasks':
        this.pageTitle = 'Late Tasks';
        break;
      case 'finished-tasks':
        this.pageTitle = 'Finished Tasks';
        break;
      default:
        this.pageTitle = 'All Tasks';
        break;
    }
  }

  openRightMenu(task: Task) {
    this.selectedTask = task;
    this.showRightMenu = true;
  }

  closeRightMenu() {
    this.showRightMenu = false;
    this.selectedTask = null;
  }

  updateTask(updated: Partial<Task>) {
    if (!updated.id || !updated.title || !updated.status) return;
    this.store.dispatch(new UpdateTask(updated as Task));
    this.closeRightMenu();
  }
}