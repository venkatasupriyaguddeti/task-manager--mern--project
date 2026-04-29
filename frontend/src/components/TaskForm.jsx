import React, { useState } from "react";

export default function TaskForm({
  initialValues,
  isAdmin,
  onSubmit,
  onBack,
  submitLabel,
}) {
  const [form, setForm] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    status: initialValues.status || "pending",
    priority: initialValues.priority || "medium",
    dueDate: initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : "",
    userId: initialValues.userId || "",
  });

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? form.dueDate : null,
      ...(isAdmin && form.userId ? { userId: form.userId } : {}),
    };
    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={change}
                minLength={2}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={change}
                rows={3}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={change}>
                <option value="pending">pending</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={change}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Due Date</label>
              <input className="form-control" name="dueDate" type="date" value={form.dueDate} onChange={change} />
            </div>

            {isAdmin && (
              <div className="col-12">
                <label className="form-label">Assign to userId (optional)</label>
                <input
                  className="form-control"
                  name="userId"
                  value={form.userId}
                  onChange={change}
                  placeholder="Paste userId to assign"
                />
                <div className="form-text">
                  Leave empty to assign to yourself (backend default).
                </div>
              </div>
            )}

            <div className="col-12 d-flex gap-2 mt-2">
              <button className="btn btn-dark" type="submit">
                {submitLabel}
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={onBack}>
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
