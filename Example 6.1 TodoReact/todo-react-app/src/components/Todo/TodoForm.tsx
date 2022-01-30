import React, { useState } from "react";
import { Todo } from "../../data/Todo";

export interface TodoFormProps {
    handleSubmit: (todo: Todo) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ handleSubmit }) => {
    const [text, setText] = useState("");
    return (
        <form
            id="todoList-form"
            className="d-flex gap-2 mb-3"
            onSubmit={(evt) => {
                evt.preventDefault();
                handleSubmit({ id: 0, text, created: new Date(), done: false });
                setText("");
            }}
        >
            <input
                type="text"
                className="form-control"
                name="text"
                placeholder="Введите текст задачи"
                value={text}
                onChange={(evt) => setText(evt.target.value)}
            />
            <button className="btn btn-primary" type="submit">
                Добавить
            </button>
        </form>
    );
};
