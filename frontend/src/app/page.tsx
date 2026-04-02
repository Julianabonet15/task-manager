'use client';

import { useEffect, useState } from 'react';
import { Task, Stats, TaskFormData, getTasks, getStats, createTask, deleteTask, updateTask, Priority, Status } from '@/lib/api';
import StatsBar from '@/components/StatsBar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import SubtaskTree from '@/components/SubtaskTree';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  in_progress: 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300',
  in_review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  done: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  blocked: 'bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-300',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400',
  medium: 'bg-orange-100 text-orange-400 dark:bg-orange-900 dark:text-orange-300',
  high: 'bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300',
  critical: 'bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-300',
};

const statusOptions: Status[] = ['not_started', 'in_progress', 'in_review', 'done', 'blocked'];
const priorityOptions: Priority[] = ['low', 'medium', 'high', 'critical'];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ notStarted: 0, inProgress: 0, inReview: 0, done: 0, blocked: 0 });
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [editingSelected, setEditingSelected] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showPanelStatusMenu, setShowPanelStatusMenu] = useState(false);
  const [showPanelPriorityMenu, setShowPanelPriorityMenu] = useState(false);

  const filteredTasks = tasks
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

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

  const handleCreate = async (data: TaskFormData) => {
    const createPayload = {
      title: data.title,
      description: data.description ?? undefined,
      status: data.status,
      priority: data.priority,
      estimate: data.estimate ?? undefined,
      parent_id: data.parent_id,
    };

    await createTask(createPayload);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const handleUpdate = async (data: TaskFormData) => {
    if (!selected) return;
    const updatePayload = {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      estimate: data.estimate ?? null,
    };

    await updateTask(selected.id, updatePayload);
    setEditingSelected(false);
    load();
  };

  const handleAddSubtask = async (data: TaskFormData) => {
    if (!selected) return;
    await createTask({
      title: data.title,
      description: data.description ?? undefined,
      status: data.status,
      priority: data.priority,
      estimate: data.estimate ?? undefined,
      parent_id: selected.id,
    });
    setAddingSubtask(false);
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
      <div className={`flex-1 overflow-auto px-4 py-6 transition-all duration-300 ${selected ? 'sm:mr-[400px]' : ''}`}>
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tasks</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
            </div>
            <button
              onClick={() => setShowForm(v => !v)}
              className="px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
            >
              + Add Task
            </button>
          </div>

          <StatsBar stats={stats} />

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 bg-white dark:bg-gray-800"
            />
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(v => !v)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 h-full"
              >
                {filterStatus === 'all' ? 'All Status' : filterStatus.replace(/_/g, ' ')}
                <span className="text-gray-400">▾</span>
              </button>
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 top-10 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={() => { setFilterStatus('all'); setShowFilterMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${filterStatus === 'all' ? 'font-medium' : ''}`}
                    >
                      All Status
                    </button>
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => { setFilterStatus(s); setShowFilterMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 ${s === filterStatus ? 'font-medium' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-full inline-block ${statusStyles[s].split(' ')[0]}`} />
                        {s.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {showForm && (
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          )}

          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center py-16 text-gray-400">
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-visible">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide w-32">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide w-28">Priority</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Estimate</th>
                    <th className="hidden sm:table-cell w-8" />
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDelete}
                      onClick={handleSelectTask}
                      onRefresh={load}
                      selected={selected?.id === task.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-[57px] sm:w-[400px] sm:h-[calc(100vh-57px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-auto shadow-lg z-30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Task Details</span>
              <button onClick={() => setSelected(null)} className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-lg">✕</button>
            </div>

            {editingSelected ? (
              <TaskForm initial={selected} onSubmit={handleUpdate} onCancel={() => setEditingSelected(false)} />
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">{selected.title}</h2>
                {selected.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selected.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setShowPanelStatusMenu(v => !v)}
                      className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 ${statusStyles[selected.status]}`}
                    >
                      {selected.status.replace(/_/g, ' ')}
                    </button>
                    {showPanelStatusMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowPanelStatusMenu(false)} />
                        <div className="absolute left-0 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[130px]">
                          {statusOptions.map(s => (
                            <button
                              key={s}
                              onClick={async () => { setShowPanelStatusMenu(false); await updateTask(selected.id, { status: s }); load(); }}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 ${s === selected.status ? 'font-medium' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full inline-block ${statusStyles[s].split(' ')[0]}`} />
                              {s.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="relative inline-block">
                    <button
                      onClick={() => setShowPanelPriorityMenu(v => !v)}
                      className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 ${priorityStyles[selected.priority]}`}
                    >
                      {selected.priority}
                    </button>
                    {showPanelPriorityMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowPanelPriorityMenu(false)} />
                        <div className="absolute left-0 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                          {priorityOptions.map(p => (
                            <button
                              key={p}
                              onClick={async () => { setShowPanelPriorityMenu(false); await updateTask(selected.id, { priority: p }); load(); }}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 ${p === selected.priority ? 'font-medium' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full inline-block ${priorityStyles[p].split(' ')[0]}`} />
                              {p}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {selected.estimate !== null && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                      {selected.estimate} pts
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  Created: {new Date(selected.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setEditingSelected(true)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subtasks</span>
                    <button
                      onClick={() => setAddingSubtask(v => !v)}
                      className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      + Add
                    </button>
                  </div>
                  {addingSubtask && (
                    <div className="mb-3">
                      <TaskForm onSubmit={handleAddSubtask} onCancel={() => setAddingSubtask(false)} />
                    </div>
                  )}
                  <SubtaskTree subtasks={selected.subtasks ?? []} onRefresh={async () => {
                    const { getTask } = await import('@/lib/api');
                    const updated = await getTask(selected.id);
                    setSelected(updated);
                    load();
                  }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
