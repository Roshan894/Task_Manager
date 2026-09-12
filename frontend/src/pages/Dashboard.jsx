import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch {
      navigate("/login");
    }
  };

  const getTasks = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search;
      }

      if (status !== "all") {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      const response = await api.get("/tasks", {
        params,
      });

      setTasks(response.data);
      setError("");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getTasks();
    }
  }, [user, search, status, priority]);

  const createTask = async (task) => {
    try {
      await api.post("/tasks", task);

      getTasks();
    } catch {
      setError("Unable to create task.");
    }
  };

  const toggleTask = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      getTasks();
    } catch {
      setError("Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);

      getTasks();
    } catch {
      setError("Unable to delete task.");
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="app">
      <Navbar user={user} />

      <main className="dashboard">
        <section className="welcome">
          <div>
            <p className="small-heading">
              YOUR WORKSPACE
            </p>

            <h1>
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>

            <p>
              Keep track of your tasks and get things
              done.
            </p>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </section>

        <TaskForm onCreate={createTask} />

        <section className="filters">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">
              Completed
            </option>
          </select>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="tasks-section">
          <div className="section-title">
            <h2>My Tasks</h2>
            <span>{tasks.length} tasks</span>
          </div>

          {loading ? (
            <div className="empty-box">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-box">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>
                Add your first task using the form
                above.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;