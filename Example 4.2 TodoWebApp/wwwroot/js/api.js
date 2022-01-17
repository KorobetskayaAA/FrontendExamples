const apiUrl = "https://localhost:5001/api/";

async function api(path, method = "GET", body) {
    const url = new URL(path, apiUrl).href;
    console.log("fetch", url, method);
    const response = await fetch(url, { method, body });
    if (!response.ok) {
        const errorMessage = (await response.body()) || response.statusText;
        console.error(errorMessage);
        throw Error(errorMessage);
    }
    return await response.json();
}

export const api = {
    async getAll() {
        return await api("todo");
    },
    async post(todo) {
        return await api("todo", "POST", todo);
    },
    async put(todo) {
        return await api(`todo/${todo.id}`, "PUT", todo);
    },
    async delete(todo) {
        return await api(`todo/${todo.id}`, "DELETE");
    },
};