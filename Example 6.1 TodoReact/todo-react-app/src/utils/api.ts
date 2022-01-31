import { Todo } from "../data/Todo";

const apiUrl = "https://localhost:5001/api/";

async function apiRequest<T>(
    path: string,
    method: string = "GET",
    body?: any
): Promise<T | null> {
    const url = new URL(path, apiUrl).href;
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
        const errorMessage = (await response.text()) || response.statusText;
        console.error(errorMessage);
        throw Error(errorMessage);
    }
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
}

export const todoApi = {
    async getAll(): Promise<Todo[]> {
        return await apiRequest<Todo[]>("todo").then((result) => result || []);
    },
    async post(todo: Todo): Promise<Todo | null> {
        return await apiRequest<Todo>("todo", "POST", todo);
    },
    async put(todo: Todo): Promise<null> {
        return await apiRequest<null>(`todo/${todo.id}`, "PUT", todo);
    },
    async delete(todo: Todo): Promise<Todo | null> {
        return await apiRequest<Todo>(`todo/${todo.id}`, "DELETE");
    },
    async moveto(todo: Todo, toTodo: Todo, insertAfter = false): Promise<null> {
        return await apiRequest<null>(
            `todo/moveto/${todo.id}/${toTodo.id}?insertAfter=${insertAfter}`,
            "POST"
        );
    },
};

export default apiRequest;
