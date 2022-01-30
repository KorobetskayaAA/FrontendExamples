import React, { FC } from "react";

import { Todo } from "../../data/Todo";
import { IconButton } from "../IconButton/IconButton";

import "./Todo.css";

export type MoveTodoListItem = (item: Todo, index?: number) => void;
export type RemoveTodoListItem = (item: Todo) => void;

export interface TodoListItemProps {
    todo: Todo;
    index: number;
    maxIndex: number;
    setDragTarget: (item: Todo, position: "before" | "after") => void;
    moveTodoListItem: MoveTodoListItem;
    removeTodoListItem: RemoveTodoListItem;
}

const TodoListItemDone: FC<{
    done: boolean;
    setDone: (done: boolean) => void;
}> = ({ done, setDone }) => (
    <input
        className="todo-done"
        type="checkbox"
        checked={done}
        onChange={() => setDone(!done)}
    />
);

const TodoListItemText: FC<{
    text: string;
}> = ({ text }) => <p className="todo-text">{text}</p>;

const TodoListItemCreated: FC<{
    created: Date;
}> = ({ created }) => (
    <small className="todo-created">Создано: {created.toLocaleString()}</small>
);

const TodoListItemControls: FC<TodoListItemProps> = ({
    todo,
    index,
    maxIndex,
    moveTodoListItem,
    removeTodoListItem,
}) => (
    <div className="todo-controls">
        <IconButton
            className="todo-button-up"
            iconName="caret-up"
            color="secondary"
            disabled={index === 0}
            onClickHandler={() => moveTodoListItem(todo, index - 1)}
        />
        <IconButton
            className="todo-button-down"
            iconName="caret-down"
            color="secondary"
            disabled={index === maxIndex}
            onClickHandler={() => moveTodoListItem(todo, index + 1)}
        />
        <IconButton
            className="todo-button-remove"
            iconName="trash-fill"
            color="danger"
            onClickHandler={() => removeTodoListItem(todo)}
        />
    </div>
);

export const TodoListItem: FC<TodoListItemProps> = (props) => {
    const { todo, moveTodoListItem, setDragTarget } = props;
    const [isDragging, setIsDragging] = React.useState(false);
    const [isDragTarget, setIsDragTarget] = React.useState<
        false | "before" | "after"
    >(false);

    function dropBeforeAfter(evt: React.DragEvent) {
        const dragTarget = evt.target as HTMLElement;
        const dragTargetRect = dragTarget.getBoundingClientRect();
        const dragTargetMiddle =
            (dragTargetRect.top + dragTargetRect.bottom) / 2;
        return evt.clientY > dragTargetMiddle ? "after" : "before";
    }

    return (
        <li
            className={
                "list-group-item todo" +
                (isDragging ? " dragging" : "") +
                (isDragTarget ? " drag-target " + isDragTarget : "")
            }
            draggable
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
                setIsDragging(false);
                moveTodoListItem(todo);
            }}
            onDragOver={(evt) => {
                evt.preventDefault();
                const position = dropBeforeAfter(evt);
                setIsDragTarget(position);
                setDragTarget(todo, position);
            }}
            onDragExit={() => setIsDragTarget(false)}
            onDrop={() => setIsDragTarget(false)}
        >
            <TodoListItemDone
                done={todo.done}
                setDone={(done) => (todo.done = done)}
            />
            <TodoListItemText text={todo.text} />
            <TodoListItemControls {...props} />
            <TodoListItemCreated created={todo.created} />
        </li>
    );
};
