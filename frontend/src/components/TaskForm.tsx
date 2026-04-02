'use client';

import { useState } from 'react';
import { CreateTaskDto, UpdateTaskDto, Status, Priority, Task } from '@/lib/api';

type FormData = CreateTaskDto & UpdateTaskDto;

interface TaskFormProps {
  initial?: Task;
  parentId?: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function TaskForm({ initial, parentId, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<FormData>({
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
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <textarea
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        placeholder="Description (optional)"
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <div className="grid grid-cols-3 gap-3">
        <select name="status" value={form.status} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
        <select name="priority" value={form.priority} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
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
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}