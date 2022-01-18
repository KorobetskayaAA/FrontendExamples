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

export const todoApi = {
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

export function Todo(text, created, done) {
    this.id = 0;
    this.text = text;
    this.created = created || new Date();
    this.done = !!done;
}

export default apiRequest;
