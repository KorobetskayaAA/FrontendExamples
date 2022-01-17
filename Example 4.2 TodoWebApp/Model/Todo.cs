using System;

namespace Todo.Web.Model
{
    public class Todo 
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; }
        public bool Done { get; set; }

        public void UpdateFrom(Todo todo) 
        {
            Text = todo.Text;
            Created = todo.Created;
            Done = todo.Done;
        }
    }
}