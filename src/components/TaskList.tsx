import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Clock, Trash2, Edit2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
            task.priority === 'high'
              ? 'border-red-500'
              : task.priority === 'medium'
              ? 'border-yellow-500'
              : 'border-green-500'
          } transform transition-all hover:scale-[1.02] hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={`${
                  task.completed ? 'text-green-500' : 'text-gray-400'
                } hover:text-green-600 transition-colors`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                )}
                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(task.dueDate).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditTask(task)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}