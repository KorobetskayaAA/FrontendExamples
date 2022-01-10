/* !Пример требуе рефакторинга!
 * Нужно выделить функции и распутать зависимости DOM.
 * Однако, он демонстрирует возможности выборки элементов в дереве DOM.
 */
window.addEventListener("load", () => {
    let todos = [{
            text: "Переработать слайды к лекции по управлению DOM",
            created: new Date(2022, 1, 8, 10, 15),
            done: true,
        },
        {
            text: "Приготовить пример для лекции по управлению DOM",
            created: new Date(2022, 1, 9, 23, 59),
            done: true,
        },
        {
            text: "Отрефакторить пример для лекции по управлению DOM",
            created: new Date(2022, 1, 10, 12, 00),
            done: false,
        },
    ];

    let todoListContainer = document.getElementById("todoList-container");
    todoListContainer.append(createTodoList());

    let todoAddForm = document.getElementById("todoList-form");
    todoAddForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const newItem = {
            text: ev.target.elements.text.value,
            created: new Date(),
            done: false,
        };
        todos.push(newItem);
        todoListContainer.firstChild.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = false;
        todoListContainer.firstChild.append(createTodoListItem(newItem));
        todoListContainer.firstChild.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = true;
        ev.target.reset();
    });

    function createTodoList() {
        let todoList = document.createElement("ol");
        todoList.classList.add("list-group");
        todoList.classList.add("list-group-numbered");

        for (let todo of todos) {
            todoList.append(createTodoListItem(todo));
        }

        todoList.firstChild.querySelector(".todo-button-up").disabled = true;
        todoList.lastChild.querySelector(".todo-button-down").disabled = true;

        return todoList;
    }

    function createTodoListItem(todo) {
        let todoListItem = document.createElement("li");
        todoListItem.classList.add("todo");
        todoListItem.classList.add("list-group-item");

        let todoText = document.createElement("p");
        todoText.classList.add("todo-text");
        todoText.innerText = todo.text;
        todoListItem.append(todoText);

        let todoCheckbox = document.createElement("input");
        todoCheckbox.classList.add("todo-done");
        todoCheckbox.type = "checkbox";
        todoCheckbox.checked = todo.done;
        todoCheckbox.addEventListener(
            "change",
            (ev) => (todo.done = ev.target.checked)
        );
        todoListItem.prepend(todoCheckbox);

        let todoControls = document.createElement("div");
        todoControls.classList.add("todo-controls");

        let todoMoveupButton = document.createElement("button");
        todoMoveupButton.classList.add("todo-button-up");
        todoMoveupButton.classList.add("btn");
        todoMoveupButton.classList.add("btn-outline-secondary");
        todoMoveupButton.classList.add("btn-sm");
        todoMoveupButton.classList.add("bi");
        todoMoveupButton.classList.add("bi-caret-up");
        todoMoveupButton.addEventListener("click", () =>
            moveupTodoListItem(todo, todoListItem)
        );

        let todoMovedownButton = document.createElement("button");
        todoMovedownButton.classList.add("todo-button-down");
        todoMovedownButton.classList.add("btn");
        todoMovedownButton.classList.add("btn-outline-secondary");
        todoMovedownButton.classList.add("btn-sm");
        todoMovedownButton.classList.add("bi");
        todoMovedownButton.classList.add("bi-caret-down");
        todoMovedownButton.addEventListener("click", () =>
            movedownTodoListItem(todo, todoListItem)
        );

        let todoRemoveButton = document.createElement("button");
        todoRemoveButton.classList.add("todo-button-remove");
        todoRemoveButton.classList.add("btn");
        todoRemoveButton.classList.add("btn-outline-danger");
        todoRemoveButton.classList.add("btn-sm");
        todoRemoveButton.classList.add("bi");
        todoRemoveButton.classList.add("bi-trash-fill");
        todoRemoveButton.addEventListener("click", () =>
            removeTodoListItem(todo, todoListItem)
        );

        todoControls.append(todoMoveupButton);
        todoControls.append(todoMovedownButton);
        todoControls.append(todoRemoveButton);

        todoListItem.append(todoControls);

        let todoDate = document.createElement("small");
        todoDate.classList.add("todo-created");
        todoDate.innerText = "Создано: " + todo.created.toLocaleString();
        todoListItem.append(todoDate);

        return todoListItem;
    }

    function removeTodoListItem(todo, todoListItem) {
        todos = todos.filter((td) => td !== todo);
        console.log(todos);
        todoListItem.remove();
    }

    function moveupTodoListItem(todo, todoListItem) {
        const indexofTodo = todos.indexOf(todo);
        if (indexofTodo <= 0) return;
        todos[indexofTodo] = todos[indexofTodo - 1];
        todos[indexofTodo - 1] = todo;
        console.log(todos);

        todoListItem.parentNode.firstChild.querySelector(
            ".todo-button-up"
        ).disabled = false;
        todoListItem.parentNode.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = false;
        todoListItem.parentNode.insertBefore(
            todoListItem,
            todoListItem.previousSibling
        );
        todoListItem.parentNode.firstChild.querySelector(
            ".todo-button-up"
        ).disabled = true;
        todoListItem.parentNode.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = true;
    }

    function movedownTodoListItem(todo, todoListItem) {
        const indexofTodo = todos.indexOf(todo);
        if (indexofTodo < 0 || indexofTodo >= todos.length - 1) return;
        todos[indexofTodo] = todos[indexofTodo + 1];
        todos[indexofTodo + 1] = todo;
        console.log(todos);

        todoListItem.parentNode.firstChild.querySelector(
            ".todo-button-up"
        ).disabled = false;
        todoListItem.parentNode.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = false;
        if (indexofTodo === todos.length - 2) {
            todoListItem.parentNode.append(todoListItem);
        } else {
            todoListItem.parentNode.insertBefore(
                todoListItem,
                todoListItem.nextSibling.nextSibling
            );
        }
        todoListItem.parentNode.firstChild.querySelector(
            ".todo-button-up"
        ).disabled = true;
        todoListItem.parentNode.lastChild.querySelector(
            ".todo-button-down"
        ).disabled = true;
    }
});