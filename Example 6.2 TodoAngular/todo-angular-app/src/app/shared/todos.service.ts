import { Injectable } from '@angular/core';
//import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo } from './todo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodosService {
  public todos: Todo[] = [];

  constructor(private http: HttpClient) {}

  fetchTodos(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>('https://localhost:5001/api/todo')
      .pipe(tap((todos) => (this.todos = todos)));
  }

  toggleDone(todo: Todo) {
    todo.done = !todo.done;
  }

  remove(todo: Todo) {
    this.http
      .delete<void>(`https://localhost:5001/api/todo/${todo.id}`)
      .subscribe(
        () => (this.todos = this.todos.filter((t) => t.id !== todo.id))
      );
  }

  add(todo: Todo) {
    this.http
      .post<Todo>('https://localhost:5001/api/todo', todo)
      .subscribe((newTodo) => this.todos.push(newTodo));
  }

  move(todo: Todo, index: number) {
    this.http
      .post<void>(
        `https://localhost:5001/api/todo/moveto/${todo.id}/${this.todos[index].id}?insertAfter=true`,
        null
      )
      .subscribe(() => {
        this.todos = this.todos.filter(
          (td, i) => i === index || td.id !== todo.id
        );
        this.todos.splice(index, 0, todo);
      });
  }
}
