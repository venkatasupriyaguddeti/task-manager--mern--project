import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTaskByIdApi } from "../api/taskApi";
import { formatDate, formatDateTime } from "../utils/format";
import { useAuth } from "../context/AuthContext";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await fetchTaskByIdApi(id);
      setTask(res.data);
    } catch (err) {
      // ownership / not found → NotFound as per requirement
      navigate("/not-found", { replace: true });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!task && !error) return null;

  const assigned = task?.userId && typeof task.userId === "object" ? task.userId : null;

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h3 className="mb-3">Task Details</h3>

        <div className="mb-2">
          <strong>Title:</strong> {task.title}
        </div>

        <div className="mb-2">
          <strong>Description:</strong> {task.description || "-"}
        </div>

        <div className="mb-2">
          <strong>Status:</strong> {task.status}
        </div>

        <div className="mb-2">
          <strong>Priority:</strong> {task.priority}
        </div>

        <div className="mb-2">
          <strong>Due Date:</strong> {formatDate(task.dueDate)}
        </div>

        <div className="mb-2">
          <strong>Created At:</strong> {formatDateTime(task.createdAt)}
        </div>

        <div className="mb-2">
          <strong>Updated At:</strong> {formatDateTime(task.updatedAt)}
        </div>

        {isAdmin && assigned && (
          <div className="mt-3 p-3 border rounded bg-light">
            <div className="fw-semibold mb-1">Assigned To</div>
            <div>
              {assigned.name} — <span className="text-muted">{assigned.email}</span>
            </div>
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-outline-secondary" onClick={() => navigate("/tasks")}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/tasks/${id}/edit`)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
