'use client';

import { useEffect, useState } from 'react';
import { Task, Stats, getTasks, getStats, createTask, deleteTask } from '@/lib/api';
import StatsBar from '@/components/StatsBar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ notStarted: 0, inProgress: 0, totalEstimate: 0 });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [t, s] = await Promise.all([getTasks(), getStats()]);
    setTasks(t);
    setStats(s);
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
    load();
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + New Task
        </button>
      </div>

      <StatsBar stats={stats} />

      {showForm && (
        <div className="mb-6">
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-12">No tasks yet. Create one!</p>
        )}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </main>
  );
}