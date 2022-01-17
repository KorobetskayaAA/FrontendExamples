window.addEventListener("load", () => {
    const apiUrl = "https://localhost:5001/api/";

    async function apiRequest(path, method = "GET", body) {
        const url = new URL(path, apiUrl).href;
        console.log("fetch", url, method);
        const headers = new Headers();
        if (body) {
            headers.append("Content-Type", "application/json");
        }
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorMessage = (await response.body()) || response.statusText;
            console.error(errorMessage);
            throw Error(errorMessage);
        }
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    const api = {
        async getAll() {
            return await apiRequest("todo");
        },
        async post(todo) {
            return await apiRequest("todo", "POST", todo);
        },
        async put(todo) {
            return await apiRequest(`todo/${todo.id}`, "PUT", todo);
        },
        async delete(todo) {
            return await apiRequest(`todo/${todo.id}`, "DELETE");
        },
        async moveto(todo, toTodo, insertAfter = false) {
            console.log(todo, toTodo);
            return await apiRequest(
                `todo/moveto/${todo.id}/${toTodo.id}?insertAfter=${insertAfter}`,
                "POST"
            );
        },
    };

    function Todo(text, created, done) {
        this.id = 0;
        this.text = text;
        this.created = created || new Date();
        this.done = !!done;
    }

    function withConsoleLogTodos(callback) {
        const result = callback();
        const logTodos = () => api.getAll().then((todos) => console.log(todos));
        if (result instanceof Promise) {
            result.then(logTodos);
        } else {
            setTimeout(logTodos);
        }
    }

    let todoListContainer = document.getElementById("todoList-container");
    api.getAll()
        .then((todos) => {
            todoListContainer.replaceChildren(createTodoList(todos));
        })
        .catch((err) => {
            todoListContainer.innerHTML = "";
            setAlert(err, "danger");
        });

    let todoAddForm = document.getElementById("todoList-form");
    todoAddForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const newTodo = new Todo(ev.target.elements.text.value);
        api.post(newTodo).then((todo) => {
            let todoList = document.getElementById("todoList");
            withDisablingUpDownButtons(todoList, () =>
                todoList.append(createTodoListItem(todo))
            );
        });
        ev.target.reset();
    });

    function createTodoList(todos) {
        let todoList = document.createElement("ol");
        todoList.id = "todoList";
        todoList.classList.add("list-group");
        todoList.classList.add("list-group-numbered");

        fillTodoListItems(todoList, todos);

        return todoList;
    }

    function fillTodoListItems(todoList, todos) {
        if (!todoList) todoList = document.getElementById("todoList");
        for (let todo of todos) {
            todoList.append(createTodoListItem(todo));
        }
        if (todoList.children.length > 0) {
            todoList.firstChild.querySelector(
                ".todo-button-up"
            ).disabled = true;
            todoList.lastChild.querySelector(
                ".todo-button-down"
            ).disabled = true;
        }
    }

    function createTodoListItem(todo) {
        let todoListItem = document.createElement("li");
        todoListItem.classList.add("todo");
        todoListItem.classList.add("list-group-item");
        todoListItem.todo = todo;

        todoListItem.append(createTodoListItemDone());
        todoListItem.append(createTodoListItemText());
        todoListItem.append(createTodoListItemsControls(todoListItem));
        todoListItem.append(createTodoListItemDate());

        makeListItemDraggable();

        return todoListItem;

        function createTodoListItemDate() {
            let todoDate = document.createElement("small");
            todoDate.classList.add("todo-created");
            todoDate.innerText = "Создано: " + todo.created.toLocaleString();
            return todoDate;
        }

        function createTodoListItemsControls(todoListItem) {
            let todoControls = document.createElement("div");
            todoControls.classList.add("todo-controls");
            todoControls.append(
                createIconButton(
                    "todo-button-up",
                    "caret-up",
                    "secondary",
                    () => moveupTodoListItem(todoListItem)
                )
            );
            todoControls.append(
                createIconButton(
                    "todo-button-down",
                    "caret-down",
                    "secondary",
                    () => movedownTodoListItem(todoListItem)
                )
            );
            todoControls.append(
                createIconButton(
                    "todo-button-remove",
                    "trash-fill",
                    "danger",
                    () => removeTodoListItem(todoListItem)
                )
            );
            return todoControls;
        }

        function createTodoListItemDone() {
            let todoCheckbox = document.createElement("input");
            todoCheckbox.classList.add("todo-done");
            todoCheckbox.type = "checkbox";
            todoCheckbox.checked = todo.done;
            todoCheckbox.addEventListener("change", (ev) => {
                todo.done = ev.target.checked;
                removeAlert();
                api.put(todo).catch((err) => setAlert(err));
            });
            return todoCheckbox;
        }

        function createTodoListItemText() {
            let todoText = document.createElement("p");
            todoText.classList.add("todo-text");
            todoText.innerText = todo.text;
            return todoText;
        }

        function createIconButton(className, iconName, color, onClick) {
            let button = document.createElement("button");
            button.classList.add(className);
            button.classList.add("btn");
            button.classList.add("btn-outline-" + color);
            button.classList.add("btn-sm");
            button.classList.add("bi");
            button.classList.add("bi-" + iconName);
            button.addEventListener("click", onClick);
            return button;
        }

        function makeListItemDraggable() {
            todoListItem.draggable = true;

            todoListItem.addEventListener("dragstart", (evt) => {
                evt.target.classList.add("dragging");
            });
            todoListItem.addEventListener("dragend", (evt) => {
                const draggingElement = evt.target;
                draggingElement.classList.remove("dragging");
                const dragTarget =
                    document.getElementsByClassName("drag-target")[0];
                // есть куда бросить
                if (!dragTarget || draggingElement === dragTarget) {
                    return;
                }
                if (prevTarget.classList.contains("after")) {
                    moveTodoListItemAfter(draggingElement, dragTarget);
                } else {
                    moveTodoListItemBefore(draggingElement, dragTarget);
                }
                dragTarget.classList.remove("drag-target");
                dragTarget.classList.remove("after");
                dragTarget.classList.remove("before");
            });
            todoListItem.addEventListener("dragover", (evt) => {
                evt.preventDefault();
                // можно перетаскивать только задачи
                if (!evt.target.classList.contains("todo")) {
                    return;
                }
                const dragTarget = evt.target;
                const prevTargets =
                    document.getElementsByClassName("drag-target");
                for (prevTarget of prevTargets) {
                    prevTarget.classList.remove("drag-target");
                    prevTarget.classList.remove("before");
                    prevTarget.classList.remove("after");
                }
                dragTarget.classList.add("drag-target");
                const dragTargetRect = dragTarget.getBoundingClientRect();
                const dragTargetMiddle =
                    (dragTargetRect.top + dragTargetRect.bottom) / 2;
                if (evt.clientY > dragTargetMiddle) {
                    dragTarget.classList.add("after");
                } else {
                    dragTarget.classList.add("before");
                }
            });
        }
    }

    function removeTodoListItem(todoListItem) {
        removeAlert();
        withConsoleLogTodos(() =>
            api
            .delete(todoListItem.todo)
            .then(
                withDisablingUpDownButtons(todoListItem.parentNode, () =>
                    todoListItem.remove()
                )
            )
            .catch((err) => {
                setAlert(err);
            })
        );
    }

    function moveupTodoListItem(todoListItem) {
        moveTodoListItemBefore(todoListItem);
    }

    function movedownTodoListItem(todoListItem) {
        moveTodoListItemAfter(todoListItem);
    }

    function moveTodoListItemBefore(todoListItem, beforeListItem) {
        removeAlert();
        if (!beforeListItem) {
            beforeListItem = todoListItem.previousSibling;
        }
        withConsoleLogTodos(() => {
            api.moveto(todoListItem.todo, beforeListItem.todo, false)
                .then(() => {
                    withDisablingUpDownButtons(todoListItem.parentNode, () =>
                        beforeListItem.before(todoListItem)
                    );
                })
                .catch((err) => {
                    setAlert(err);
                });
        });
    }

    function moveTodoListItemAfter(todoListItem, afterListItem) {
        removeAlert();
        if (!afterListItem) {
            afterListItem = todoListItem.nextSibling;
        }
        withConsoleLogTodos(() => {
            api.moveto(todoListItem.todo, afterListItem.todo, true)
                .then(() => {
                    withDisablingUpDownButtons(todoListItem.parentNode, () =>
                        afterListItem.after(todoListItem)
                    );
                })
                .catch((err) => {
                    setAlert(err);
                });
        });
    }

    function withDisablingUpDownButtons(todoList, callback) {
        todoList.firstChild.querySelector(".todo-button-up").disabled = false;
        todoList.lastChild.querySelector(".todo-button-down").disabled = false;

        callback();

        todoList.firstChild.querySelector(".todo-button-up").disabled = true;
        todoList.lastChild.querySelector(".todo-button-down").disabled = true;
    }

    function setAlert(content, color = "danger") {
        const alert = document.getElementById("alert");
        alert.className = "alert alert-" + color;
        alert.innerHTML = content;
    }

    function removeAlert() {
        const alert = document.getElementById("alert");
        alert.className = "";
        alert.innerHTML = "";
    }
});