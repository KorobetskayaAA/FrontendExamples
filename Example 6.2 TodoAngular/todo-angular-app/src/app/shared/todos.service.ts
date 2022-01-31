import { Injectable } from '@angular/core';
//import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo } from './todo';

const mockTodos = [
  {
    id: 1,
    text: 'Test 1',
    created: new Date(),
    done: false,
  },
  {
    id: 2,
    text: 'Test 2',
    created: new Date(),
    done: true,
  },
  {
    id: 3,
    text: 'Test 3',
    created: new Date(),
    done: false,
  },
];

@Injectable({ providedIn: 'root' })
export class TodosService {
  public todos: Todo[] = mockTodos;

  constructor() {}

  toggleDone(todo: Todo) {
    todo.done = !todo.done;
  }

  remove(todo: Todo) {
    this.todos = this.todos.filter((t) => t.id !== todo.id);
  }

  add(todo: Todo) {
    this.todos.push(todo);
  }

  move(todo: Todo, index: number) {
    // этот метод работает с индексами и нам не подходит, но обращаю внимание, что он есть
    //moveItemInArray(this.todos, fromIndex, toIndex);
    this.todos = this.todos.filter((td, i) => i === index || td.id !== todo.id);
    this.todos.splice(index, 0, todo);
  }
}
