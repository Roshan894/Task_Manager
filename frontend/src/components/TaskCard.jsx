function TaskCard({
  task,
  onToggle,
  onDelete,
}) {
  return (
    <div
      className={`task-card ${
        task.completed ? "task-completed" : ""
      }`}
    >
      <div className="task-main">
        <button
          className={`check-button ${
            task.completed ? "checked" : ""
          }`}
          onClick={() => onToggle(task)}
          aria-label="Toggle task"
        >
          {task.completed ? "✓" : ""}
        </button>

        <div className="task-details">
          <h3>{task.title}</h3>

          {task.description && (
            <p>{task.description}</p>
          )}

          <div className="task-meta">
            <span
              className={`priority ${task.priority}`}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <span>
                Due{" "}
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        className="delete-button"
        onClick={() => onDelete(task._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;