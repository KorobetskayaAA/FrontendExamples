import { Component, Input } from '@angular/core';
import { Todo } from '../../shared/todo';
import { TodosService } from '../../shared/todos.service';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.css'],
})
export class TodoListItemComponent {
  @Input()
  todo!: Todo;
  @Input()
  index: number = 0;
  @Input()
  maxIndex: number = 0;

  constructor(private todosService: TodosService) {}

  onChangeDone() {
    this.todosService.toggleDone(this.todo);
  }

  onClickUp() {
    this.todosService.move(this.todo, this.index - 1);
  }

  onClickDown() {
    this.todosService.move(this.todo, this.index + 1);
  }

  onClickRemove() {
    this.todosService.remove(this.todo);
  }
}
