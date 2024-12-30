export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface TaskSuggestion {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}