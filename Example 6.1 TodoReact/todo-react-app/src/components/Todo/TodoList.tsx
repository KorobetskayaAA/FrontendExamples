import React from "react";

import { Todo } from "../../data/Todo";
import { TodoListItem } from "./TodoListItem";
import { TodoForm } from "./TodoForm";

import "./Todo.css";

const mockTodos = [
    {
        id: 1,
        text: "Test 1",
        created: new Date(),
        done: false,
    },
    {
        id: 2,
        text: "Test 2",
        created: new Date(),
        done: true,
    },
    {
        id: 3,
        text: "Test 3",
        created: new Date(),
        done: false,
    },
];

export const TodoList: React.FC = () => {
    const [todos, setTodos] = React.useState<Todo[]>(mockTodos);
    const [dragTargetIndex, setDragTargetIndex] = React.useState<number | null>(
        null
    );

    function moveTodoListItem(item: Todo, index?: number) {
        let newTodos = todos;
        if (index === undefined) {
            if (dragTargetIndex !== null) {
                index = dragTargetIndex;
            } else {
                return;
            }
        }
        newTodos = newTodos.filter((td, i) => i === index || td.id !== item.id);
        newTodos.splice(index, 0, item);
        setTodos(newTodos);
    }

    function removeTodoListItem(item: Todo) {
        const newTodos = todos.filter((td) => td !== item && td.id !== item.id);
        setTodos(newTodos);
    }

    function addTodo(todo: Todo) {
        todo.id =
            todos.reduce(
                (maxId, todo) => (todo.id > maxId ? todo.id : maxId),
                0
            ) + 1;
        setTodos([...todos, todo]);
    }

    return (
        <>
            <TodoForm handleSubmit={(todo) => addTodo(todo)} />
            <div id="todoList-container">
                {todos.length > 0 ? (
                    <ol
                        id="todoList"
                        className="list-group list-group-numbered"
                    >
                        {todos.map((todo, i) => (
                            <TodoListItem
                                key={todo.id}
                                index={i}
                                maxIndex={todos.length - 1}
                                todo={todo}
                                moveTodoListItem={moveTodoListItem}
                                removeTodoListItem={removeTodoListItem}
                                setDragTarget={(todo, position) => {
                                    const index = todos.findIndex(
                                        (td) => td.id === todo.id
                                    );
                                    setDragTargetIndex(
                                        position === "before"
                                            ? index
                                            : index + 1
                                    );
                                }}
                            />
                        ))}
                    </ol>
                ) : (
                    <div>
                        <em>Список задач пуст</em>
                    </div>
                )}
            </div>
        </>
    );
};
