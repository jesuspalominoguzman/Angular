import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Task } from '../../interfaces/task.interface';
import { AddTask, UpdateTask, DeleteTask, LoadTasks, LoadTasksSuccess, LoadTasksFail } from '../actions/tasks.actions';
import { TasksService } from '../../services/tasks.service'; 
import { inject, Injectable } from '@angular/core';

export interface TaskStateModel {
  tasks: Task[];
  loading: boolean;
}

@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    loading: false,
  },
})
@Injectable()
export class TaskState {
  private tasksService = inject(TasksService);

  @Selector()
  static getTasks(state: TaskStateModel): Task[] {
    return state.tasks;
  }

  @Selector()
  static getTasksByStatus(status: Task['status']) {
    console.log((state: TaskStateModel) => state.tasks.map(task => task) as Task[]);
    return (state: TaskStateModel) => state.tasks.filter(task => task.status === status) as Task[];
  }

  @Selector()
  static getLoading(state: TaskStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static nonStartedTasks(state: TaskStateModel): Task[] {
    return state.tasks.filter(task => task.status === 'non-started-tasks');
  }

  @Selector()
  static inProgressTasks(state: TaskStateModel): Task[] {
    return state.tasks.filter(task => task.status === 'in-progress-tasks');
  }

  @Selector()
  static pausedTasks(state: TaskStateModel): Task[] {
    return state.tasks.filter(task => task.status === 'paused-tasks');
  }

  @Selector()
  static lateTasks(state: TaskStateModel): Task[] {
    return state.tasks.filter(task => task.status === 'late-tasks');
  }

  @Selector()
  static finishedTasks(state: TaskStateModel): Task[] {
    return state.tasks.filter(task => task.status === 'finished-tasks');
  }

  constructor() {}

  @Action(LoadTasks)
  loadTasks(ctx: StateContext<TaskStateModel>) {
    ctx.patchState({ loading: true });
    const initialTasks = this.tasksService.getAllTasks();
    ctx.dispatch(new LoadTasksSuccess(initialTasks));
    ctx.patchState({ loading: false });
  }

  @Action(LoadTasksSuccess)
  loadTasksSuccess(
    ctx: StateContext<TaskStateModel>,
    { payload }: LoadTasksSuccess
  ) {
    console.log('LoadTasksSuccess payload:', payload);
    ctx.patchState({
      tasks: Array.isArray(payload) ? payload : [],
      loading: false,
    });
  }

  @Action(LoadTasksFail)
  loadTasksFail(
    ctx: StateContext<TaskStateModel>,
    { payload }: LoadTasksFail
  ) {
    ctx.patchState({
      loading: false,
    });
    console.error('Error loading tasks', payload);
  }

  @Action(AddTask)
  addTask(ctx: StateContext<TaskStateModel>, { payload }: AddTask) {
    this.tasksService.addTask(payload);
    ctx.patchState({
      tasks: [...ctx.getState().tasks, payload],
    });
  }

  @Action(UpdateTask)
  updateTask(
    ctx: StateContext<TaskStateModel>,
    { payload }: UpdateTask
  ) {
    this.tasksService.updateTask(payload);
    const updatedTasks = ctx.getState().tasks.map((task) =>
      task.id === payload.id ? payload : task
    );
    ctx.patchState({ tasks: updatedTasks });
  }

  @Action(DeleteTask)
  deleteTask(
    ctx: StateContext<TaskStateModel>,
    { payload }: DeleteTask
  ) {
    this.tasksService.deleteTask(payload);
    ctx.patchState({
      tasks: ctx.getState().tasks.filter(
        (task) => task.id !== payload
      ),
    });
  }
}