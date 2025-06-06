import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Plus, Calendar, Check, X } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editingTask?: Task | null;
  onUpdateTask?: (task: Task) => void;
  onCancelEdit?: () => void;
}

export function TaskForm({
  onAddTask,
  editingTask,
  onUpdateTask,
  onCancelEdit,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().slice(0, 16)
          : ''
      );
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      });
    }

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            {editingTask ? (
              <>
                <Check className="w-5 h-5" />
                <span>Save Task</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </>
            )}
          </button>
          {editingTask && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}