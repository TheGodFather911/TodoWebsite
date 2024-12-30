import React, { useState, useEffect } from 'react';
import { Task } from './types';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { CheckCircle2, ListTodo } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkTaskReminders = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.dueDate &&
          !task.completed &&
          Math.abs(new Date(task.dueDate).getTime() - now.getTime()) < 1000
        ) {
          new Notification('Task Reminder', {
            body: `Time to do: ${task.title}`,
            icon: '/notification-icon.png'
          });
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play();
        }
      });
    }, 1000);

    return () => clearInterval(checkTaskReminders);
  }, [tasks]);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, task]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === editedTask.id ? editedTask : task))
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <ListTodo className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-lg font-medium text-gray-600">
                  {tasks.filter((t) => t.completed).length}/{tasks.length} Done
                </span>
              </div>
            </div>
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="space-y-6">
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;