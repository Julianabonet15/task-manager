'use client';

import { useState } from 'react';
import { Status, Priority, Task, TaskFormData } from '@/lib/api';

interface TaskFormProps {
  initial?: Task;
  parentId?: string;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ initial, parentId, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'not_started',
    priority: initial?.priority ?? 'medium',
    estimate: initial?.estimate ?? undefined,
    parent_id: parentId ?? initial?.parent_id ?? undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'estimate' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
            {initial ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onCancel} className="text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-lg">✕</button>
        </div>
        <FormFields form={form} handleChange={handleChange} />
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 text-xs bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
          >
            {initial ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormFields({
  form,
  handleChange,
}: {
  form: TaskFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-3">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
      />
      <textarea
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        placeholder="Description (optional)"
        rows={3}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500 resize-none"
      />
      <div className="grid grid-cols-3 gap-2">
        <select name="status" value={form.status} onChange={handleChange} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none">
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
        <select name="priority" value={form.priority} onChange={handleChange} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input
          name="estimate"
          type="number"
          min={0}
          value={form.estimate ?? ''}
          onChange={handleChange}
          placeholder="Estimate"
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none"
        />
      </div>
    </div>
  );
}
