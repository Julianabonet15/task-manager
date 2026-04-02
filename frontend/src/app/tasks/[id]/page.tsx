'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, getTask, updateTask, deleteTask, createTask } from '@/lib/api';
import SubtaskTree from '@/components/SubtaskTree';
import TaskForm from '@/components/TaskForm';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-600',
};

const priorityBorder: Record<string, string> = {
  low: 'border-l-4 border-gray-300',
  medium: 'border-l-4 border-yellow-400',
  high: 'border-l-4 border-orange-400',
  critical: 'border-l-4 border-red-500',
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

  if (!task) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-gray-400 text-center">
        <p className="text-4xl mb-2">⏳</p>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-[#0052CC] transition-colors mb-6 flex items-center gap-1">
        ← Back to Board
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {editing ? (
            <TaskForm initial={task} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
          ) : (
            <div className={`bg-white rounded-xl shadow-sm p-6 ${priorityBorder[task.priority]}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl font-bold text-[#172b4d]">{task.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 text-xs font-medium text-[#0052CC] border border-[#0052CC] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                  {task.status.replace(/_/g, ' ')}
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

              <div className="text-xs text-gray-400 border-t pt-3 flex gap-4">
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#172b4d] uppercase tracking-wide">Subtasks</h2>
            <button
              onClick={() => setAddingSubtask(v => !v)}
              className="text-xs text-[#0052CC] hover:text-[#0065FF] font-medium"
            >
              + Add
            </button>
          </div>

          {addingSubtask && (
            <div className="mb-4">
              <TaskForm onSubmit={handleAddSubtask} onCancel={() => setAddingSubtask(false)} />
            </div>
          )}

          <SubtaskTree subtasks={task.subtasks ?? []} />
        </div>
      </div>
    </div>
  );
}