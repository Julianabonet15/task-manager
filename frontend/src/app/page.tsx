'use client';

import { useEffect, useState } from 'react';
import { Task, Stats, getTasks, getStats, createTask, deleteTask, updateTask } from '@/lib/api';
import StatsBar from '@/components/StatsBar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import SubtaskTree from '@/components/SubtaskTree';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-500',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-400',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-400',
  medium: 'bg-orange-100 text-orange-400',
  high: 'bg-pink-100 text-pink-500',
  critical: 'bg-red-100 text-red-400',
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ notStarted: 0, inProgress: 0, inReview: 0, done: 0, blocked: 0 });
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [editingSelected, setEditingSelected] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);

  const load = async () => {
    const [t, s] = await Promise.all([getTasks(), getStats()]);
    setTasks(t);
    setStats(s);
    if (selected) {
      const updated = t.find(task => task.id === selected.id);
      if (updated) setSelected(updated);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Parameters<typeof createTask>[0]) => {
    await createTask(data);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await deleteTask(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!selected) return;
    await updateTask(selected.id, data);
    setEditingSelected(false);
    load();
  };

  const handleAddSubtask = async (data: Parameters<typeof createTask>[0]) => {
    if (!selected) return;
    await createTask({ ...data, parent_id: selected.id });
    setAddingSubtask(false);
    // reload selected with subtasks
    const { getTask } = await import('@/lib/api');
    const updated = await getTask(selected.id);
    setSelected(updated);
    load();
  };

  const handleSelectTask = async (task: Task) => {
    const { getTask } = await import('@/lib/api');
    const full = await getTask(task.id);
    setSelected(full);
    setEditingSelected(false);
    setAddingSubtask(false);
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Main */}
      <div className={`flex-1 overflow-auto p-8 transition-all duration-300 ${selected ? 'mr-[400px]' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Tasks</h1>
              <p className="text-xs text-gray-400 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
            </div>
            <button
              onClick={() => setShowForm(v => !v)}
              className="px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add Task
            </button>
          </div>

          <StatsBar stats={stats} />

          {showForm && (
            <div className="mb-4">
              <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg text-center py-16 text-gray-400">
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full group">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Estimate</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDelete}
                      onClick={handleSelectTask}
                      selected={selected?.id === task.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      {selected && (
        <div className="fixed right-0 top-[57px] w-[400px] h-[calc(100vh-57px)] bg-white border-l border-gray-200 overflow-auto shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Task Details</span>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg">✕</button>
            </div>

            {editingSelected ? (
              <TaskForm initial={selected} onSubmit={handleUpdate} onCancel={() => setEditingSelected(false)} />
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-2">{selected.title}</h2>
                {selected.description && (
                  <p className="text-sm text-gray-500 mb-4">{selected.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[selected.status]}`}>
                    {selected.status.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[selected.priority]}`}>
                    {selected.priority}
                  </span>
                  {selected.estimate !== null && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                      {selected.estimate} pts
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 mb-5">
                  Created: {new Date(selected.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setEditingSelected(true)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtasks</span>
                    <button
                      onClick={() => setAddingSubtask(v => !v)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      + Add
                    </button>
                  </div>
                  {addingSubtask && (
                    <div className="mb-3">
                      <TaskForm onSubmit={handleAddSubtask} onCancel={() => setAddingSubtask(false)} />
                    </div>
                  )}
                  <SubtaskTree subtasks={selected.subtasks ?? []} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}