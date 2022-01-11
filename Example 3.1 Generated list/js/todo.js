/* Рефакторинг можно еще продолжить, но в целом методы стали короткими и отвечают принципу единой ответственности.
 * Обратите внимание на функции with
 */
window.addEventListener("load", () => {
    let todos = {
        data: [{
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
        ],

        add(todo) {
            this.data.push(todo);
        },

        remove(todo) {
            this.data.filter((td) => td !== todo);
        },

        moveUp(todo) {
            const indexofTodo = this.data.indexOf(todo);
            if (indexofTodo <= 0) return;
            this.data[indexofTodo] = this.data[indexofTodo - 1];
            this.data[indexofTodo - 1] = todo;
        },

        moveDown(todo) {
            const indexofTodo = this.data.indexOf(todo);
            if (indexofTodo < 0 || indexofTodo >= this.data.length - 1) return;
            this.data[indexofTodo] = this.data[indexofTodo + 1];
            this.data[indexofTodo + 1] = todo;
        },
    };

    function withConsoleLogTodos(callback) {
        callback();
        console.log(todos.data);
    }

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
        todos.add(newItem);
        let todoList = document.getElementById("todoList");
        withDisablingUpDownButtons(todoList, () =>
            todoList.append(createTodoListItem(newItem))
        );
        ev.target.reset();
    });

    function createTodoList() {
        let todoList = document.createElement("ol");
        todoList.id = "todoList";
        todoList.classList.add("list-group");
        todoList.classList.add("list-group-numbered");

        fillTodoListItems(todoList);

        return todoList;
    }

    function fillTodoListItems(todoList) {
        if (!todoList) todoList = document.getElementById("todoList");
        for (let todo of todos.data) {
            todoList.append(createTodoListItem(todo));
        }
        todoList.firstChild.querySelector(".todo-button-up").disabled = true;
        todoList.lastChild.querySelector(".todo-button-down").disabled = true;
    }

    function createTodoListItem(todo) {
        let todoListItem = document.createElement("li");
        todoListItem.classList.add("todo");
        todoListItem.classList.add("list-group-item");

        todoListItem.append(createTodoListItemDone());
        todoListItem.append(createTodoListItemText());
        todoListItem.append(createTodoListItemsControls(todoListItem));
        todoListItem.append(createTodoListItemDate());

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
                    () => moveupTodoListItem(todo, todoListItem)
                )
            );
            todoControls.append(
                createIconButton(
                    "todo-button-down",
                    "caret-down",
                    "secondary",
                    () => movedownTodoListItem(todo, todoListItem)
                )
            );
            todoControls.append(
                createIconButton(
                    "todo-button-remove",
                    "trash-fill",
                    "danger",
                    () => removeTodoListItem(todo, todoListItem)
                )
            );
            return todoControls;
        }

        function createTodoListItemDone() {
            let todoCheckbox = document.createElement("input");
            todoCheckbox.classList.add("todo-done");
            todoCheckbox.type = "checkbox";
            todoCheckbox.checked = todo.done;
            todoCheckbox.addEventListener(
                "change",
                (ev) => (todo.done = ev.target.checked)
            );
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
    }

    function removeTodoListItem(todo, todoListItem) {
        withConsoleLogTodos(() => todos.remove(todo));
        withDisablingUpDownButtons(todoListItem.parentNode, () =>
            todoListItem.remove()
        );
    }

    function moveupTodoListItem(todo, todoListItem) {
        withConsoleLogTodos(() => todos.moveUp(todo));
        withDisablingUpDownButtons(todoListItem.parentNode, () =>
            todoListItem.previousSibling.before(todoListItem)
        );
    }

    function movedownTodoListItem(todo, todoListItem) {
        withConsoleLogTodos(() => todos.moveDown(todo));
        withDisablingUpDownButtons(todoListItem.parentNode, () =>
            todoListItem.nextSibling.after(todoListItem)
        );
    }

    function withDisablingUpDownButtons(todoList, callback) {
        todoList.firstChild.querySelector(".todo-button-up").disabled = false;
        todoList.lastChild.querySelector(".todo-button-down").disabled = false;

        callback();

        todoList.firstChild.querySelector(".todo-button-up").disabled = true;
        todoList.lastChild.querySelector(".todo-button-down").disabled = true;
    }
});