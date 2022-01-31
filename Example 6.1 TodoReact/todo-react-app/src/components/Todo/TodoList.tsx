import React, { useEffect, useState } from "react";

import { Todo } from "../../data/Todo";
import { TodoListItem } from "./TodoListItem";
import { TodoForm } from "./TodoForm";
import { todoApi } from "../../utils/api";

import "./Todo.css";

export const TodoList: React.FC = () => {
    const [todos, setTodos] = React.useState<Todo[]>([]);
    const [dragTargetIndex, setDragTargetIndex] = React.useState<number | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            todoApi
                .getAll()
                .then((todos) => {
                    setTodos(todos);
                })
                .finally(() => setLoading(false));
        }
    }, [loading]);

    function moveTodoListItem(todo: Todo, index?: number) {
        if (index === undefined) {
            if (dragTargetIndex !== null) {
                index = dragTargetIndex;
            } else {
                return;
            }
        }
        todoApi.moveto(todo, todos[index], true).then(() => {
            const newTodos = todos.filter(
                (td, i) => i === index || td.id !== todo.id
            );
            newTodos.splice(index || 0, 0, todo);
            setTodos(newTodos);
        });
    }

    function removeTodoListItem(todo: Todo) {
        todoApi.delete(todo).then(() => setLoading(true));
    }

    function addTodo(todo: Todo) {
        todoApi.post(todo).then(() => setLoading(true));
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                    title="Загрузка..."
                >
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
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
