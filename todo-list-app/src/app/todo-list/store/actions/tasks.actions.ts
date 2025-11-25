import { Task } from '../../interfaces/task.interface';

export class AddTask {
  static readonly type = '[Task] Add Task';
  constructor(public payload: Task) {}
}

export class UpdateTask {
  static readonly type = '[Task] Update Task';
  constructor(public payload: Task) {}
}

export class DeleteTask {
  static readonly type = '[Task] Delete Task';
  constructor(public payload: string) {}
}

export class LoadTasks {
  static readonly type = '[Task] Load Tasks';
}

export class LoadTasksSuccess {
  static readonly type = '[Task] Load Tasks Success';
  constructor(public payload: Task[]) {}
}

export class LoadTasksFail {
  static readonly type = '[Task] Load Tasks Fail';
  constructor(public payload: any) {}
}