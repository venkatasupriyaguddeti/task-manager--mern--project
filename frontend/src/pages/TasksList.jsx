import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasksApi, deleteTaskApi } from "../api/taskApi";
import TaskFilters from "../components/TaskFilters";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

export default function TasksList() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [query, setQuery] = useState({
    page: 1,
    limit: 9,
    status: "",
    priority: "",
    userId: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const params = {
        page: query.page,
        limit: query.limit,
        status: query.status || undefined,
        priority: query.priority || undefined,
        sortBy: query.sortBy,
        order: query.order,
        ...(isAdmin && query.userId ? { userId: query.userId } : {}),
      };

      const res = await fetchTasksApi(params);
      setTasks(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page]);

  const applyFilters = () => {
    setQuery((p) => ({ ...p, page: 1 })); // triggers load via page change
    // But page already 1 may not trigger; so call load explicitly:
    load();
  };

  const resetFilters = () => {
    const next = {
      page: 1,
      limit: 9,
      status: "",
      priority: "",
      userId: "",
      sortBy: "createdAt",
      order: "desc",
    };
    setQuery(next);
    // call load immediately
    setTimeout(() => load(), 0);
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    try {
      await deleteTaskApi(id);
      // reload current page
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="mb-0">Tasks</h3>
        <button className="btn btn-dark" onClick={() => navigate("/tasks/create")}>
          {isAdmin ? "Create / Assign Task" : "Create Task"}
        </button>
      </div>

      <TaskFilters
        isAdmin={isAdmin}
        value={query}
        onChange={setQuery}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {tasks.map((t) => (
          <div className="col-12 col-md-6 col-lg-4" key={t._id}>
            <TaskCard
              task={t}
              onView={() => navigate(`/tasks/${t._id}`)}
              onEdit={() => navigate(`/tasks/${t._id}/edit`)}
              onDelete={() => onDelete(t._id)}
            />
          </div>
        ))}
      </div>

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setQuery((p) => ({ ...p, page: newPage }))}
      />
    </div>
  );
}
