'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, getTask, updateTask, deleteTask, createTask } from '@/lib/api';
import SubtaskTree from '@/components/SubtaskTree';
import TaskForm from '@/components/TaskForm';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
};

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);

  const load = async () => {
    const t = await getTask(id);
    setTask(t);
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (data: Partial<Task>) => {
    await updateTask(id, data);
    setEditing(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta tarea y todas sus subtareas?')) return;
    await deleteTask(id);
    router.push('/');
  };

  const handleAddSubtask = async (data: Parameters<typeof createTask>[0]) => {
    await createTask({ ...data, parent_id: id });
    setAddingSubtask(false);
    load();
  };

  if (!task) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
        ← Back
      </button>

      {editing ? (
        <TaskForm initial={task} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      ) : (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-800">{task.title}</h1>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(true)} className="text-sm text-blue-500 hover:text-blue-700">
                Edit
              </button>
              <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600">
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mt-3 text-sm">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.estimate !== null && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">
                {task.estimate} pts
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-700">Subtasks</h2>
          <button
            onClick={() => setAddingSubtask(v => !v)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            + Add Subtask
          </button>
        </div>

        {addingSubtask && (
          <div className="mb-4">
            <TaskForm onSubmit={handleAddSubtask} onCancel={() => setAddingSubtask(false)} />
          </div>
        )}

        <SubtaskTree subtasks={task.subtasks ?? []} />
      </div>
    </main>
  );
}