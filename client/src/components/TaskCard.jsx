import React, { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  CheckIcon,
  CalendarIcon,
  TimeIcon,
  EditIcon,
  DeleteIcon,
  HighPriorityIcon,
  MediumPriorityIcon,
  LowPriorityIcon,
  CompletedIcon,
  PendingIcon,
} from "./Icons";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    dueTime: task.dueTime || "",
  });
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch(`/tasks/${task._id}/toggle`);
      onUpdate(data.task);
      toast.success(
        data.task.status === "completed"
          ? "Task marked as complete!"
          : "Task marked as pending",
      );
    } catch {
      toast.error("Failed to update task");
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async () => {
    if (!editData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editData.dueDate) {
      toast.error("Due date is required");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put(`/tasks/${task._id}`, editData);
      onUpdate(data.task);
      setEditing(false);
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
      setDeleting(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) => {
    const date = new Date(d);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <HighPriorityIcon />;
      case "medium":
        return <MediumPriorityIcon />;
      case "low":
        return <LowPriorityIcon />;
      default:
        return <MediumPriorityIcon />;
    }
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Task</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Enter task title"
              autoFocus
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Enter task description (optional)"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData((p) => ({ ...p, priority: e.target.value }))
              }
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700 font-medium"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, dueDate: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Time
              </label>
              <input
                type="time"
                value={editData.dueTime}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, dueTime: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
        task.status === "completed"
          ? "border-green-200 opacity-75"
          : "border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={!toggling ? handleToggle : undefined}
            disabled={toggling}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              task.status === "completed"
                ? "bg-green-500 border-green-500"
                : "border-slate-300 hover:border-green-500"
            }`}
            title={
              task.status === "completed"
                ? "Mark as pending"
                : "Mark as complete"
            }
          >
            {task.status === "completed" && (
              <span className="text-white w-4 h-4">
                <CheckIcon />
              </span>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-bold mb-2 break-words transition-all ${
                task.status === "completed"
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                {task.description}
              </p>
            )}

            {/* Due Date Section */}
            {task.dueDate && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-semibold text-blue-700">
                  Due: {formatDate(task.dueDate)}
                  {task.dueTime && ` at ${task.dueTime}`}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {formatDate(task.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <TimeIcon />
                {formatTime(task.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {task.status === "completed" ? (
                  <>
                    <span className="w-4 h-4 text-green-600">
                      <CheckIcon />
                    </span>
                    Complete
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 text-amber-600">
                      <TimeIcon />
                    </span>
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with priority and actions */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(
            task.priority,
          )}`}
        >
          <span className="w-3 h-3">{getPriorityIcon(task.priority)}</span>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={!toggling ? handleToggle : undefined}
            disabled={toggling}
            className={`px-3 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-1 ${
              task.status === "completed"
                ? "hover:bg-amber-50 text-amber-600"
                : "hover:bg-green-50 text-green-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              task.status === "completed"
                ? "Mark as pending"
                : "Mark as completed"
            }
          >
            <span className="w-4 h-4">
              {task.status === "completed" ? (
                <PendingIcon />
              ) : (
                <CompletedIcon />
              )}
            </span>
            {task.status === "completed" ? "Pending" : "Complete"}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-all hover:scale-105 flex items-center gap-1"
            title="Edit task"
          >
            <span className="w-4 h-4">
              <EditIcon />
            </span>
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            title="Delete task"
          >
            <span className="w-4 h-4">
              <DeleteIcon />
            </span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
