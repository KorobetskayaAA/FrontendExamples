import React from "react";

import { TodoList } from "../components/Todo/TodoList";

export function TodoPage() {
    return (
        <div className="container">
            <h1>Список задач</h1>
            <TodoList />
        </div>
    );
}
