import { Component } from '@angular/core';
import { Todo } from 'src/app/shared/todo';
import { TodosService } from '../../shared/todos.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  title: string = '';

  constructor(private todoService: TodosService) {}

  submit() {
    if (!this.title) return;
    const todo: Todo = {
      id: 0,
      text: this.title,
      created: new Date(),
      done: false,
    };
    this.todoService.add(todo);
    this.title = '';
  }
}
