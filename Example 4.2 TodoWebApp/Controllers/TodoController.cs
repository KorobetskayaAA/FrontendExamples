using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace Todo.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        static readonly List<Model.Todo> todos = new List<Model.Todo>() {
            new Model.Todo() {
                Id = 1,
                Text = "Переработать слайды к лекции по управлению DOM",
                Created = new DateTime(2022, 1, 8, 10, 15, 0),
                Done = true
            },
            new Model.Todo() {
                Id = 2,
                Text = "Приготовить пример для лекции по управлению DOM",
                Created = new DateTime(2022, 1, 9, 23, 59, 0),
                Done = true
            },
            new Model.Todo() {
                Id = 3,
                Text = "Отрефакторить пример для лекции по управлению DOM",
                Created = new DateTime(2022, 1, 10, 12, 0, 0),
                Done = false
            }
        };
        static int nextId = todos.Count()  + 1;

        public TodoController() : base() { }

        [HttpGet]
        public IEnumerable<Model.Todo> GetAll()
        {
            return todos;
        }

        [HttpGet("{id}")]
        public Model.Todo Get(int id)
        {
            return todos.FirstOrDefault(td => td.Id == id);
        }

        [HttpPost]
        public Model.Todo Post([FromBody] Model.Todo todo)
        {
            todo.Id = nextId++;
            todos.Add(todo);
            return todo;
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Model.Todo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest("Неверный id задачи");
            }
            var existingTodo = todos.FirstOrDefault(td => td.Id == id);
            if (existingTodo == null)
            {
                return NotFound("Задача не найдена");
            }
            existingTodo.UpdateFrom(todo);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var todo = todos.FirstOrDefault(td => td.Id == id);
            if (todo == null)
            {
                return NotFound("Задача не найдена");
            }
            todos.Remove(todo);
            return Ok(todo);
        }

        [HttpPost("moveto/{id}/{toId}")]
        public ActionResult MoveTo(int id, int toId, bool insertAfter = false)
        {
            if (id == toId)
            {
                return Ok("same");
            }
            var todo = todos.FirstOrDefault(td => td.Id == id);
            if (todo == null)
            {
                return NotFound("Задача не найдена");
            }
            var toTodo = todos.FirstOrDefault(td => td.Id == toId);
            if (toTodo == null)
            {
                return NotFound("Задача не найдена");
            }
            todos.Remove(todo);
            int index = todos.IndexOf(toTodo);
            if (insertAfter)
            {
                index++;
            }
            if (index != todos.IndexOf(todo))
            {
                todos.Insert(index, todo);
            }
            return Ok(index);
        }
    }
}