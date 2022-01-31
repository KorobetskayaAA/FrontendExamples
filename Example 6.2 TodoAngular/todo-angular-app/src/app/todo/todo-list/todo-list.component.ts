import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Todo } from '../../shared/todo';
import { TodosService } from '../../shared/todos.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  loading: boolean = true;

  public get todos() {
    return this.todosService.todos;
  }
  public maxIndex() {
    return this.todosService.todos.length - 1;
  }
  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
    this.todosService.fetchTodos().subscribe(() => {
      this.loading = false;
    });
  }

  drop(event: CdkDragDrop<Todo[]>) {
    this.todosService.move(
      this.todosService.todos[event.previousIndex],
      event.currentIndex
    );
  }
}
