import { useState } from "react";

function TaskForm({ onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    await onCreate(form);

    setForm({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Add a description..."
      />

      <div className="form-options">
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low priority</option>
          <option value="medium">
            Medium priority
          </option>
          <option value="high">High priority</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button type="submit">
          + Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;