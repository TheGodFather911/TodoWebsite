import React from 'react';

interface TaskFiltersProps {
  statusFilter: 'all' | 'active' | 'completed';
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  searchQuery: string;
  onStatusChange: (status: 'all' | 'active' | 'completed') => void;
  onPriorityChange: (priority: 'all' | 'low' | 'medium' | 'high') => void;
  onSearchChange: (query: string) => void;
}

export function TaskFilters({
  statusFilter,
  priorityFilter,
  searchQuery,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center space-x-2 mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as 'all' | 'active' | 'completed')}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}
