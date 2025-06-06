import { useEffect, useState } from 'react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    // Initial fetch
    fetchTasks();

    // Listen for realtime changes
    const channel = supabase
      .channel('tasks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(
        (data || []).map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description ?? undefined,
          completed: t.completed,
          dueDate: t.due_date ? new Date(t.due_date) : undefined,
          priority: t.priority as Task['priority'],
          createdAt: new Date(t.created_at),
        }))
      );
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('tasks').insert([
        {
          title: newTask.title,
          description: newTask.description ?? null,
          completed: newTask.completed,
          due_date: newTask.dueDate ? newTask.dueDate.toISOString() : null,
          priority: newTask.priority,
          user_id: userId,
        },
      ]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description ?? null,
          completed: updates.completed,
          due_date: updates.dueDate ? updates.dueDate.toISOString() : null,
          priority: updates.priority,
        })
        .eq('id', taskId)
        .eq('user_id', userId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
  };
}